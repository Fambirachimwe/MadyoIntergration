import 'dotenv/config';
import { Pesepay } from 'pesepay';


//  # Create an instance of the Pesepay class using your integration key and encryption key as supplied by Pesepay.
const pesepay = new Pesepay(process.env.PESE_INTEGRATION_KEY, process.env.PESE_ENCRYPTION_KEY);

//  # Set return and result urls
pesepay.resultUrl = 'https://example.com/result'
pesepay.returnUrl = 'https://example.com/return'


// # Create the payment

export const peseMobilePay = (amount, currencyCode, paymentMethodCode, payingNumber) => {

    // PZW201 ecocash
    // PZW209 cabs zimswitch card
    //  PZW210 payGo    

    const reqFields = {
        "customerPhoneNumber": `${payingNumber}`,
    }

    const payment = pesepay.createPayment(
        currencyCode,   // USD OR ZWL
        paymentMethodCode, // PZW201 ,
        '',  // optional customer email
        ''  // optional customer name
    )

    //  # After selecting the payment method create an object of the payment method required fields(if any)

    //  # Send the request to make payment
    return pesepay.makeSeamlessPayment(
        payment,
        'Online_payment',
        amount,
        reqFields  //

    );




}