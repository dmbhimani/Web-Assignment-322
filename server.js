const express = require("express");
const path = require("path");


const app = express();

app.use(express.static("general"));

// All routs are defined here
app.get("/", (req,res) => {
    res.redirect("/Blog");
});

app.get("/Blog", (req,res) => {
    res.sendFile(path.join(__dirname, "blog.html"))
});

app.get("/article/:id", (req,res) => {
    res.sendFile(path.join(__dirname, "read_more.html"));
});

app.get("/registration", (req,res) => {
    res.sendFile(path.join(__dirname, "registration.html"));
});

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// app.use(function(req, res, next){
//     res.send("The info is wrong");
// });




// Below lines define port connection and not need tro be modified
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);