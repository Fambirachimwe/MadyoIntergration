
import 'dotenv/config';
import { creditCardType } from "./cardValidation";
import { Paynow } from 'paynow';
import { nanoid } from 'nanoid';

let paynow = new Paynow(process.env.madyoLiveUSDId, process.env.madyoLiveUSDKey);


// check card type

//  send the transaction to be procced by either paynow or pesepay

export const mastercardPayment = (amount) => {

    const dailyRate = 603;  // this is in the database
    const transactionAmount = amount * dailyRate;

    const invoiceNumber = nanoid(5);
    paynow.resultUrl = "http://localhost:5500/result.html";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

    let payment = paynow.createPayment(invoiceNumber, process.env.AUTH_EMAIL);
    // Passing in the name of the item and the price of the item
    payment.add("Bill payment", transactionAmount);

    // payment.add('bill-payment', amount);

    return paynow.send(payment);

}

