

import Payment from "../models/payments.js"

export const addPayment = (gateway, amount, reason, paymentStatus, transactionOrderNumber, mobilePlatform) => {

    new Payment({
        gateway: gateway,
        amount: amount,
        reason: reason,
        paymentStatus: paymentStatus,
        transactionOrderNumber: transactionOrderNumber,
        mobilePlatform: mobilePlatform
    }).save()
        .then(() => {
            console.log("Payment saved to database")
        })

}