import 'dotenv/config'
import axios from 'axios';
import Twilio from 'twilio';
import { apiUrl, econetSMSGatewayUrl, eSolutionsSmsGatewayUrl } from './constants.js';
import 'dotenv/config';
import { Paynow } from 'paynow';
import { nanoid } from 'nanoid';
import { load } from 'cheerio';

//     DEMO-MADYO-ID="15385"
// DEMO-MADYO-KEY=f45c34a6-d855-46c0-8daf-c933cbc7e426

// paynowliveId="15376"
// paynowliveKey=b6f717b5-27e0-4e7f-914a-41cce7b7f46b

// madyoLiveZWId="9760"
// madyoLiveZWKey=dfc4c049-e923-462b-8962-79457c7c26c1


let paynow = new Paynow(process.env.madyoLiveZWId, process.env.madyoLiveZWKey);



export const randomString = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

// console.log(randomString(16, 'aA'));
// console.log(randomString(32, '#aA'));
// console.log(randomString(64, '#A!'));

export const generateAirtimeVendorRefence = (ref) => {


    let reference;
    const econet = "ECONET";
    const netone = "liveNetOne";
    const _telecel = "TELECEL";


    switch (ref) {
        case 'econet':
            reference = econet
            break;

        case 'netone':
            reference = netone
            break

        case 'telecel':
            reference = _telecel
            break

        default:
            break;
    }

    const newRef = reference + randomString(16, 'aA')

    reference = null;
    return newRef;

}


export const generateZesaVendorRefence = () => {

    let reference = 'ZETDC_';
    const newRef = reference + randomString(16, 'aA')
    return newRef;

}

export const generateTeloneVendorRefence = () => {

    let reference = 'TELONE';
    const newRef = reference + randomString(16, 'aA')
    return newRef;

}


export const generatePolicyVendorRefence = () => {

    let reference = 'LIFE';
    const newRef = reference + randomString(16, 'aA')
    return newRef;

}




const getTimeFormat = (today) => {
    const time = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`

    return time;


}

export const nowDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const formatedDate = mm + dd + yyyy + getTimeFormat(today);
    return formatedDate
}

//  send SMS

export const sendSMS = async (to, data) => {

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);
    // const accountNumber = process.env.TWILIO_TEST_NUMBER

    // console.log(to)
    client.messages
        .create({
            body: `
            Airtime Credited,  ${data ? `New Balance ${data.finalBalance}` : "please check you balance"}
            `,
            from: "+12059278608",
            to: `+${to}`
        }
        ).then(() => {
            console.log('message sent')

        }
        ).catch(err => {
            console.log(err)
        })

}



const formartMessage = (_str) => {
    const splitted = _str.split("|");
    const token = splitted[0];
    const units = splitted[1];
    const rate = splitted[2];
    const merchantReceipt = splitted[3];
    const netAmount = splitted[4];
    const taxAmount = splitted[5];
    const taxRate = splitted[6]

    return {
        token, units, rate, merchantReceipt, netAmount, taxAmount, taxRate
    }
}



export const sendZesaToken = (token, number, meterNumber, amount) => {

    const econet = /^077|^078/;
    // const telecel = /^073/;
    // const netone = /^071/;

    const messageObject = formartMessage(token)

    // example of the token data from the response 

    // 34397317664422574275|4.8||RCT1666967869069|47170|0|0

    const sms = `token: ${messageObject.token}
    meter: ${meterNumber}
    kWH: ${messageObject.units}
    Energy: ${messageObject.netAmount}
    Amount: ${amount}`;   // send the data to be sent as a string





    const baseSmsUrl = econetSMSGatewayUrl;
    const currentTime = new Date();
    if (econet.test(number)) {
        //  this is an econet number
        // do send the message using the ecoent gateway 
        axios.post(`${baseSmsUrl}`, {
            sms: sms,
            number: number,
            title: "From MadyoZW"
        }).then()
            .catch(err => {
                console.log(err)
            });

    } else {
        //  send an sms using the e solution gateway
        axios.post(`${eSolutionsSmsGatewayUrl}`,
            {
                "originator": "MadyoZW",
                "destination": `${number}`,
                "messageText": sms,
                "messageReference": nanoid(10),
                "messageDate": nowDate(),
                "messageValidity": "03:00",
                "sendDateTime": `${currentTime.getHours()}:${currentTime.getMinutes()}`
            },
            {
                auth: {
                    username: process.env.MADYO_SMS_USERNAME,
                    password: process.env.MADYO_SMS_PASSWORD
                }
            }
        )
            .then(data => {
                if (data.data.status === "FAILED") {
                    console.log("failed to send message using the e solution gateway ", data.data.narrative)
                }
            })
            .catch(err => {
                console.log(err) // put this in logger file.. and save them to the database
            })
    }


}

export const failedZesaToken = async (to, data) => {



    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);
    // const accountNumber = process.env.TWILIO_TEST_NUMBER
    // console.log(to)
    client.messages
        .create({
            body: `${data}`,
            from: "+12059278608",
            to: `+${to}`
        }
        ).then(() => {
            console.log('failed token message sent')

        }
        )

}



export const tokenResend = (data) => {

    // console.log(data)

    return axios.post(`${apiUrl}/zesa/tokenResend`,

        // payload

        {
            "mti": "0201",
            "vendorReference": generateZesaVendorRefence(),
            "processingCode": "U50000",
            "vendorNumber": data.vendorNumber,
            "utilityAccount": data.utilityAccount,
            "transactionAmount": data.transactionAmount,
            "transmissionDate": nowDate(),
            "originalReference": data.vendorReference,
            "merchantName": "ZETDC",
            "productName": "ZETDC_PREPAID",
            "currencyCode": "ZWL"
        },
        // auth object

    )


}

export const airtimeResend = (data) => {

    // console.log(data)

    return axios.post(`${apiUrl}/airtime/resend`,

        // payload

        {
            "mti": "0201",
            "vendorReference": data.vendorReference(),
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




export const mobilePay = (amount, method, customerPhoneNumber) => {

    const invoiceNumber = nanoid(5);
    paynow.resultUrl = "http://localhost:5500/result.html";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

    let payment = paynow.createPayment(invoiceNumber, process.env.AUTH_EMAIL)
    payment.add('bill-payment', amount);

    // console.log(amount)

    return paynow.sendMobile(
        payment,
        // The phone number making payment
        // '0771111111',  // this is a test phone number


        `0${customerPhoneNumber}`,
        // The mobile money method to use.  ecocash, onemoney, telecel

        `${method}`
        // 'ecocash'

    )



}

// TODO: save the payment  to the database  

export const savePaymentToDatabase = (data) => {
    // save the data in the database 
}


// SMS Gate

export const sendEconetSMS_Airtime = (transactionAmount, number) => {

    const sms = `Airtime Credited with $${transactionAmount}.00`;
    const baseSmsUrl = "https://europe-west2-projectx-ussd-game.cloudfunctions.net/send_econet_sms_message";

    axios.post(`${baseSmsUrl}`, {
        sms: sms,
        number: number,
        title: "From MadyoZW"
    }).then()
        .catch(err => {
            console.log('failed to send sms using the econet gateway ', err)
        })


}

// Make a SMS gateway function that send messages for all the operators


export const smsGateway = (data, number) => {

    const econet = /^077|^078/;
    // const telecel = /^073/;
    // const netone = /^071/;

    const sms = data;   // send the data to be sent as a string
    const baseSmsUrl = econetSMSGatewayUrl;
    const currentTime = new Date();
    if (econet.test(number)) {
        //  this is an econet number
        // do send the message using the ecoent gateway 
        axios.post(`${baseSmsUrl}`, {
            sms: sms,
            number: number,
            title: "From MadyoZW"
        }).then()
            .catch(err => {
                console.log(err)
            });

    } else {
        //  send an sms using the e solution gateway
        axios.post(`${eSolutionsSmsGatewayUrl}`,
            {
                "originator": "MadyoZW",
                "destination": `${number}`,
                "messageText": sms,
                "messageReference": nanoid(10),
                "messageDate": nowDate(),
                "messageValidity": "03:00",
                "sendDateTime": `${currentTime.getHours()}:${currentTime.getMinutes()}`
            },
            {
                auth: {
                    username: process.env.MADYO_SMS_USERNAME,
                    password: process.env.MADYO_SMS_PASSWORD
                }
            }
        )
            .then(data => {
                if (data.data.status === "FAILED") {
                    console.log("failed to send message using the e solution gateway ", data.data.narrative)
                }
            })
            .catch(err => {
                console.log(err) // put this in logger file.. and save them to the database
            })
    }


}

// for funeral services


export const getCustomerPolicy = async (utilityAccount, mobileNumber, policyType) => {

    const url = "https://madyointergration-production.up.railway.app";
    return await axios.post(`${url}/lifeAssurrence/getCustomer`,
        {
            "mobileNumber": mobileNumber,
            "utilityAccount": utilityAccount,
            "policyType": policyType
        },
        {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        }
    )
}