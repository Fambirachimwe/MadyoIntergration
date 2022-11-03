import 'dotenv/config';
import axios from 'axios';
import { nowDate } from '../util/util.js';





export const airtimeResendController = (data) => {

    // console.log(data)

    return axios.post(`https://mobile.esolutions.co.zw:86/billpayments/vend`,

        // payload

        {
            "mti": "0201",
            "vendorReference": data.vendorReference,
            "processingCode": "U50000",
            "vendorNumber": data.vendorNumber,
            "utilityAccount": data.utilityAccount,
            "transactionAmount": data.transactionAmount,
            "transmissionDate": nowDate(),
            "originalReference": data.vendorReference,
            "merchantName": "ECONET",
            "productName": "ECONET_AIRTIME",
            "currencyCode": "ZWL"
        },
        // auth object

    )


}