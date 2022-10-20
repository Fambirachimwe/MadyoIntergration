import axios from 'axios';
import { generateAirtimeVendorRefence, nowDate, sendSMS } from '../util/util.js'
import Airtime from '../models/airtime.js'
import { nanoid } from 'nanoid'
import { testVendorNumber } from '../util/constants.js';


const url = process.env.BASE_URL;

const econetSourceMobile = "263772978751";
const netoneSouceMobile = "263719403033"
const telecelSourceMobile = ""


export const telecelAirtimeController = (req, res, next) => {

    // source mobile is the line which airtime is going to be deducted
    const { amount, targetMobile, payingNumber } = req.body;
    const cents = amount * 100;

    if (cents > 2000) {
        return res.send("Failed to buy airtime. Maximum amount is $20.00")
    }
    else {
        // validate if the paying number and the targetMobile is an econet phone number
        const econet = /^078|^077/;   // regex for econet phone number

        if (econet.test(`0${payingNumber.slice(3)}`)) {

            // first make payment using ecocash
            mobilePay(amount, 'ecocash', `0${payingNumber.slice(3)}`).then(response => {

                if (response && response.success) {
                    console.log('ecocash transaction complete');

                    // continue the transaction here
                    // make a post request to the esolutions API

                    axios.post(`${url}`,
                        {
                            "mti": "0200",
                            "vendorReference": generateAirtimeVendorRefence("telecel"),
                            "processingCode": "U50000",
                            "vendorNumber": vendorNumbers.telecel,
                            "transactionAmount": cents,
                            "sourceMobile": telecelSourceMobile,
                            "targetMobile": targetMobile,
                            "utilityAccount": targetMobile,
                            "merchantName": "TELECEL",
                            "productName": "TELECEL_AIRTIME",
                            "transmissionDate": nowDate(),
                            "currencyCode": "ZWL"
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
                                    message: "Error",
                                    description: data.data.narrative
                                })
                            } else {
                                // save transaction in the database and  send an sms to 
                                // the client with the credited amount and the client final balance after airtime purchase

                                const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

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
                                        sendSMS(`+${targetMobile}`, data.data)
                                    })

                                res.send(data.data)
                            }
                        })




                } else {
                    res.send('Failed to make ecocash transaction')
                }
            })

        } else {
            res.send("Invalid ecocash Number");
        }

    }


}