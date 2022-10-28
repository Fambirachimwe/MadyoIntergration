import 'dotenv/config';
import express from 'express';
import axios from 'axios';


const router = express.Router();



router.post('/pesepay', (req, res, next) => {
    res.send("pesepay payment route")
});


export default router;

