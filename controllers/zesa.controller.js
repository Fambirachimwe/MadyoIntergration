// import axios from "axios";
// instance of axios 
import axios from '../util/axios.js'
import Zesa from "../models/zesa.js";
import { testVendorNumber } from "../util/constants.js";
import { failedZesaToken, generateZesaVendorRefence, sendZesaToken, tokenResend, nowDate, mobilePay } from "../util/util.js";


const url = process.env.BASE_URL;

export const getCustomer = (req, res, next) => {

    const { meterNumber } = req.body;
    // const cents = amount * 100;


    axios.post(`${url}`,

        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": generateZesaVendorRefence(),
            "processingCode": "310000",
            "transactionAmount": 50000,  // this is  only specified in the documentaion but does not make sense
            "transmissionDate": nowDate(),
            "vendorNumber": "VE20245865801",
            "merchantName": "ZETDC",
            "productName": "ZETDC_PREPAID",
            "utilityAccount": meterNumber  // this is the meter number
        },
        // auth object

        {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        }



    ).then(data => {
        res.send(data.data)
    })
}

export const buyToken = (req, res, next) => {

    const { amount, meterNumber, phoneNumber, method } = req.body;  // the phone number is the paying phoneNumber on the frontend t

    // 41234567890  demo meterNumber
    const cents = amount * 100;
    // console.log(phoneNumber)

    // make mobile payment here  using paynow
    mobilePay(amount, method, phoneNumber).then((response) => {



        if (response && response.success) {

            axios.post(`${url}`,
                //  pass this data in the body of the api 
                {
                    "mti": "0200",
                    "vendorReference": generateZesaVendorRefence(),
                    "processingCode": "U50000",
                    "transactionAmount": cents,
                    // "amount": 60000,  
                    "transmissionDate": nowDate(),
                    "vendorNumber": testVendorNumber,  // replace this with the offical vendor number
                    "terminalID": "POS001",
                    "merchantName": "ZETDC",
                    "utilityAccount": meterNumber,  // this is the meter number of the customer 
                    "aggregator": "POWERTEL",
                    "productName": "ZETDC_PREPAID",
                    "currencyCode": "ZWL"
                },
                // auth object

                {
                    auth: {
                        username: process.env.API_USERNAME,
                        password: process.env.API_PASSWORD
                    }
                }

            ).then(data => {
                // res.send(data.data)
                // console.log(data.data)

                switch (data.data.reponseCode) {

                    case "00":
                        new Zesa({ ...data.data, orderNumber: nanoid(10) })
                            .save()
                            .then(saved_data => {
                                console.log('saved into the database ', saved_data);
                                sendZesaToken(phoneNumber, saved_data.token);
                            })
                        res.send(data.data)
                        break

                    case "09":
                        setTimeout(() => {
                            console.log('token resend')
                            tokenResend(data.data).then(result => {

                                if (result.data.responseCode !== "00") {

                                    console.log('failed to purchase zesa token , please return the money via ecocash')
                                    // TODO: send a failed zesa token sms



                                    // TODO: return the money to the user via ecocash

                                } else {

                                    // save into the database 
                                    new Zesa({ ...data.data, orderNumber: nanoid(10) })
                                        .save()
                                        .then(saved_data => {
                                            console.log('saved into the database ', saved_data);
                                            sendZesaToken(phoneNumber, saved_data.token);
                                        })
                                }

                            })
                        }, 6000);  // timeout to resend the token purchase request

                        break;

                    case "05":
                        // send the response to the frontend 
                        res.json({
                            message: "Error",
                            payload: data.data
                        })

                    default:
                        break;
                }


            })
        } else {
            // send an error response
            res.json({
                message: "Error, failed to deduct money from ecocash account",
                description: data.data
            })
        }

    })

}

export const tokenResendController = (req, res, next) => {

    const prevRequest = req.body;
    axios.post(`${url}`,
        //  pass this data in the body of the api 
        { ...prevRequest },
        // auth object
        {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        }

    ).then(data => {
        res.send(data.data)
    })
}