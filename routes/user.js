const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
    // FOR RENDERING THE LOGIN FORM
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/register'}), (req, res) => {
    console.log('working login')
    req.flash('success', "welcome");
    res.send('working login')
})

router.get('/register', (req, res) => {
    // FOR RENDERING THE REGISTER FORM
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    const {name, username, email, password} = req.body;
    // LOGIC TO REGISTER A NEW USER
    const user = new User({email: email, username:username, name: name});
    const newUser = await User.register(user, password);
    // res.render('homePage')
    console.log(newUser);
})


module.exports = router;