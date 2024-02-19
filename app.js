const express = require('express');
// const router = require('router');

const app = express();
// BODY PARSER
const bodyParser = require('body-parser');
const db = require('./db/connection');   //DATABASE CONNECTION

//MULTER
const multer = require('multer');
//COOKIES
const cookieParser = require('cookie-parser');
//SESSION
const session = require('express-session');


app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);


app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});
 

 // middleware function to check for logged-in user
 var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  
  };
// ***************************
app.set('view engine', 'ejs');





//  *******************
app.use('/assets', express.static('assets'));


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));







app.use('/upload', express.static('upload'))
app.use(require("./router/controller"));


// app.use('/',router)
app.listen(3000, ()=>{
    console.log("listing to 3000 port")
});

