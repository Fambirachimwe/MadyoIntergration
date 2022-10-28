import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { nowDate, mobilePay } from '../util/util.js';
import Dstv from '../models/dstv.js';
import { nanoid } from 'nanoid';
import { load } from 'cheerio';

const router = express.Router();
const url = process.env.BASE_URL;

var my_status = "";
const getTransactioStatus = async (_polUrl) => {
    const response = await axios.get(_polUrl);
    const $ = load(response.data);
    const splited = $('body').text().split('&')
    let reference, paynowReference, amount, status, polUrl, hash;

    reference = splited[0].split('=')[1].replaceAll('%', ' ');
    paynowReference = splited[1].split('=')[1].replaceAll('%', ' ');
    amount = splited[2].split('=')[1].replaceAll('%', ' ');
    status = splited[3].split('=')[1].replaceAll('%', ' ');
    polUrl = splited[4].split('=')[1].replaceAll('%', ' ');
    hash = splited[5].split('=')[1].replaceAll('%', ' ');

    if (status === "Sent") {
        my_status = status;
        console.log(status)

        setTimeout(() => {
            getTransactioStatus(_polUrl)
        }, 5000);

    } else {

        console.log('chage the status', status);
        my_status = status;
        // return transactionStatus;
    }
}

// Sample Customer Information Request
router.post(`/getCustomer`, (req, res, next) => {


    const { utilityAccount } = req.body;

    axios.post(`${url}`,

        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": "031423091352",  // 
            "processingCode": "310000",
            "transmissionDate": nowDate(),
            "vendorNumber": "VE19217695801",
            "merchantName": "DSTV",
            "productName": "DSTV",
            "utilityAccount": utilityAccount
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

    // make payment here using ecocash or vpayments;
    // start with ecocash ...


    // the account is for the dstv serial card 
    // get the currency code either USD or ZWL
    const { amount, payingNumber, utilityAccount } = req.body;

    // test the paying number here
    let method;

    const econetNumber = /^077|^078/;
    const netoneNumber = /^071/;

    if (econetNumber.test(`0${payingNumber.slice(3)}`)) {
        method = "ecocash"
    }

    if (netoneNumber.test(`0${payingNumber.slice(3)}`)) {
        method = "onemoney"
    }

    console.log(method);




    mobilePay(amount, `${method}`, `0${payingNumber.slice(3)}`)
        .then(async response => {

            console.log(response)
            if (response && response.success) {

                do {
                    await getTransactioStatus(response.pollUrl);
                } while (my_status === "Sent" || my_status === undefined);


                if (my_status === "Cancelled") {
                    // my_status = "";

                    res.json({
                        error: 'err01',
                        message: "Mobile Money confirmation failed"
                    });

                }

                else if (my_status === "Paid") {
                    console.log('mobile money transaction complete');
                    my_status = ""; // reset the transaction status to null
                    const cents = amount * 100;


                    axios.post(`${url}`,

                        //  pass this data in the body of the api 
                        {
                            "mti": "0200",
                            "vendorReference": "kkk0001344ewr2",
                            "processingCode": "520000",
                            "vendorNumber": "VE19257147501",  // this is the test vendor number 

                            "transactionAmount": cents,
                            "amount": cents,

                            "sourceMobile": payingNumber,
                            "utilityAccount": utilityAccount,


                            "merchantName": "DSTV",
                            "productName": "DSTV",
                            "transmissionDate": nowDate(),
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

                        console.log(data.data)



                        // check the response code
                        // if 00 save the transaction in the database and the dstv payment in the database

                        if (data.data.responseCode === "00") {
                            new Dstv({
                                ...data.data,
                                orderNumber: nanoid(10)
                            }).save()
                                .then(saved_data => {
                                    res.json({
                                        code: "00",
                                        message: "Dstv payment successful",
                                        orderNumber: saved_data.orderNumber,
                                        payload: saved_data
                                    })
                                })

                        }



                        // if 09  .. make a resend request using the data provided
                        // set timeout to 

                        // if 05 alert the client of a failed dstv payment request 


                        res.send(data.data)
                    })

                }

            } else {
                return res.json({
                    error: 'err01',
                    message: "Failed to initiate ecocash transaction",
                    code: "05"
                });

            }


        }



        )

});


export default router