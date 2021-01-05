const express = require('express');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

// EJS Setup
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

// MongoDB Init
mongoose.connect('mongodb://localhost/teammgr',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('Connected to MongoDB')
).catch((err) => console.log(err));

// Elastic Init
//console.log('---starting Elastic connection');
//elastic.init();
//console.log('---Elastic Initialised---');

// BodyParser
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret: 'this_is_my_secret',
    resave: true,
    saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static('dist'));

// Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(3000);

