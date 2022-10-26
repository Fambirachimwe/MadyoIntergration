import 'dotenv/config'
import Pesepay from 'pesepay';




const pesepay = new Pesepay(process.env.PESE_INTEGRATION_KEY, process.env.PESE_ENCRYPTION_KEY);

// # Set return and result urls
pesepay.resultUrl = 'https://example.com/result'
pesepay.returnUrl = 'https://example.com/return'


const