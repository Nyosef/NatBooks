// We bring the path in so we can use join
const path = require('path');
const express = require('express');
//const mongoose = require('mongoose');
const dotenv = require('dotenv');
//A Handlebars view engine for Express.
const exphbs = require('express-handlebars');
const passport = require('passport');
// method ovveride allows us to use PUT instead of POST in order to change forms and such
//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const methodOverride = require('method-override');
const session = require('express-session');
const morgan = require('morgan');
// Bringing in MongoStore in order to save the sessions.
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// load config 
//dotenv allows you to separate secrets from your source code. This is useful in a collaborative environment (e.g., work, or open source) where you may not want to share your database login credentials with other people. Instead, you can share the source code while allowing other people to create their own 
dotenv.config({path: './config/config.env'});

// Passport config
// passing as an argument the passport the we required up there. 
 require('./config/passport')(passport);

connectDB();

const app = express();

// Body Parser - to allow acces to form data req.body
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}))


// I only want to run this in dev mode - Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Init Handlebars Helpers - Date in this case
// Bringing stuff in from the helper
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs');

//Handlebars
// we need to add the helper here too
app.engine('.hbs',
exphbs({
  helpers: {formatDate,stripTags,truncate, editIcon, select},
  defaultLayout: 'main',extname: '.hbs'
  }));

app.set('view engine','.hbs');

//Session - has to be above passport middleware
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global variable for user - because we couldnt access it in index.hbs
// this will allow us to access user, within our local templates
app.use(function (req,res, next){
  res.locals.user = req.user || null;
  next();
})

// Static folder
app.use(express.static(path.join(__dirname,'public'))); 


//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));


// whenever we use process.env we can use variables that are in that config.env
const PORT = process.env.PORT || 3000;

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

