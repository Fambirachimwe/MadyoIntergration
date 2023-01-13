import mongoose from "mongoose";
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
    gateway: String, // pesepay or paynow,
    amount: Number,
    reason: String,  // airtime, zesa
    paymentStatus: String, // success, failed
    date: { type: Date, default: Date.now() },

    transactionOrderNumber: String, // this is from the orderNumber provided when initiating a transaction
    mobilePlatform: String, // ecocash, onemoney, visa, etc
    phoneNumber: String

});


const Payment = mongoose.model('payment', paymentSchema);


export default Payment;