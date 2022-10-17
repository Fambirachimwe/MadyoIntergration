import 'dotenv/config';
import express from 'express';
import axios from 'axios';


import { econetAirtimeController } from '../controllers/econetAirtime.controller.js'
import { netoneAirtimeController } from '../controllers/netoneAirtime.controller.js';




const router = express.Router();
const url = process.env.BASE_URL;

const econetSourceMobile = "263772978751";
const netoneSouceMobile = ""
const telecelSourveMobile = ""

/**
 * Transmission Date Format: MMDDYYHHmmss Description: The date and time when the message is sent. 
 * Example: 121713061713 represents 17 December 2013 at time 06:17:13 AM
 */

router.post(`/econet/buy`, econetAirtimeController);

router.post(`/netone/buy`, netoneAirtimeController);

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