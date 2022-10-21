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