import 'dotenv/config';
import { econetAirtimeControllerV2, econetAirtimeControllerV2Cash } from '../controllers/econetAirtime.controllerV2.js';
import { netoneAirtimeControllerV2, netoneAirtimeControllerV2Cash } from '../controllers/netoneAirtime.controllerV2.js';
import { telecelAirtimeControllerV2, telecelAirtimeControllerV2Cash } from '../controllers/telecelAirtime.controllerV2.js';
import express from 'express';


const router = express.Router();

/**
 * Transmission Date Format: MMDDYYHHmmss Description: The date and time when the message is sent. 
 * Example: 121713061713 represents 17 December 2013 at time 06:17:13 AM
 */

router.post(`/econet/buy`, econetAirtimeControllerV2);
router.post(`/netone/buy`, netoneAirtimeControllerV2);
router.post(`/telecel/buy`, telecelAirtimeControllerV2);

// add cash transactions

router.post(`/econet/buy/cash`, econetAirtimeControllerV2Cash);

router.post(`/netone/buy/cash`, netoneAirtimeControllerV2Cash);

router.post(`/telecel/buy/cash`, telecelAirtimeControllerV2Cash);

// econetAirtimeControllerV2Cash




export default router;
