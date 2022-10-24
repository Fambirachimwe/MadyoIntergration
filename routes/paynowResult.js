import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const router = express.Router();
const url = process.env.BASE_URL;


// router.get('/paynowResult', (req, res, next) => {
//     res.writeHead(200, { 'content-type': 'text/html' })
//     fs.createReadStream('index.html').pipe(res)
// })