import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generatePolicyVendorRefence, nowDate } from '../util/util.js'
import { vendorNumbers } from '../util/constants.js';

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
    res.send('payment route from the life assurrence')
})





export default router;