import axios from 'axios';
import { randomString, generateAirtimeVendorRefence, nowDate, sendSMS } from '../util/util.js'
import Airtime from '../models/airtime.js';
import { vendorNumbers } from '../util/constants.js'
import { nanoid } from 'nanoid';


const url = process.env.BASE_URL;

const econetSourceMobile = "263772978751";  // this is our source  account phonenumber .... represents us as the merchant
const netoneSouceMobile = ""
const telecelSourveMobile = ""


export const econetAirtimeController = (req, res, next) => {

    // source mobile is the line which airtime is going to be deducted

    const { amount, targetMobile } = req.body;
    //  change the amount to cents

    const cents = amount * 100;
    if (cents > 2000) {
        return res.send("Failed to buy airtime. Maximum amount is $20.00")
    }
    else {
        axios.post(`${url}`,

            //  pass this data in the body of the api 
            {
                "mti": "0200",
                "vendorReference": generateAirtimeVendorRefence("econet"),
                "processingCode": "U50000",
                "vendorNumber": vendorNumbers.econet,
                "transactionAmount": cents,
                "sourceMobile": econetSourceMobile,
                "targetMobile": targetMobile,
                "utilityAccount": targetMobile,
                "merchantName": "ECONET",
                "productName": "ECONET_AIRTIME",
                "transmissionDate": nowDate(),
                "currencyCode": "ZWL"
            },
            // auth object

            {
                auth: {
                    username: process.env.API_USERNAME,
                    password: process.env.API_PASSWORD
                }
            }

        )
            .then(data => {
                if (data.data.responseCode === "05") {
                    res.json({
                        message: "Error",
                        description: data.data.narrative
                    })
                } else {
                    // save transaction in the database and  send and sms to 
                    // the client with the credited amount and the client final balance after airtime purchase

                    const { vendorReference, transactionAmount, utilityAccount, narrative, currencyCode, sourceMobile, targetMobile, transmissionDate } = data.data;

                    //  save the airtime transaction in the database 
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
                        date: transmissionDate
                    })
                        .save()
                        .then(() => {
                            //  send SMS to client using Twilio
                            // sendSMS(`+${targetMobile}`, data.data)
                        })

                    res.send(data.data)
                }
            })

    }


}