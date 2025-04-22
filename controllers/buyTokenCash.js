import axios from 'axios';
import { generateZesaVendorRefence, nowDate, sendZesaToken, tokenResend } from '../util/util.js';
import { vendorNumbers } from '../util/constants.js';
import Zesa from '../models/zesa.js';
import { nanoid } from 'nanoid';


const url = process.env.BASE_URL;

export const buyTokenCash = (req, res, next) => {

    const { amount, meterNumber, targetMobile, payingNumber, currencyCode } = req.body;  // the phone number is the paying phoneNumber on the frontend t
    // 41234567890  demo meterNumber

    // currency code is either ZWD OR USD


    const suppliedData = {
        amount, meterNumber, targetMobile,
    }; payingNumber

    const phoneNumber = targetMobile;

    console.log(suppliedData);

    const cents = amount * 100;  // send this amount the e solutions api
    const orderNumber = nanoid(10);

    axios.post(`${url}`,
        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": generateZesaVendorRefence(),
            "processingCode": "U50000",
            "transactionAmount": cents,
            "amount": cents,
            "transmissionDate": nowDate(),
            "vendorNumber": vendorNumbers._liveVendorNumber,  // replace this with the offical vendor number
            "terminalID": "POS001",
            "merchantName": "ZETDC",
            "utilityAccount": meterNumber,  // this is the meter number of the customer 
            "aggregator": "POWERTEL",
            "productName": "ZETDC_PREPAID",
            "currencyCode": currencyCode,
            "apiVersion": "02"
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
                new Zesa({ ...data.data, orderNumber: orderNumber })
                    .save()
                    .then(saved_data => {
                        console.log('saved into the database ', saved_data);
                        sendZesaToken(phoneNumber, saved_data);
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
                                    sendZesaToken(phoneNumber, saved_data);
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
                        // sendZesaToken(phoneNumber, saved_data);
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




    })


}