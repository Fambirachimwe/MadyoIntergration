import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generatePolicyVendorRefence, getCustomerPolicy, nowDate } from '../util/util.js'
import { vendorNumbers } from '../util/constants.js';
import Life from "../models/lifeAssurance.js"


const router = express.Router();
const url = process.env.BASE_URL;

// get customer Infomation

router.post('/getCustomer', (req, res, next) => {

    const { mobileNumber, utilityAccount, policyType } = req.body;

    let productName;
    let merchantName;

    if (policyType === 1) {
        productName = "NYARADZO";
        merchantName = "NYARADZO"

    } else {
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
        res.send(data.data)
    })
});


// make payment

router.post('/pay', (req, res, next) => {



    const { mobileNumber, utilityAccount, balance, numberOfMonths, monthlySubscription } = req.body;
    let _transactionAmount;
    const url = process.env.BASE_URL;


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
                const monthlyPremium = data.data.amount;
                const balance = data.data.customerBalance;

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
                        "customerData": `${numberOfMonths}|${monthlySubscription}`,
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
                                message: data.data.narrative
                            })
                        } else {

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

    // policy type 

    // const _transactionAmount = balance + (numberOfMonths * monthlySubscription);




})





export default router;