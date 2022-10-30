import 'dotenv/config';
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generatePolicyVendorRefence, nowDate } from '../util/util.js'
import { vendorNumbers } from '../util/constants.js';

const router = express.Router();

// get customer Infomation

router.post('/getCustomer', (req, res, next) => {

    const { mobileNumber, utilityAccount, policyType } = req.body;

    let productName;
    let merchantName;

    if (policyType === "NYARADZO") {
        productName = "NYARADZO";
        merchantName = "NYARADZO"

    } else {
        productName
    }

    axios.post(1, {
        "mti": "0200",
        "vendorReference": generatePolicyVendorRefence(),
        "processingCode": "310000",
        "vendorNumber": vendorNumbers.lifeAssurrance,
        "transactionAmount": 100,
        "sourceMobile": mobileNumber,
        "utilityAccount": utilityAccount,
        "productName": policyType,
        "merchantName": "NYARADZO",
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
        console.log(data)
    })
});


// make payment

router.post('/pay', (req, res, next) => {
    res.send('payment route from the life assurrence')
})





export default router;