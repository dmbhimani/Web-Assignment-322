const bcrypt = require("bcryptjs");
const express = require('express');
const userModel = require("../models/user");
const router = express.Router();
const path = require("path");

router.get("/", (req,res) => {
    res.redirect("/Blog");
});

router.get("/Blog", (req,res) => {
    res.render("general/Blog");
});

router.get("/article/:id", (req,res) => {
    res.render("general/read_more");
});

router.get("/registration", (req,res) => {
    res.render("general/registration");
});

router.post("/registration", (req,res) => {
    
    console.log(req.body);
    const {firstName, lastName, email, phone, companyName, streetAddress, streetAddress2, city, province, postalCode, country, taxId, password, confirmPassword, SignType} = req.body;

    let passedValidation = true;
    let validationMessage = {};
    let errors = [];
    
    let pass1 = req.body.password;
    let pass2 = req.body.confirmPassword;

    if(firstName.trim().length == 0){
        passedValidation = false;
        validationMessage.firstName = "You must enter an First Name";
    }

    else if(lastName.trim().length == 0){
        passedValidation = false;
        validationMessage.lastName = "You must enter a Last Name";
    }

    else if(email.trim().length == 0){
        passedValidation = false;
        validationMessage.email = "You must enter an email";
    }

    else if(phone.trim().length == 0){
        passedValidation = false;
        validationMessage.phone = "You must enter a phone number";
    }

    else if(streetAddress.trim().length == 0){
        passedValidation = false;
        validationMessage.streetAddress = "You must enter your street address";
    }

    else if(city.trim().length == 0){
        passedValidation = false;
        validationMessage.city = "You must enter the city you where currently live";
    }

    else if(province.trim().length == 0){
        passedValidation = false;
        validationMessage.province = "You must enter a province for the city";
    }

    else if(postalCode.trim().length == 0){
        passedValidation = false;
        validationMessage.postalCode = "You must enter a postal code";
    }

    else if(country.trim().length == 0){
        passedValidation = false;
        validationMessage.country = "You must enter the country where you currently reside";
    }

    else if(password.trim().length == 0){
        passedValidation = false;
        validationMessage.password = "You must enter a password";
    }

    else if(confirmPassword.trim().length == 0){
        passedValidation = false;
        validationMessage.confirmPassword = "You must confirm your passwords";
    }
    
    ////// 3 complex validation criteria

    else if(pass1 !== pass2){
        passedValidation = false;
        validationMessage.confirmPassword = "Your passwords do not match"
    }

    else if(firstName.length <= 2){
        passedValidation =false;
        validationMessage.firstName = "First name should be at least 3 character";
    }

    // else if(postalCode.length = 7){
    //     passedValidation = false;
    //     validationMessage.postalCode = "Postal code should be 6 character in length"
    // }
    


    if(passedValidation){

        const user = new userModel({
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            email: req.body.email, 
            phone: req.body.phone, 
            companyName: req.body.companyName, 
            streetAddress: req.body.streetAddress, 
            streetAddress2: req.body.streetAddress2, 
            city: req.body.city, 
            province: req.body.province, 
            postalCode: req.body.postalCode, 
            country: req.body.country,
            taxId: req.body.taxId, 
            password: req.body.password, 
            confirmPassword: req.body.confirmPassword,
            SignType: req.body.SignType
        });

        // userModel.findOne({
        //     email: req.body.email
        // }).then((user) =>{
        //     console.log("This Email is already registered to database, please enter new email");
        //     errors.push("This Email is already registered to database, please enter new email");
        //     res.render("general/registration",{
        //         errors,
        //         values:req.body
        //     })
        // });

        user.save()
        .then((userSaved) =>{
            console.log(`User ${userSaved.firstName} has been registered`);
            res.redirect("/Blog");
        })
        .catch((err) =>{
            console.log(`Error occurred while registering user...${err}`);
            res.render("general/registration", {
                values : req.body
            });
        });
        
    }
    else{
        res.render("general/registration", {
            values : req.body,
            validationMessage
        });
    }
}); 

router.get("/login", (req,res) => {
    res.render("general/login");
});

router.post("/login", (req,res) => {

    console.log(req.body);
    const {email, password} = req.body;

    let passedValidation = true;
    let validationMessage = {};
    let errors =[];

    if(email.trim().length == 0){
        passedValidation = false;
        validationMessage.email = "You must enter an email";
    }

    else if(password.trim().length == 0){
        passedValidation = false;
        validationMessage.password = "You must enter a password";
    }

    if(passedValidation){

        userModel.findOne({
            email: req.body.email
        })
        .then((user) =>{
            if(user){
                bcrypt.compare(req.body.password, user.password)
                .then(Matched => {
                    if(Matched){
                        if(user.SignType == 'user'){
                            req.session.user = user;
                            res.redirect("/UserDashboard");
                        }
                        else if(user.SignType == 'admin'){
                            req.session.admin = user;
                            res.redirect("/AdminDashboard");
                        }
                        else {
                            res.render("general/login", {
                                values: req.body
                            });
                        }
                    }
                    else{
                        console.log("Passwords do not match.");
                        errors.push("Sorry, your password does not match our database.");
                        res.render("general/login", {
                            errors,
                            values: req.body
                        });
                    }
                })
            }
            else{
                console.log("User not found in the database.");
                errors.push("Email was not found in the database.");
                res.render("general/login", {
                    errors,
                    values: req.body
                });
            }
        })
        .catch(err => {
            console.log(`Error finding the user in the database ... ${err}`);
            errors.push("Oops, something went wrong.");
    
            res.render("general/login", {
                errors,
                values: req.body
            });
        });
    }
    else{
        res.render("general/login", {
            values : req.body,
            validationMessage
        });
    }
});

router.get("/logout", (req,res) => {

    req.session.destroy();
    res.redirect("/login");
});

router.get("/UserDashboard", (req,res) => {

    if(req.session.user){
        res.render("general/UserDashboard");
    }
    else{
        res.send("Sorry, you need to login to access this page")
    }
});

router.get("/AdminDashboard", (req,res) => {
    
    if(req.session.admin){
        res.render("general/AdminDashboard");
    }
    else{
        res.send("Sorry, you need to login to access this page")
    }
});


module.exports = router;