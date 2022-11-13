const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    }, 
    lastName:{
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true,
        unique: true
    }, 
    phone:{
        type: Number,
        required: true
    }, 
    companyName:{
        type: String
    }, 
    streetAddress:{
        type: String,
        required: true
    }, 
    streetAddress2:{
        type: String
    }, 
    city:{
        type: String,
        required: true 
    }, 
    province:{
        type: String,
        required: true
    }, 
    postalCode:{
        type: String,
        required: true
    }, 
    country:{
        type: String,
        required: true
    }, 
    taxId:{
        type: Number
    }, 
    password:{
        type: String,
        required: true
    }, 
    confirmPassword:{
        type: String,
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;