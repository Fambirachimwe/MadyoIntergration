import 'dotenv/config';
import express from 'express';
import axios from 'axios';


const router = express.Router();
const url = process.env.BASE_URL;

// Sample Customer Information Request
router.post(`/getCustomer`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": "031423091351",
            "processingCode": "310000",
            "transmissionDate": "30920081415",
            "vendorNumber": "VE19217695801",
            "merchantName": "DSTV",
            "productName": "DSTV",
            "utilityAccount": "0501000608"
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


router.post(`/pay`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        { "mti": "0200", "vendorReference": "kkk0001344ewr2", "processingCode": "520000", "vendorNumber": "VE19257147501", "transactionAmount": 1000000, "amount": 1000000, "sourceMobile": "263732000100", "utilityAccount": "0501000608", "merchantName": "DSTV", "productName": "DSTV", "transmissionDate": 91916182800, "currencyCode": "USD" },
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






export default router