import mongoose from 'mongoose';
const Schema = mongoose.Schema;


// sample  request 

/**
 * { "mti" : "0200", "vendorReference":"liveEconet04", "processingCode":"U50000", "vendorNumber":"VE19257147501", "transactionAmount":100, "sourceMobile":"263772XXXXXX", "targetMobile":"263772XXXXXX", "utilityAccount":"263772XXXXXX", "merchantName":"ECONET", "productName":"ECONET_AIRTIME", "transmissionDate":91916182800, "currencyCode":"ZWL" }
 */


//  sample response
/**
 * {"mti": "0210", "vendorReference": "liveEconet05", "processingCode": "U50000", "transactionAmount": "100", "transmissionDate": "91916182800", "vendorNumber": "VE19257147501", "transactionReference": "34354w35", "responseCode": "00", "merchantName": "ECONET", "utilityAccount": "263772XXXXXX", "narrative": "Transaction Successful", "currencyCode": "ZWL", "sourceMobile": "263772XXXXXX", "targetMobile": "263772XXXXXX", "productName": "ECONET_AIRTIME", "requiresVoucher": false, "initialBalance": 5.519012, "finalBalance": 6.519012,
 * "customerBalance": "6.519012", }
 */



const airTimeSchema = new Schema({

    orderNumber: String,
    vendorRefence: String,
    type: String,  // econet, telecel, netone
    amount: Number,  // this will be in cents,
    status: String,  // this will be taken from the response code
    utilityAccount: String,  // number to send airtime to 
    narrative: String,
    currencyCode: String,
    sourceMobile: String,
    targetMobile: String,  // number to send airtime to .. same as the utility account
    date: String

});

const Airtime = mongoose.model('Airtime', airTimeSchema);


export default Airtime;
