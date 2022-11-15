import 'dotenv/config';
import express from 'express';
import Rate from '../models/dailyRate.js';



const router = express.Router();

router.post('/', (req, res, next) => {
    const { rate } = req.body;
    new Rate({
        rate: rate
    }).save().then(data => {
        res.send(`rate added, ${data}`)
    })
})

router.get('/', (req, res, next) => {
    Rate.find().then(data => {
        res.send(data.pop())
    })
});

router.put('/', (req, res, next) => {
    const { rate, id } = req.body;
    Rate.findOneAndUpdate({ _id: id }, {
        rate: rate
    }).then(() => {
        res.send("daily rate updated")
    })
})


export default router;

