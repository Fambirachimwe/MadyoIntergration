import axios from 'axios';
import { generateAirtimeVendorRefence, mobilePay, nowDate, smsGateway } from '../util/util.js'
import Airtime from '../models/airtime.js'
import { nanoid } from 'nanoid'
import { vendorNumbers } from '../util/constants.js';
import crypto from 'crypto';
import { peseMobilePay } from '../util/pesepayUtil.js';
import { load } from 'cheerio';



const url = process.env.BASE_URL;
const telecelSourceMobile = "263719403033"


const decryptPayload = async (payload) => {
    var decipher = crypto.createDecipheriv('aes-256-cbc', `${process.env.PESE_ENCRYPTION_KEY}`, `${process.env.PESE_ENCRYPTION_KEY.slice(16)}`);

    let decrypted = decipher.update(payload, 'base64', 'utf8');
    let _obj = decrypted.replaceAll('{&', '{"') + decipher.final('utf8');
    const jsonObject = JSON.parse(_obj);


    // return data;
    return jsonObject;

}




export const telecelAirtimeControllerV2 = (req, res, next) => {

    // source mobile is the line which airtime is going to be deducted
    const { amount, targetMobile, payingNumber } = req.body;
    const cents = amount * 100;
    // validate if the paying number and the targetMobile is an econet phone number
    const netone = /^071/;   // regex for econet phone number
    const econet = /^077|^078/;
    let method;

    var my_status;

    if (econet.test(payingNumber)) { method = 'ecocash' }
    if (netone.test(payingNumber)) { method = 'onemoney' }


    // checking the transaction status pesPay
    const getTransStatusPese = async (pollUrl) => {

        let config = {
            headers: {
                "authorization": `${process.env.PESE_INTEGRATION_KEY}`,
                'Content-Type': 'application/json',
            }
        }

        try {
            const response = await axios.get(`${pollUrl}`, config);
            const _data = await decryptPayload(response.data.payload);
            if (_data.transactionStatus === "PENDING") {
                my_status = _data.transactionStatus;
                setTimeout(async () => {
                    await getTransStatusPese(pollUrl)
                }, 5000);
            } else {
                my_status = _data.transactionStatus;
                return
            }
        } catch (error) {
            my_status = "FAILED";
            console.log(error.response)
        }
    }

    // checking the transaction status for paynow
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

    if (method === "ecocash") {
        //  handle the transaction using pesepay
        // first make payment using ecocash
        peseMobilePay(amount, "ZWL", "PZW201", payingNumber)

            .then(async response => {
                // handle the response here

                if (response && response.success) {

                    while (my_status === "PENDING" || my_status === undefined) {
                        await getTransStatusPese(response.pollUrl);
                    }

                    if (my_status === "FAILED") {

                        console.log(my_status)

                        res.json({
                            error: 'err01',
                            message: "Mobile confirmation failed"
                        })
                        // console.log('Ca')
                    }

                    else if (my_status === "SUCCESS") {

                        console.log("ecocash transaction completed");

                        axios.post(`${url}`,
                            {
                                "mti": "0200",
                                "vendorReference": generateAirtimeVendorRefence("telecel"),
                                "processingCode": "U50000",
                                "vendorNumber": vendorNumbers._liveVendorNumber,
                                "transactionAmount": cents,
                                "sourceMobile": telecelSourceMobile,
                                "targetMobile": `263${targetMobile.slice(1)}`,
                                "utilityAccount": `263${targetMobile.slice(1)}`,
                                "merchantName": "TELECEL",
                                "productName": "TELECEL_AIRTIME",
                                "transmissionDate": nowDate(),
                                "currencyCode": "ZWL",

                            },
                            {
                                auth: {
                                    username: process.env.API_USERNAME,
                                    password: process.env.API_PASSWORD
                                }
                            }

                        )
                            .then(data => {

                                const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

                                // console.log(data.data)
                                if (data.data.responseCode === "05") {

                                    // save the failed transaction in the database
                                    //  save the airtime transaction in the database 
                                    new Airtime({
                                        orderNumber: nanoid(10),
                                        vendorReference: vendorReference,
                                        type: "telecel",
                                        amount: transactionAmount / 100,
                                        status: "failed",
                                        utilityAccount: utilityAccount,
                                        narrative: narrative,
                                        currencyCode, currencyCode,
                                        sourceMobile: sourceMobile,
                                        targetMobile: targetMobile,
                                        date: transmissionDate
                                    }).save();

                                    // res.send(data.data)
                                    console.log("General Error.. response code 05")
                                    return res.json({
                                        error: "err01",
                                        message: data.data.narrative,
                                        description: data.data
                                    })
                                } else {
                                    // save transaction in the database and  send an sms to 
                                    // the client with the credited amount and the client final balance after airtime purchase



                                    //  save the airtime transaction in the database 
                                    new Airtime({
                                        orderNumber: nanoid(10),
                                        vendorReference: vendorReference,
                                        type: "telecel",
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
                                            //  send SMS to client using Twilio


                                            // sendSMS(`${targetMobile}`, data.data)
                                            // using the Madyo sms gateway
                                            smsGateway(`Airtime Credited with $${transactionAmount / 100}00`, targetMobile);
                                        })

                                    res.send(data.data)
                                }
                            })


                        // handle everything here
                    }



                } else {
                    res.json({
                        error: "err01",
                        message: "Mobile money confirmation failed"
                    })
                }

            }).catch(err => {
                res.send(err)
            });


    } else {

        // handle the transaction with paynow here
        mobilePay(amount, method, `${payingNumber}`)
            .then(async response => {

                if (response && response.success) {
                    do {
                        await getTransactioStatus(response.pollUrl);
                    } while (my_status === "Sent" || my_status === undefined);


                    if (my_status === "Cancelled") {

                        return res.json({
                            error: 'err01',
                            message: "Mobile money confirmation failed"
                        })
                    }

                    else if (my_status === "Paid") {
                        console.log('mobile money transaction complete')
                        // continue the transaction here
                        // make a post request to the esolutions API
                        axios.post(`${url}`,
                            {
                                "mti": "0200",
                                "vendorReference": generateAirtimeVendorRefence("telecel"),
                                "processingCode": "U50000",
                                "vendorNumber": vendorNumbers._liveVendorNumber,
                                "transactionAmount": cents,
                                "sourceMobile": telecelSourceMobile,
                                "targetMobile": `263${targetMobile.slice(1)}`,
                                "utilityAccount": `263${targetMobile.slice(1)}`,
                                "merchantName": "TELECEL",
                                "productName": "TELECEL_AIRTIME",
                                "transmissionDate": nowDate(),
                                "currencyCode": "ZWL",


                            },
                            {
                                auth: {
                                    username: process.env.API_USERNAME,
                                    password: process.env.API_PASSWORD
                                }
                            }

                        )
                            .then(data => {
                                const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

                                if (data.data.responseCode === "05") {

                                    // save the failed transaction in the database
                                    new Airtime({
                                        orderNumber: nanoid(10),
                                        vendorReference: vendorReference,
                                        type: "telecel",
                                        amount: transactionAmount / 100,
                                        status: "failed",
                                        utilityAccount: utilityAccount,
                                        narrative: narrative,
                                        currencyCode, currencyCode,
                                        sourceMobile: sourceMobile,
                                        targetMobile: targetMobile,
                                        date: transmissionDate
                                    })
                                        .save()

                                    // res.send(data.data)
                                    console.log("General Error.. response code 05")
                                    return res.json({
                                        error: "err01",
                                        message: data.data.narrative,
                                        description: data.data
                                    })
                                } else {
                                    // save transaction in the database and  send an sms to 
                                    // the client with the credited amount and the client final balance after airtime purchase



                                    //  save the airtime transaction in the database 
                                    new Airtime({
                                        orderNumber: nanoid(10),
                                        vendorReference: vendorReference,
                                        type: "telecel",
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
                                            //  send SMS to client using Twilio

                                            console.log('..................', targetMobile)
                                            smsGateway(`Airtime Credited with $${transactionAmount / 100}.00`, targetMobile);
                                        })

                                    res.send(data.data)
                                }
                            })

                    }
                } else {
                    return res.json({
                        error: 'err01',
                        message: "Failed to make ecocash transaction"
                    })
                }

            })
    }








}