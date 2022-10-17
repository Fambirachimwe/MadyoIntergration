import axios from 'axios';
import { generateAirtimeVendorRefence, nowDate, sendSMS } from '../util/util.js'
import Airtime from '../models/airtime.js'
import { nanoid } from 'nanoid'
import { testVendorNumber } from '../util/constants.js';


const url = process.env.BASE_URL;

const econetSourceMobile = "263772978751";
const netoneSouceMobile = "263719403033"
const telecelSourveMobile = ""


export const telecelAirtimeController = (req, res, next) => {

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
                "vendorReference": generateAirtimeVendorRefence("telecel"),
                // "vendorReference": "liveNetOne1222",
                "processingCode": "U50000",
                "vendorNumber": testVendorNumber, // this must be unique for each  vendor
                "transactionAmount": cents,
                "sourceMobile": netoneSouceMobile,
                "targetMobile": targetMobile,
                "utilityAccount": targetMobile,
                "merchantName": "TELECEL",
                "productName": "TELECEL_AIRTIME",
                "transmissionDate": nowDate(),
                "currencyCode": "ZWL",
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
                }

                //  still in progress
                if (data.data.responseCode === "09") {
                    //  resend the request again with the  reference number

                    res.send('transaction still in progress ');
                }


                else {
                    // save transaction in the database and  send and sms to 
                    // the client with the credited amount and the client final balance after airtime purchase

                    // console.log(data.data)

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
                            //  send SMS to client using Twilio
                            sendSMS(`+${targetMobile}`, data)
                        })

                    res.send(data.data)
                }
            })

    }


}