const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyparser = require('body-parser');

const app = express();

const auth = require("./routes/api/auth");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use(passport.initialize());

const db = require('./setup/myurl').mongoURL;

mongoose
.connect (db)
.then(()=> console.log('Connection to Database is Successfull'))
.catch(err => console.log('Connection Error'));

app.use("/api/auth", auth);

app.listen ("3000", () => {
    console.log ("Application is on");
});