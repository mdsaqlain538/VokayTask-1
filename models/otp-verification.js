const mongoose = require('mongoose');
//const {ObjectId} = mongoose.Schema;

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        maxlength:50,
    },
    number:{
        type:String,
        trim:true,
        unique:true,
        maxlength:10,
    },
    otp:{
        type:String,
        trim:true,
        unique:true,
        maxlength:6,
    },
},{timestamps:true});

module.exports = mongoose.model("otpSchema",otpSchema);