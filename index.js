const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/notes-app', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: true,
})
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret:'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const userRoutes = require('./routes/user')
const noteRoutes = require('./routes/notes');


app.use((req, res, next) => {
    // res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/', noteRoutes);

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080");
})