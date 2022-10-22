const express = require("express");
const app = express();
const path = require("path");
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', '.hbs');
app.use(express.static("general"));
app.use(express.urlencoded({ extended: false }));

// All routs are defined here
app.get("/", (req,res) => {
    res.redirect("/Blog");
});

app.get("/Blog", (req,res) => {
    res.render("general/Blog");
});

app.get("/article/:id", (req,res) => {
    res.render("general/read_more");
});

app.get("/registration", (req,res) => {
    res.render("general/registration");
});

app.post("/registration", (req,res) => {
    
    console.log(req.body);
    const {firstName, lastName, email, phone, companyName, streetAddress, streetAddress2, city, province, postalCode, country, taxId, password, confirmPassword} = req.body;

    let passedValidation = true;
    let validationMessage = {};
    
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

    else if(postalCode.length = 6){
        passedValidation = false;
        validationMessage.postalCode = "Postal code should be 6 character in length"
    }
    


    if(passedValidation){
        res.redirect("/Blog");
    }
    else{
        res.render("general/registration", {
            values : req.body,
            validationMessage
        });
    }
}); 

app.get("/login", (req,res) => {
    res.render("general/login");
});

app.post("/login", (req,res) => {

    console.log(req.body);
    const {email, password} = req.body;

    let passedValidation = true;
    let validationMessage = {};

    if(email.trim().length == 0){
        passedValidation = false;
        validationMessage.email = "You must enter an email";
    }

    else if(password.trim().length == 0){
        passedValidation = false;
        validationMessage.password = "You must enter a password";
    }

    if(passedValidation){
        res.redirect("/Blog");
    }
    else{
        res.render("general/login", {
            values : req.body,
            validationMessage
        });
    }
});





// Below lines define port connection and not need tro be modified
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);