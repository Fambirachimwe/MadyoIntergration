import 'dotenv/config';
import express from 'express';



import { econetAirtimeController } from '../controllers/econetAirtime.controller.js'
import { netoneAirtimeController } from '../controllers/netoneAirtime.controller.js';
import { telecelAirtimeController } from '../controllers/telecelAirtime.controller.js';

const router = express.Router();

/**
 * Transmission Date Format: MMDDYYHHmmss Description: The date and time when the message is sent. 
 * Example: 121713061713 represents 17 December 2013 at time 06:17:13 AM
 */

router.post(`/econet/buy`, econetAirtimeController);

router.post(`/netone/buy`, netoneAirtimeController);

router.post(`/telecel/buy`, telecelAirtimeController);




export default router;