import 'dotenv/config';
import express from 'express';
import axios from 'axios';


const router = express.Router();
const url = process.env.BASE_URL;


// axios.post('/user', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

//  get vender information
router.post(`/getVendor`, (req, res, next) => {
    axios.post(`${url}`,

        //  pass this data in the body of the api 
        {
            "mti": "0200",
            "vendorReference": "198909855445443",
            "processingCode": "300000",
            "transmissionDate": "91916182800",
            "vendorNumber": "VE19217695801",
            "accountNumber": "0119217695806",
            "currencyCode": "ZWL"

        },
        // auth object

        {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            }
        }



    ).then(data => {
        if (data.data.responseCode === "05") {
            res.status(406).json({
                message: "General Error",
                narrative: data.data.narrative
            })
        }
        else {
            res.send(data.data)
        }
    })
})








export default router
