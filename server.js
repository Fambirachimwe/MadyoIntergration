import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import vendorRoutes from './routes/vendor.js';
import zesaRoutes from './routes/zesa.js';
import dstvRoutes from './routes/dstv.js'
import airTimeRoutes from './routes/airtime.js';
import mongoose from "mongoose";
import path from 'path';
import usssdRoutes from './routes/ussd.js';
import lifeAssuranceRoutes from './routes/lifeAssurance.js';
import peseRoute from './routes/pesepayRoute.js';
import { econetAirtimeControllerV2 } from './controllers/econetAirtime.controllerV2.js';
import { netoneAirtimeControllerV2 } from './controllers/netoneAirtime.controllerV2.js';
import { telecelAirtimeControllerV2 } from './controllers/telecelAirtime.controllerV2.js';

// import { econetAirtimeControllerV2 } from "module";


// connection to mongoDB
//'mongodb://localhost/Madyozw'
// process.env.RAILWAY_MONGODB_CONNECTION
mongoose.connect(`${process.env.RAILWAY_MONGODB_CONNECTION}`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Connected to Madyozw');
}).on('error', (error) => {
    console.log('connection error ', error);
});




const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));
app.use(express.static('public'))


//  routes

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.use('/vendor', vendorRoutes);
app.use('/zesa', zesaRoutes);
app.use('/dstv', dstvRoutes);
app.use('/airtime', airTimeRoutes);
app.use('/ussd', usssdRoutes);
app.use('/lifeAssurrence', lifeAssuranceRoutes);
app.use('/pese', peseRoute)


// testing the airtime controllers V2 

app.use('/v2/econet/buy', econetAirtimeControllerV2);
app.use('/v2/netone/buy', netoneAirtimeControllerV2);
app.use('/v2/telecel/buy', telecelAirtimeControllerV2);




// error Handling

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


app.listen(PORT, console.log(`Server started on port ${PORT}`));
