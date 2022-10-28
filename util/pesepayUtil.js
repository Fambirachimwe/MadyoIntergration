import 'dotenv/config';
import { Pesepay } from 'pesepay';


//  # Create an instance of the Pesepay class using your integration key and encryption key as supplied by Pesepay.
const pesepay = new Pesepay(process.env.PESE_INTEGRATION_KEY, process.env.PESE_ENCRYPTION_KEY);

//  # Set return and result urls
pesepay.resultUrl = 'https://example.com/result'
pesepay.returnUrl = 'https://example.com/return'


// # Create the payment
const payment = pesepay.createPayment('CURRENCY_CODE', 'PAYMENT_METHOD_CODE', 'CUSTOMER_EMAIL(OPTIONAL)', 'CUSTOMER_PHONE_NUMBER(OPTIONAL)', 'CUSTOMER_NAME(OPTIONAL)')

//  # After selecting the payment method create an object of the payment method required fields(if any)
const requiredFields = { 'requiredFieldName': 'requiredFieldValue' }

//  # Send the request to make payment
pesepay
    .makeSeamlessPayment(payment, 'PAYMENT_REASON', AMOUNT, requiredFields)
    .then((response) => {
        // Save the poll url and reference number (used to check the status of a transaction)
        const pollUrl = response.pollUrl;
        const referenceNumber = response.referenceNumber;
    })
    .catch((error) => {
        // Handle error
    });