import 'dotenv/config'
import axios from 'axios';
import Twilio from 'twilio';
import { apiUrl } from './constants.js';
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

export const sendZesaToken = async (to, data) => {

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);
    // const accountNumber = process.env.TWILIO_TEST_NUMBER
    client.messages
        .create({
            body: `
            token:,  ${data}
            `,
            from: "+12059278608", // this is the twilio phone number
            to: `+263${to}`
        }
        ).then(() => {
            console.log('message sent')

        }
        )

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

export var my_status;
export const getTransactioStatus = async (_polUrl) => {
    const response = await axios.get(_polUrl);
    const $ = load(response.data);
    const splited = $('body').text().split('&')
    let reference, paynowReference, amount, status, polUrl, hash;

    reference = splited[0].split('=')[1].replaceAll('%', ' ');
    paynowReference = splited[1].split('=')[1].replaceAll('%', ' ');
    amount = splited[2].split('=')[1].replaceAll('%', ' ');
    status = splited[3].split('=')[1].replaceAll('%', ' ');
    polUrl = splited[4].split('=')[1].replaceAll('%', ' ');
    hash = splited[5].split('=')[1].replaceAll('%', ' ');

    if (status === "Sent") {
        my_status = status;
        console.log(status)

        setTimeout(() => {
            getTransactioStatus(_polUrl)
        }, 5000);

    } else {

        console.log('chage the status', status);
        my_status = status;
        // return transactionStatus;
    }
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

// TODO: add the setTimeOut function
// auto increment timer

export const TimerMs = (Function) => {
    const t1 = 60000;
    let _data;
    setTimeout(() => {
        Function.then(data => {
            if (data.data.responseCode === "09") {
                Timer(Function);
            } else if (data.data.responseCode === "00") {
                _data = data.data;

            }
        })
    }, t1);

    return _data;

}

// SMS Gate

export const newSmsGateway = (data, number) => {

    const sms = `Airtime Credited,  ${data ? `New Balance ${data.finalBalance}` : "please check you balance"}`;
    const baseSmsUrl = process.env.MADYOSMS_GATEWAY_URL;

    return axios.post(`${baseSmsUrl}`, {
        sms: sms,
        number: number,
        title: "From MadyoZW"
    });


}