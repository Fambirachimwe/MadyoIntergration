import 'dotenv/config';
import express from 'express';
import axios from 'axios';

import { randomString } from '../util/util.js'


const router = express.Router();
const url = process.env.BASE_URL;


// ZETDC Prepaid Electricity Tokens

// JSON Customer Information request

router.post(`/getCustomer`, (req, res, next) => {


    axios.post(`${url}`,

        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": randomString(16, 'aA'),
            "processingCode": "310000",
            "transactionAmount": 50000,
            "transmissionDate": "30920081415",
            "vendorNumber": "VE20245865801",
            "merchantName": "ZETDC",
            "productName": "ZETDC_PREPAID",
            "utilityAccount": "48205673603"  // this is the meter number
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
});



// 

//  token purchase

router.post(`/buyToken`, (req, res, next) => {


    axios.post(`${url}`,
        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": "031423791358",
            "processingCode": "U50000",
            "transactionAmount": 60000,
            "amount": 60000,
            "transmissionDate": "30920081415",
            "vendorNumber": "VE20245865801",
            "terminalID": "POS001",
            "merchantName": "ZETDC",
            "utilityAccount": "41234567890",
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
        res.send(data.data)
    })
});


// Sample JSON Token Resend Request
//  this will be used after the the request has failed to purchase the token

router.post(`/tokenResend`, (req, res, next) => {


    axios.post(`${url}`,
        //  pass this data in the body of the api 
        {
            "mti": "0201",
            "vendorReference": "32408403240",
            "processingCode": "U50000",
            "vendorNumber": "VE20245865801",

            "utilityAccount": "41234567890",
            "transactionAmount": 5000,
            "transmissionDate": "30920081415",
            "originalReference": "031423091358",
            "merchantName": "ZETDC",
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
        res.send(data.data)
    })
});



export default router;


