const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
    // FOR RENDERING THE LOGIN FORM
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/register'}), (req, res) => {
    // console.log('working login')
    let userId = req.user._id;
    let userName = req.user.name;
    // res.send(userName);
    req.flash('success', `Welcome back ${userName} !`);
    // console.log(req.user);
    // res.send("workign check console");
    res.redirect(`/notes/${userId}`);
})

router.get('/register', (req, res) => {
    // FOR RENDERING THE REGISTER FORM
    // console.log(res.locals);
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    const {name, username, email, password} = req.body;
    // LOGIC TO REGISTER A NEW USER
    const user = new User({email: email, username:username, name: name});
    const newUser = await User.register(user, password);
    // res.render('homePage')
    console.log(newUser);
    res.send('/login');
})


module.exports = router;