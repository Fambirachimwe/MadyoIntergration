import axios from 'axios';
import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';





import { peseMobilePay } from '../util/pesepayUtil.js';
const router = express.Router();

const decryptPayload = async (payload) => {
    var decipher = crypto.createDecipheriv('aes-256-cbc', `${process.env.PESE_ENCRYPTION_KEY}`, `${process.env.PESE_ENCRYPTION_KEY.slice(16)}`);

    let decrypted = decipher.update(payload, 'base64', 'utf8');
    let _obj = decrypted.replaceAll('{&', '{"') + decipher.final('utf8');
    const jsonObject = JSON.parse(_obj);


    // return data;
    return jsonObject;

}

var my_status;

const getTransStatusPese = async (pollUrl) => {

    let config = {
        headers: {
            "authorization": `${process.env.PESE_INTEGRATION_KEY}`,
        }
    }

    const response = await axios.get(`${pollUrl}`, config)
    // console.log(response.data)

    const _data = await decryptPayload(response.data.payload);

    if (_data.transactionStatus === "PENDING" || _data.transactionStatus === undefined) {
        my_status = _data.transactionStatus;

        setTimeout(() => {

            console.log(my_status)

            getTransStatusPese(_data.pollUrl)


        }, 5000);
    } else {
        console.log('chage the status', _data.transactionStatus);
        my_status = _data.transactionStatus;
    }




}




router.post('/pay', (req, res, next) => {
    const { amount, currencyCode, paymentMethodCode, payingNumber } = req.body;

    peseMobilePay(amount, currencyCode, paymentMethodCode, payingNumber).then(async response => {
        // handle the response here

        if (response && response.success) {



            do {
                await getTransStatusPese(response.pollUrl);

            } while (my_status === "PENDING" || my_status === undefined);

            if (my_status === "FAILED") {

                console.log(my_status)

                res.json({
                    error: 'err01',
                    message: "Mobile confirmation failed"
                })
                // console.log('Ca')
            }

            else if (my_status === "SUCCESS") {


                // handle everything here
            }






        }

    }).catch(err => {
        res.send(err)
    });

})


export default router;

