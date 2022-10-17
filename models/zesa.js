import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const res = {
    "mti": "0210",
    "vendorReference": "031423091358",
    "processingCode": "U50000",
    "transactionAmount": 5000,
    "transmissionDate": "30920081415",
    "vendorNumber": "V3003616720091",
    "transactionReference": "P1584561929472",
    "responseCode": "00",
    "arrears": "Debt Recovery|898766677|800|0|7700", "utilityAccount": "41234567890",
    "narrative": "Transaction Successfully Processed", "paymentType": "PREPAID",
    "token": "21644392780719203722|41.5|41.5 kWh @ 2.0 $/kWh: : :|POWERT3EMDB1413342|8299|1215|0%",
    "fixedCharges": "RE Levy (6%)|POWERT3EMDB1413342|486|0|6%", "miscellaneousData": "",
    "currencyCode": "ZWL",
    "merchantName": "ZETDC",
    "productName": "ZETDC_PREPAID"
}

//  saved all the fields in the response object of the API 


const zesaSchema = new Schema({
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

const Zesa = mongoose.model('zesaTockens', zesaSchema)


export default Zesa;


