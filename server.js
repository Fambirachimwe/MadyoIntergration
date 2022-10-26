import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import vendorRoutes from './routes/vendor.js';
import zesaRoutes from './routes/zesa.js';
import dstvRoutes from './routes/dstv.js'
import airTimeRoutes from './routes/airtime.js';
import mongoose from "mongoose";


// connection to mongoDB
//'mongodb://localhost/Madyozw'
mongoose.connect(process.env.RAILWAY_MONGODB_CONNECTION, { useNewUrlParser: true });
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

app.use('/vendor', vendorRoutes);
app.use('/zesa', zesaRoutes);
app.use('/dstv', dstvRoutes);
app.use('/airtime', airTimeRoutes)





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
