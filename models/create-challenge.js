const mongoose = require('mongoose');
//const {ObjectId} = mongoose.Schema;

const createSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    start:{
        type:String,
        trim:true,
        maxlength:32,
    },
    end:{
        type:String,
        trim:true,
        maxlength:32,
    },
    reward:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    Image:{
        data:Buffer,
        contentType:String,
    },
    Latitude:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
    },
    Longitude:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    date:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model("CreateChallange",createSchema);