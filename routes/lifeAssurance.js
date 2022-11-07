import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generatePolicyVendorRefence, getCustomerPolicy, mobilePay, nowDate } from '../util/util.js'
import { vendorNumbers } from '../util/constants.js';
import Life from "../models/lifeAssurance.js"
import { nanoid } from 'nanoid';
import { addPayment } from '../util/paymentUtil.js';
import { peseMobilePay } from '../util/pesepayUtil.js';


const router = express.Router();
const url = process.env.BASE_URL;

// get customer Infomation

router.post('/getCustomer', (req, res, next) => {

    const { mobileNumber, utilityAccount, policyType } = req.body;

    let productName;
    let merchantName;

    console.log(policyType);

    if (policyType == 1) {
        productName = "NYARADZO";
        merchantName = "NYARADZO"

    } else if (policyType === 2) {
        productName = "MOONLIGHT";
        merchantName = "MOONLIGHT"
    }

    axios.post(`${url}`, {
        "mti": "0200",
        "vendorReference": generatePolicyVendorRefence(),
        "processingCode": "310000",
        "vendorNumber": vendorNumbers._liveVendorNumber,
        "transactionAmount": 100,
        "sourceMobile": mobileNumber,
        "utilityAccount": utilityAccount,
        "productName": productName,
        "merchantName": merchantName,
        "transmissionDate": nowDate(),
        "currencyCode": "ZWL"
    },
        {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        }

    ).then(data => {
        console.log(data.data)
        res.send(data.data)
    }).catch(err => {
        res.status(400).json({
            "error": "faled to get customer infomation check your internet connectivy",
            err
        })
    })
});


// make payment

router.post('/pay', (req, res, next) => {

    // handle payments here using Pesepay or Paynow 



    const { mobileNumber, utilityAccount, numberOfMonths, payingNumber } = req.body;
    let _transactionAmount;
    const url = process.env.BASE_URL;

    const netone = /^071/;   // regex for econet phone number
    const econet = /^077|^078/;


    let method;
    var my_status;

    const orderNumber = nanoid(10)

    if (econet.test(payingNumber)) { method = 'ecocash' }
    if (netone.test(payingNumber)) { method = 'onemoney' }

    // console.log(method)


    // checking the transaction status for pese pay
    const getTransStatusPese = async (pollUrl) => {

        let config = {
            headers: {
                "authorization": `${process.env.PESE_INTEGRATION_KEY}`,
                'Content-Type': 'application/json',
            }
        }

        try {
            const response = await axios.get(`${pollUrl}`, config);

            const decryptPayload = async (payload) => {
                var decipher = crypto.createDecipheriv('aes-256-cbc', `${process.env.PESE_ENCRYPTION_KEY}`, `${process.env.PESE_ENCRYPTION_KEY.slice(16)}`);
                let decrypted = decipher.update(payload, 'base64', 'utf8');
                let _obj = decrypted.replaceAll('{&', '{"') + decipher.final('utf8');
                const jsonObject = JSON.parse(_obj);
                return jsonObject;

            }

            //  add the decryption function here 


            const _data = await decryptPayload(response.data.payload);
            // console.log('this is the decrypted data', _data);

            if (_data) {
                if (_data.transactionStatus === "PENDING") {
                    my_status = _data.transactionStatus;
                    setTimeout(async () => {
                        await getTransStatusPese(pollUrl)
                    }, 5000);
                } else {
                    my_status = _data.transactionStatus;
                    return
                }
            }



        } catch (error) {
            my_status = "FAILED";
            console.log(error)
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

        peseMobilePay(amount, "ZWL", "PZW201", payingNumber)
            .then(async response => {
                if (response && response.success) {
                    while (my_status === "PENDING" || my_status === undefined) {

                        console.log(my_status)
                        await getTransStatusPese(response.pollUrl);
                    }

                    if (my_status === "FAILED") {
                        // console.log(my_status)
                        addPayment('pese', amount, 'zesa', "failed", orderNumber, method)
                        my_status = "";
                        return res.json({
                            error: 'err01',
                            message: "Mobile confirmation failed"
                        })
                        // console.log('Ca')
                    }

                    else if (my_status === "SUCCESS") {

                        console.log("ecocash transaction completed");
                        addPayment('pese', amount, 'zesa', "success", orderNumber, method);

                        getCustomerPolicy(utilityAccount, mobileNumber, 1)
                            .then(data => {
                                if (data.data.responseCode === "05") {
                                    res.json({
                                        error: "err01",
                                        message: "Failed to verify policy number"
                                    })
                                } else {
                                    // get customer data 

                                    const customerData = data.data.customerData.split("|");
                                    const monthlyPremium = parseInt(data.data.amount);
                                    const balance = parseInt(data.data.customerBalance);

                                    _transactionAmount = balance ? balance : 0 + (numberOfMonths * monthlyPremium);


                                    axios.post(`${url}`,
                                        {
                                            "mti": "0200",
                                            "vendorReference": generatePolicyVendorRefence(),
                                            "processingCode": "U50000",
                                            "vendorNumber": vendorNumbers._liveVendorNumber,
                                            "transactionAmount": _transactionAmount * 100,
                                            "sourceMobile": mobileNumber,
                                            "utilityAccount": utilityAccount,
                                            "customerData": `${numberOfMonths}|${monthlyPremium}`,
                                            "merchantName": "NYARADZO",
                                            "productName": "NYARADZO",
                                            "transmissionDate": nowDate(),
                                            "currencyCode": "ZWL"
                                        }
                                        , {
                                            auth: {
                                                username: process.env.API_USERNAME,
                                                password: process.env.API_PASSWORD
                                            }
                                        }).then(response => {
                                            if (response.data.responseCode === "05") {
                                                return res.json({
                                                    error: "err01",
                                                    message: data.data.narrative,
                                                    responseCode: response.data.responseCode
                                                })
                                            }

                                            if (response.data.responseCode === "09") {
                                                return res.json({
                                                    error: "err01",
                                                    message: data.data.narrative,
                                                    responseCode: response.data.responseCode
                                                })
                                            }


                                            else {

                                                // save the transaction in the database
                                                new Life({
                                                    ...response.data
                                                }).save()
                                                    .then(data => {
                                                        res.json({
                                                            message: "transaction successfull",
                                                            payload: data

                                                        })
                                                    })

                                            }
                                        }
                                        )



                                }
                            })


                    }

                }
            })
    } else {

        mobilePay(amount, method, `${payingNumber}`)
            .then(async response => {

                if (response && response.success) {
                    do {
                        await getTransactioStatus(response.pollUrl);
                    } while (my_status === "Sent" || my_status === undefined);


                    console.log(response);


                    if (my_status === "Cancelled") {

                        addPayment('paynow', amount, 'zesa', "failed", orderNumber, method)

                        my_status = "";
                        return res.json({
                            error: 'err01',
                            message: "Mobile money confirmation failed"
                        });

                    }
                    else if (my_status === "Paid") {

                        addPayment('paynow', amount, 'zesa', "success", orderNumber, method);

                        getCustomerPolicy(utilityAccount, mobileNumber, 1)
                            .then(data => {
                                if (data.data.responseCode === "05") {
                                    res.json({
                                        error: "err01",
                                        message: "Failed to verify policy number"
                                    })
                                } else {
                                    // get customer data 

                                    const customerData = data.data.customerData.split("|");
                                    const monthlyPremium = parseInt(data.data.amount);
                                    const balance = parseInt(data.data.customerBalance);

                                    _transactionAmount = balance ? balance : 0 + (numberOfMonths * monthlyPremium);


                                    axios.post(`${url}`,
                                        {
                                            "mti": "0200",
                                            "vendorReference": generatePolicyVendorRefence(),
                                            "processingCode": "U50000",
                                            "vendorNumber": vendorNumbers._liveVendorNumber,
                                            "transactionAmount": _transactionAmount * 100,
                                            "sourceMobile": mobileNumber,
                                            "utilityAccount": utilityAccount,
                                            "customerData": `${numberOfMonths}|${monthlyPremium}`,
                                            "merchantName": "NYARADZO",
                                            "productName": "NYARADZO",
                                            "transmissionDate": nowDate(),
                                            "currencyCode": "ZWL"
                                        }
                                        , {
                                            auth: {
                                                username: process.env.API_USERNAME,
                                                password: process.env.API_PASSWORD
                                            }
                                        }).then(response => {
                                            if (response.data.responseCode === "05") {
                                                return res.json({
                                                    error: "err01",
                                                    message: data.data.narrative,
                                                    responseCode: response.data.responseCode
                                                })
                                            }

                                            if (response.data.responseCode === "09") {
                                                return res.json({
                                                    error: "err01",
                                                    message: data.data.narrative,
                                                    responseCode: response.data.responseCode
                                                })
                                            }


                                            else {

                                                // save the transaction in the database
                                                new Life({
                                                    ...response.data
                                                }).save()
                                                    .then(data => {
                                                        res.json({
                                                            message: "transaction successfull",
                                                            payload: data

                                                        })
                                                    })

                                            }
                                        }
                                        )



                                }
                            })



                    }



                }
            }
            )

    }







})





export default router;