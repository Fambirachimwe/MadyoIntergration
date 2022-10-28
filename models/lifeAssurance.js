import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const lifeAssuranceSchema = new Schema({

    orderNumber: String,
    "mti": String,
    "vendorReference": String,
    "processingCode": String,
    "transactionAmount": Number,
    "transmissionDate": String,
    "vendorNumber": String,
    "transactionReference": String,
    "responseCode": String,
    "merchantName": String,
    "customerData": String,
    "utilityAccount": String,
    "narrative": String,
    "currencyCode": String,
    "sourceMobile": String,
    "productName": String,

});


const lifeAssuranceModel = mongoose.model('lifeAssurance', lifeAssuranceSchema);

export default lifeAssuranceModel;





