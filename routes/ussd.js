import 'dotenv/config';
import axios from 'axios';
import { generateAirtimeVendorRefence, nowDate, sendSMS, mobilePay, newSmsGateway } from '../util/util.js'
import Airtime from '../models/airtime.js';
import express from "express";
import { vendorNumbers } from '../util/constants.js';
import { load } from 'cheerio';

const router = express.Router();

var my_status;
const url = process.env.BASE_URL;

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





router.post('/airtime/buy', (req, res, next) => {
    const { type, amount, targetMobile, payingNumber, method } = req.body;

    // airtime type   econet

    const econetNumber = /^077|^078/;
    if (type === "econet") {

        if (econetNumber.test(`0${targetMobile.slice(3)}`)) {
            mobilePay(amount, method, `0${payingNumber.slice(3)}`)
                .then(async response => {
                    if (response && response.success) {

                        // process econet airtime purchase here
                        res.json({
                            message: "Transaction is being processed",
                            responseCode: "00"
                        });

                        do {
                            await getTransactioStatus(response.pollUrl);
                        } while (my_status === "Sent" || my_status === undefined);

                        if (my_status === "Paid") {

                            axios.post(`${url}`,
                                {
                                    "mti": "0200",
                                    "vendorReference": generateAirtimeVendorRefence("econet"),
                                    "processingCode": "U50000",
                                    "vendorNumber": vendorNumbers.econet,
                                    "transactionAmount": amount * 100,
                                    "sourceMobile": "263782824073",
                                    "targetMobile": targetMobile,
                                    "utilityAccount": targetMobile,
                                    "merchantName": "ECONET",
                                    "productName": "ECONET_AIRTIME",
                                    "transmissionDate": nowDate(),
                                    "currencyCode": "ZWL",

                                },
                                {
                                    auth: {
                                        username: process.env.API_USERNAME,
                                        password: process.env.API_PASSWORD
                                    }
                                }

                            ).then(data => {
                                if (data.data.responseCode === "00") {

                                    const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

                                    new Airtime({
                                        orderNumber: nanoid(10),
                                        vendorReference: vendorReference,
                                        type: "econet",
                                        amount: transactionAmount / 100,
                                        status: "success",
                                        utilityAccount: utilityAccount,
                                        narrative: narrative,
                                        currencyCode, currencyCode,
                                        sourceMobile: sourceMobile,
                                        targetMobile: targetMobile,
                                        date: transmissionDate,
                                        channel: "ussd"

                                    }).save()
                                        .then(() => {
                                            // send an sms to the target mobile using the Madyo gateway

                                            newSmsGateway(data, `${targetMobile}`);
                                            console.log('saved airtime from ussd application');
                                        })

                                }
                            })

                        }





                    } else {
                        return {
                            message: "Failed to process transaction",
                            responseCode: "05"
                        }
                    }
                })
        } else {
            res.send("invalid Econet Number")
        }

    }


})


export default router;

