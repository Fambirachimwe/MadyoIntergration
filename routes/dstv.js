import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { nowDate, mobilePay } from '../util/util.js';
import Dstv from '../models/dstv.js';
import { nanoid } from 'nanoid';
import { load } from 'cheerio';
import { getCustomerControler, paymentController } from '../controllers/dstv.controller.js';

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
router.post(`/getCustomer`, getCustomerControler);


router.post(`/pay`, paymentController);


export default router