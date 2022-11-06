import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import vendorRoutes from './routes/vendor.js';
import zesaRoutes from './routes/zesa.js';
import zesaV2Routes from './routes/zesaV2.js';
import airTimeRoutes from './routes/airtime.js';
import airTimeRoutesV2 from './routes/airTimeRoutesV2.js';
import mongoose from "mongoose";
import path from 'path';
import lifeAssuranceRoutes from './routes/lifeAssurance.js';
import telOneRoutes from './routes/telone.js'

// connection to mongoDB
//'mongodb://localhost/Madyozw'
// process.env.RAILWAY_MONGODB_CONNECTION
mongoose.connect(`mongodb://localhost/Madyozw`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Connected to Madyozw');
}).on('error', (error) => {
    console.log('connection error ', error);
});



const app = express();
const PORT = process.env.PORT || 5600;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));
app.use(express.static('public'))


//  the homepage route for the dashboard

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});



// routes for the v1 
app.use('/vendor', vendorRoutes);
app.use('/zesa', zesaRoutes);
app.use('/airtime', airTimeRoutes);
app.use('/lifeAssurrence', lifeAssuranceRoutes);



// testing the airtime controllers V2 

app.use('/v2/zesa', zesaV2Routes);
app.use('/v2/airtime', airTimeRoutesV2);
app.use('/v2/telone', telOneRoutes)

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
