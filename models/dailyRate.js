import mongoose from 'mongoose';

const Schema = mongoose.Schema;



const rateSchema = new Schema({
    date: { type: Date, default: Date.now() },
    rate: Number

});


const Rate = mongoose.model("rate", rateSchema);

export default Rate;

