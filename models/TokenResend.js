import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const failedZesaSchema = new Schema({
    orderNumber: String,
    mti: String,
    vendorReference: String,
    processingCode: String,
    transactionAmount: Number,
    transmissionDate: String,
    vendorNumber: String,
    transactionReference: String,
    responseCode: String,
    arrears: String,
    utilityAccount: String,
    narrative: String,
    paymentType: String,
    token: String,
    fixedCharges: String,
    miscellaneousData: String,
    currencyCode: String,
    merchantName: String,
    productName: String

})

const failedZesa = mongoose.model('InProgressToken', failedZesaSchema);
export default failedZesa;