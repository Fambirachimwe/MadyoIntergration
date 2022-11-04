import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { generateTeloneVendorRefence, nowDate } from '../util/util.js'
import { vendorNumbers } from '../util/constants.js';

const router = express.Router();
const url = process.env.BASE_URL;


// get customer informantion
router.post('/getCustomer', (req, res, next) => {
    const { utilityAccount } = req.body;

    axios.post(`${url}`, {

        "mti": "0200",
        "vendorReference": generateTeloneVendorRefence(),
        "processingCode": "310000",
        "transactionAmount": 241300,
        "transmissionDate": nowDate(),
        "vendorNumber": vendorNumbers._liveVendorNumber,
        "merchantName": "TELONE",
        "utilityAccount": `${utilityAccount}`,
        "productName": 500034

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

router.get('/products', async (req, res, next) => {

    const productsUrl = "https://mobile.esolutions.co.zw:86/billpayments/products/merchant/TELONE";

    const response = await axios.get(`${productsUrl}`, {
        auth: {
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD
        }
    });
    const products = response.data.products

    const home = products.filter((_package) => {
        return _package.productName.search("Home") != -1
    })


    const infinity = products.filter((_package) => {

        return _package.productName.search("Infinity") != -1

    })

    const Intense = products.filter((_package) => {
        return _package.productName.search("Intense") != -1
    })

    const Voice = products.filter((_package) => {

        return _package.productName.search("Voice") != -1

    })


    const blaze = products.filter((_package) => {

        return _package.productName.search("Blaze") != -1

    })

    const adsl_fibre = [...home, ...infinity, ...Intense]


    res.json({
        "adsl_fibre": adsl_fibre,
        blaze: blaze,
        voice: Voice
    });


});




// voucher token purchase
router.post('/pay', (req, res, next) => {
    const { amount, productName, sourceMoblie, utilityAccount } = req.body;
    const cents = amount * 100;

    axios.post(`${url}`, {
        "mti": "0200",
        "vendorReference": generateTeloneVendorRefence(),
        "processingCode": "U50000",
        "vendorNumber": vendorNumbers._liveVendorNumber,
        "transactionAmount": cents,
        "sourceMobile": `${sourceMoblie}`,
        "merchantName": "TELONE",
        "productName": `${productName}`,
        "utilityAccount": `${utilityAccount}`,
        "transmissionDate": nowDate(),
        "currencyCode": "ZWL",
        "requiresVoucher": "true"
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
        .catch(err => {
            res.send(err)
        })



})


export default router;