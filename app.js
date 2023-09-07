const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');


const campRoutes= require('./routes/campground');
const reviewRoutes = require('./routes/review.js');
const { createRequire } = require('module');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
connectToDatabase(); //calls database connection


app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'admin',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);







app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log('Server is listening on 3000');
});
