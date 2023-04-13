import 'dotenv/config';
import express from 'express';
import { buyTokenMasterCard, tokenResendController } from '../controllers/zesa.controllerV2.js'
import { buyToken, getCustomer } from '../controllers/zesa.controllerV2.js';
import { buyTokenCash } from '../controllers/buyTokenCash.js';


const router = express.Router();

// ZETDC Prepaid Electricity Tokens

// JSON Customer Information request

router.post(`/getCustomer`, getCustomer);



//  token purchase

router.post(`/buyToken`, buyToken);
router.post(`/buyTokenUsd`, buyTokenMasterCard);

router.post('/cash', buyTokenCash);


// Sample JSON Token Resend Request
//  this will be used after the the request has failed to purchase the token

router.post(`/tokenResend`, tokenResendController);



export default router;


