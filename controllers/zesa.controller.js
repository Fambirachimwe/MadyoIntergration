import axios from "axios";
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


    const { amount, meterNumber, phoneNumber, method } = req.body;

    // 41234567890  demo meterNumber
    const cents = amount * 100;

    // make mobile payment here  using paynow
    mobilePay(amount, method, phoneNumber).then(() => {
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

            if (data.data.responseCode !== "00") {

                // set a timeout to resend the request again   
                setTimeout(() => {
                    tokenResend(data).then(response => {

                        if (response.data.responseCode === "00") {
                            new Zesa({ ...response.data, orderNumber: nanoid(10) })
                                .save()
                                .then(saved_data => {
                                    //  save the transaction fater it has been saved into the database 
                                    sendZesaToken(phoneNumber, saved_data.token);
                                })
                            res.send(response.data)

                        } else {

                            failedZesaToken(phoneNumber, "failed to purchase zesa token")

                            res.json({
                                message: "failed to purchase token ",
                                payload: response.data.narrative
                            })
                        }
                    })

                }, 3000);  // specify the time  after 60sec.. 


            } else {

                // save the transaction in the database

                new Zesa({ ...data.data, orderNumber: nanoid(10) })
                    .save()
                    .then(saved_data => {
                        console.log('saved into the database ', saved_data);
                        sendZesaToken(phoneNumber, saved_data.token);
                    })


                res.send(data.data)
            }

        })
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