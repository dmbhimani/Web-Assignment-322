const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const exphbs = require('express-handlebars');
const userModel = require("./models/user");

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', '.hbs');
app.use(express.static("general"));
app.use(express.urlencoded({ extended: false }));

// Connection to MongoDB
mongoose.connect("mongodb+srv://dmbhimani:disha8596@cluster0.qzkbps9.mongodb.net/data?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to the MongoDB database.");
})
.catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`);
});

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
            confirmPassword: req.body.confirmPassword
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

app.get("/login", (req,res) => {
    res.render("general/login");
});

app.post("/login", (req,res) => {

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
                if(user.password == req.body.password){
                    res.redirect("/Blog");
                }
                else{
                    console.log("Passwords do not match.");
                    errors.push("Sorry, your password does not match our database.");
                    res.render("general/login", {
                        errors,
                        values: req.body
                    });
                }
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





// Below lines define port connection and not need to be modified
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);