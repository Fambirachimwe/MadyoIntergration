import 'dotenv/config';
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generatePolicyVendorRefence } from '../util/util.js'

const router = express.Router();

// get customer Infomation

router.post('/getCustomer', (req, res, next) => {

    axios.post(1, {
        "mti": "0200",
        "vendorReference": generatePolicyVendorRefence(),
        "processingCode": "310000",
        "vendorNumber": vendorNumbers.lifeAssurrance,
        "transactionAmount": 100,
        "sourceMobile": "263772731006",
        "utilityAccount": "nlaco001931", Number,
        "productName": "NYARADZO",
        "merchantName": "NYARADZO",
        "transmissionDate": 91916182800,
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