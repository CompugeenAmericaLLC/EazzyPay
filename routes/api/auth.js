const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require("jsonwebtoken");
const passport = require('passport');
const key = require ('../../setup/myurl');


const User = require("../../models/User");
const { response } = require("express");

router.post("/register", (req,res) => {

    User.findOne({ email: req.body.email})
    .then((user) => {
        if (user) {
            return res
            .status(400)
            .json({emailerror: "Email already exixts in our database"});
        } else {
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then( user => res.json(user))
                    .catch(err => console.log(err))
                });
            });
        }
    })
    .catch(err => console.log(err));
});



router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then( user => {
        if (!user){
            return res.status(404).json({emailerror:"User not found"});
        }
        bcrypt
        .compare(password, user.password)
        .then(isCorrect => {
            if(isCorrect){
                const payload = {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                };
                jsonwt.sign(
                    payload,
                    key.secret,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                res.status(400).json({passworderror: "Invalid Password"});
            }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});



router.get("/profile",
     passport.authenticate('jwt', {session: false}),
 (req, res) => {
    res.json({
        id: req.user.id,
        firstname: req.user.name,
        lastname: req.user.name,
        email: req.user.email,
        })
    }
);

module.exports = router;