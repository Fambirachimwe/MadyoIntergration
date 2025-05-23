import axios from "axios";
import { nanoid } from "nanoid";
// instance of axios 
// import axios from '../util/axios.js'
import Zesa from "../models/zesa.js";
import { testVendorNumber, vendorNumbers } from "../util/constants.js";
import { failedZesaToken, generateZesaVendorRefence, sendZesaToken, tokenResend, nowDate, mobilePay, smsGateway } from "../util/util.js";
import { load } from 'cheerio';

// font awesome cdn 

// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.0/css/fontawesome.min.css" integrity="sha384-z4tVnCr80ZcL0iufVdGQSUzNvJsKjEtqYZjiQrrYKlpGow+btDHDfQWkFjoaz/Zr" crossorigin="anonymous">

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
            "vendorNumber": vendorNumbers._liveVendorNumber,
            "merchantName": "ZETDC",
            "productName": "ZETDC_PREPAID",
            "utilityAccount": `${meterNumber}`  // this is the meter number
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

    const { amount, meterNumber, phoneNumber, payingNumber } = req.body;  // the phone number is the paying phoneNumber on the frontend t

    // 41234567890  demo meterNumber
    const cents = amount * 100;
    const netone = /^071/;   // regex for econet phone number
    const econet = /^077|^078/;
    let method;

    // check if the paying number is an ecocash or onemoney number
    if (econet.test(payingNumber)) { method = 'ecocash' }
    if (netone.test(payingNumber)) { method = 'onemoney' }


    if (amount < 500) {

        res.json({
            error: 'err01',
            message: "Minimum amount allowed is $500.00"
        })


    } else {

        // console.log(amount)

        // make mobile payment here  using paynow
        mobilePay(amount, method, `${payingNumber}`).then(async (response) => {
            payingNumber
            // TODO: safe the payment in the database 

            if (response && response.success) {
                do {
                    await getTransactioStatus(response.pollUrl);
                } while (my_status === "Sent" || my_status === undefined);


                console.log(response);


                if (my_status === "Cancelled") {

                    my_status = "";
                    return res.json({
                        error: 'err01',
                        message: "Mobile money confirmation failed"
                    });

                }

                else if (my_status === "Paid") {
                    axios.post(`${url}`,
                        //  pass this data in the body of the api 
                        {
                            "mti": "0200",
                            "vendorReference": generateZesaVendorRefence(),
                            "processingCode": "U50000",
                            "transactionAmount": cents,
                            // "amount": 60000,  
                            "transmissionDate": nowDate(),
                            "vendorNumber": vendorNumbers._liveVendorNumber,  // replace this with the offical vendor number
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
                        // console.log('the response code ', data.data.responseCode)
                        const code = data.data.responseCode;

                        switch (code) {

                            case "00":
                                new Zesa({ ...data.data, orderNumber: nanoid(10) })
                                    .save()
                                    .then(saved_data => {
                                        console.log('saved into the database ', saved_data);
                                        // send token via sms 
                                        sendZesaToken(saved_data.token, phoneNumber, meterNumber, amount);
                                    });

                                res.json({
                                    message: data.data.narrative,
                                    data: data.data,
                                    code: "00"
                                })

                                break

                            case "09":
                                console.log('token resend after 60seconds');
                                // TODO: set a timeout here to resend token purchase request

                                const _resend = () => {
                                    tokenResend(data.data).then(result => {
                                        console.log('into token resend......')

                                        if (result.data.responseCode === "09") {
                                            // TODO: save the failed transaction in the database 
                                            // console.log(result.data)
                                            new Zesa({ ...data.data, orderNumber: nanoid(10) })
                                                .save()
                                                .then(saved_data => {

                                                    // console.log(phoneNumber)
                                                    console.log('saved failed token into the database ............. ');
                                                    // failedZesaToken(phoneNumber, "token puchase in progress.. you will receive a message in short while");
                                                    res.json({
                                                        message: "Token purchase still in progress",
                                                        request: saved_data,
                                                        error: "err01",
                                                        code: "09"
                                                    })


                                                })


                                        }

                                        else if (result.data.responseCode === "00") {

                                            // save into the database 
                                            new Zesa({ ...data.data, orderNumber: nanoid(10) })
                                                .save()
                                                .then(saved_data => {
                                                    console.log('saved into the database ', saved_data);
                                                    sendZesaToken(phoneNumber, saved_data.token);
                                                });

                                            res.json({
                                                message: "Token purchase successfull",
                                                reponse: saved_data,
                                                code: "00"

                                            })
                                        }

                                    });
                                }

                                res.json({
                                    code: "09",
                                    message: "transaction still in progress"
                                })


                                setTimeout(() => {
                                    _resend();

                                }, 60000);

                                // timeout to resend the token purchase request

                                break;

                            case "05":
                                // send the response to the frontend 
                                console.log(data.data.narrative);
                                new Zesa({ ...data.data, orderNumber: nanoid(10) })
                                    .save()
                                    .then(saved_data => {
                                        console.log('saved failed request into the database ', saved_data);
                                        sendZesaToken(phoneNumber, saved_data.token);
                                    });
                                res.json({
                                    message: data.data.narrative,
                                    payload: data.data,
                                    error: "err01",
                                    code: "05"
                                })

                                break;

                            default:
                                break;
                        }

                        my_status = "";


                    })

                }




            }

            else {
                // send an error response
                res.json({
                    message: "Error, failed to deduct money from mobile account",
                    // description: data.data
                    error: "err01"
                });
                my_status = "";
            }

        })


    }

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