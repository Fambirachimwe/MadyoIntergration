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



    const { mobileNumber, utilityAccount, numberOfMonths } = req.body;
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

})





export default router;