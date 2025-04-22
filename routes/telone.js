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

        // {
        //     "mti": "0200",
        //     "vendorReference": "03142309135s",
        //     "processingCode": "310000",
        //     "transmissionDate": "30920081415",
        //     "vendorNumber":"VE19257147501",
        //     "merchantName": "TELONE",
        //     "utilityAccount": "242133523",
        //     "productName" : "HOME_PREM_NIGHT",
        //     "amount": 94200
        // } 

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

    // https://mobile.esolutions.co.zw:8083/billpayments/products/merchant/TELONE
    // https://mobile.esolutions.co.zw:86/billpayments/vend

    //     testUserName=testz_api_user01
    // testPassword=csssbynd

    try {
        const response = await axios.get(`${productsUrl}`, {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        });
        const products = response?.data?.products;
        const filteredProducts = products.sort((a, b) => a.productCode - b.productCode);

        const adsl_fibre = filteredProducts.filter(product => { return parseInt(product.productCode) >= 500137 && parseInt(product.productCode) <= 500149 })

        const voice = filteredProducts.filter(product => { return parseInt(product.productCode) >= 105 && parseInt(product.productCode) <= 126 });

        const blaze = filteredProducts.filter(product => { return parseInt(product.productCode) >= 500150 && parseInt(product.productCode) <= 500155 })


        res.json({
            adsl_fibre,
            blaze,
            voice
            // products

        });

    } catch (error) {
        res.status(400).send(error)
    }

    // const response = await axios.get(`${productsUrl}`, {
    //     auth: {
    //         username: process.env.testUserName,
    //         password: process.env.testPassword
    //     }
    // });

    // console.log(response.data)


    // const products = response?.data?.products;
    // const filteredProducts = products.sort((a, b) => a.productCode - b.productCode);

    // const adsl_fibre = filteredProducts.filter(product => { return parseInt(product.productCode) >= 51 && parseInt(product.productCode) <= 61 })

    // const voice = filteredProducts.filter(product => { return parseInt(product.productCode) >= 105 && parseInt(product.productCode) <= 126 });

    // const blaze = filteredProducts.filter(product => { return parseInt(product.productCode) >= 620 && parseInt(product.productCode) <= 625 })


    // res.json({
    //     adsl_fibre,
    //     blaze,
    //     voice

    // });




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