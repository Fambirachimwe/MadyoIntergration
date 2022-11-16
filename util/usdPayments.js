
import 'dotenv/config';
// import { creditCardType } from "./cardValidation";
import { Paynow } from 'paynow';
import { nanoid } from 'nanoid';
import Rate from '../models/dailyRate.js';

let paynow = new Paynow(process.env.madyoLiveUSDId, process.env.madyoLiveUSDKey);
paynow.resultUrl = "http://localhost:5500/result.html";
paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";





// check card type

//  send the transaction to be procced by either paynow or pesepay

export const mastercardPayment = async (amount) => {

    const dailyRate = await Rate.find();  // this is in the database

    // console.log(dailyRate[0].rate)
    const transactionAmount = amount / dailyRate.pop().rate;

    // console.log(transactionAmount)

    const invoiceNumber = nanoid(5);
    paynow.resultUrl = "http://localhost:5500/result.html";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

    let payment = paynow.createPayment(invoiceNumber, process.env.AUTH_EMAIL);
    // Passing in the name of the item and the price of the item
    payment.add("Bill payment", transactionAmount);

    // payment.add('bill-payment', amount);

    return paynow.send(payment);

}

