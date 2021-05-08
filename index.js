if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

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
const ExpressError = require('./utilities/expressError');
const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/notes-app';
// const dbUrl = 'mongodb://localhost:27017/notes-app';
const SECRET = process.env.SECRET || 'thisisasecret';
// const SECRET = 'thisisasecret';

// const dbUrl = 'mongodb://localhost:27017/notes-app';

mongoose.connect(dbUrl, { 
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

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: SECRET,
    touchAfter: 24*60 *60
})

store.on('error', function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());

const userRoutes = require('./routes/user')
const noteRoutes = require('./routes/notes');


app.use((req, res, next) => {
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/', noteRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh NO , Something went wrong !";
    res.status(statusCode).render('error', {err});

})
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
})