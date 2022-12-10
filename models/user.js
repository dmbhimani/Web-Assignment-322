const bcrypt = require("bcryptjs");
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
    },
    SignType:{
        type: String,
        required: true
    }
});

userSchema.pre("save", function(next) {
    let user = this;

    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(user.password, salt)
        .then(hashedPwd => {
            user.password = hashedPwd;
            next();
        })
        .catch(err => {
            console.log(`Error occurred while hashing the password ... ${err}`);
        });
    })
    .catch(err => {
        console.log(`Error occurred when salting ... ${err}`);
    });
});

userSchema.pre("save", function(next) {
    let user = this;

    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(user.confirmPassword, salt)
        .then(hashedConfirmPwd => {
            user.confirmPassword = hashedConfirmPwd;
            next();
        })
        .catch(err => {
            console.log(`Error occurred while hashing the password ... ${err}`);
        });
    })
    .catch(err => {
        console.log(`Error occurred when salting ... ${err}`);
    });
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;