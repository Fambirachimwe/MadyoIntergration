import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { randomString } from '../util/util.js'

const router = express.Router();
const url = process.env.BASE_URL;

router.post(`/econet/buy`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        { "mti": "0200", "vendorReference": randomString(16, 'aA'), "processingCode": "U50000", "vendorNumber": "VE20245865801", "transactionAmount": 500, "sourceMobile": "263772978751", "targetMobile": "263776412771", "utilityAccount": "263772978751", "merchantName": "ECONET", "productName": "ECONET_AIRTIME", "transmissionDate": 91916182800, "currencyCode": "ZWL" },
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

router.post(`/netone/buy`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        { "mti": "0200", "vendorReference": "liveNetOne13", "processingCode": "U50000", "vendorNumber": "VE19257147501", "transactionAmount": 100, "originalReference": null, "sourceMobile": "26371XXXXXX", "targetMobile": "26371XXXXXX", "utilityAccount": "26371XXXXXX", "merchantName": "NETONE", "productName": "NETONE_AIRTIME", "transmissionDate": 91916182800, "currencyCode": "ZWL", "serviceId": "CS" },
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

router.post(`/telecel/buy`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        { "mti": "0200", "vendorReference": "liveTelecel03", "processingCode": "U50000", "vendorNumber": "VE19257147501", "transactionAmount": 100, "sourceMobile": "26373XXXXXX", "targetMobile": "26373XXXXXX", "utilityAccount": "26373XXXXXX", "merchantName": "TELECEL", "productName": "TELECEL_AIRTIME", "transmissionDate": 91916182800, "currencyCode": "ZWL" },
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