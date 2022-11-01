import axios from 'axios';
import { generateAirtimeVendorRefence, mobilePay, nowDate, smsGateway } from '../util/util.js'
import Airtime from '../models/airtime.js'
import { nanoid } from 'nanoid'
import { vendorNumbers } from '../util/constants.js';
import { load } from 'cheerio';


const url = process.env.BASE_URL;
const netoneSouceMobile = "263719403033"


var my_status;

const getTransactioStatus = async (_polUrl) => {
    const response = await axios.get(_polUrl);
    const $ = load(response.data);
    const splited = $('body').text().split('&')
    let reference, paynowReference, amount, status, polUrl, hash;

    reference = splited[0].split('=')[1].replaceAll('%', ' ');
    paynowReference = splited[1].split('=')[1].replaceAll('%', ' ');
    amount = splited[2].split('=')[1].replaceAll('%', ' ');
    status = splited[3].split('=')[1].replaceAll('%', ' ');
    polUrl = splited[4].split('=')[1].replaceAll('%', ' ');
    hash = splited[5].split('=')[1].replaceAll('%', ' ');

    if (status === "Sent") {
        my_status = status;
        console.log(status)

        setTimeout(() => {
            getTransactioStatus(_polUrl)
        }, 5000);

    } else {

        console.log('chage the status', status);
        my_status = status;
        // return transactionStatus;
    }
}

export const netoneAirtimeController = (req, res, next) => {

    // source mobile is the line which airtime is going to be deducted
    const { amount, targetMobile, payingNumber } = req.body;
    const cents = amount * 100;
    // validate if the paying number and the targetMobile is an econet phone number
    const netone = /^071/;   // regex for econet phone number
    const econet = /^077|^078/;
    let method;

    // check if the paying number is an ecocash or onemoney number
    if (econet.test(payingNumber)) { method = 'ecocash' }
    if (netone.test(payingNumber)) { method = 'onemoney' }



    // first make payment using ecocash
    mobilePay(amount, method, `${payingNumber}`).then(async response => {

        if (response && response.success) {
            do {
                await getTransactioStatus(response.pollUrl);
            } while (my_status === "Sent" || my_status === undefined);


            if (my_status === "Cancelled") {

                return res.json({
                    error: 'err01',
                    message: "Mobile confirmation failed"
                })
            }

            else if (my_status === "Paid") {
                console.log('ecocash transaction complete')
                // continue the transaction here
                // make a post request to the esolutions API
                axios.post(`${url}`,
                    {
                        "mti": "0200",
                        "vendorReference": generateAirtimeVendorRefence("netone"),
                        "processingCode": "U50000",
                        "vendorNumber": vendorNumbers._liveVendorNumber,
                        "transactionAmount": cents,
                        "sourceMobile": netoneSouceMobile,
                        "targetMobile": targetMobile,
                        "utilityAccount": targetMobile,
                        "merchantName": "NETONE",
                        "productName": "NETONE_AIRTIME",
                        "transmissionDate": nowDate(),
                        "currencyCode": "ZWL",
                        "serviceId": "CS"

                    },
                    {
                        auth: {
                            username: process.env.API_USERNAME,
                            password: process.env.API_PASSWORD
                        }
                    }

                )
                    .then(data => {
                        if (data.data.responseCode === "05") {

                            // res.send(data.data)
                            console.log("General Error.. response code 05")
                            res.json({
                                error: "err01",
                                message: data.data.narrative,
                                description: data.data
                            })
                        } else {
                            // save transaction in the database and  send an sms to 
                            // the client with the credited amount and the client final balance after airtime purchase

                            const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

                            //  save the airtime transaction in the database 
                            new Airtime({
                                orderNumber: nanoid(10),
                                vendorReference: vendorReference,
                                type: "netone",
                                amount: transactionAmount / 100,
                                status: "success",
                                utilityAccount: utilityAccount,
                                narrative: narrative,
                                currencyCode, currencyCode,
                                sourceMobile: sourceMobile,
                                targetMobile: targetMobile,
                                date: transmissionDate
                            })
                                .save()
                                .then(() => {
                                    //  send SMS to client using  the e-solutions gateway

                                    smsGateway(`Airtime Credited with $${transactionAmount / 100}00`, targetMobile);
                                })

                            res.send(data.data)
                        }
                    })

            }
        } else {
            return res.json({
                error: 'err01',
                message: "Failed to make mobile transaction"
            })
        }

    })
}