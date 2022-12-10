const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const session = require("express-session");
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', '.hbs');
app.use(express.static("general"));
app.use(express.urlencoded({ extended: false }));

//Setup session
app.use(session({
    secret: "this_is_supposed_to_be_just_a_long_string_as_secret",
    resave: false,
    saveUninitialized: true
}));

//User and admin session
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.admin = req.session.admin;
    next();
});

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

const generalController = require("./controller/general");
const res = require("express/lib/response");
app.use("/", generalController);




// Below lines define port connection and not need to be modified
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);