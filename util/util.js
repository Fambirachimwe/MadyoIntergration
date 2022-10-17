import Twilio from 'twilio';



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
    client.messages
        .create({
            body: `
            Airtime Credited, New Balance ${data.data.finalBalance}
            `,
            from: "+12059278608",
            to: `${to}`
        }
        ).then(() => {
            console.log('message sent')

        }
        )

}