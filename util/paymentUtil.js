

import Payment from "../models/payments.js"

export const addPayment = (gateway, amount, reason, paymentStatus, transactionOrderNumber, mobilePlatform, phoneNumber) => {

    console.log('payment phoneNumber to make the transaction', phoneNumber);

    new Payment({
        gateway: gateway,
        amount: amount,
        reason: reason,
        paymentStatus: paymentStatus,
        transactionOrderNumber: transactionOrderNumber,
        mobilePlatform: mobilePlatform,
        phoneNumber: phoneNumber
    }).save()
        .then(() => {
            console.log("Payment saved to database")
        })

}