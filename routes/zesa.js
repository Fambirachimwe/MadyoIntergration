import 'dotenv/config';
import express from 'express';
import { tokenResendController } from '../controllers/zesa.controller.js'
import { buyToken, getCustomer } from '../controllers/zesa.controller.js';
import { buyTokenCash } from '../controllers/buyTokenCash.js';


const router = express.Router();

// ZETDC Prepaid Electricity Tokens

// JSON Customer Information request

router.post(`/getCustomer`, getCustomer);

//  token purchase

router.post(`/buyToken`, buyToken);





// Sample JSON Token Resend Request
//  this will be used after the the request has failed to purchase the token

router.post(`/tokenResend`, tokenResendController);



export default router;


