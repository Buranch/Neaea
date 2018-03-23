const express = require('express');
const app = require('express')();

const path = require('path');
const fs = require('fs');;
const http = require('http').Server(app);
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const users = require('./routes/users');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose'); 
const db = mongoose.connection;
// var db = require('./db');

// var db = mongoo
//session
var sessionStore = new session.MemoryStore;
app.use(require('cookie-parser')());

app.use(session({
      cookie: { maxAge: 60000 },
      store: sessionStore,
      saveUninitialized: true,
      resave: 'true',
      secret: 'secret'
  }));
//passport
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(require('morgan')('combined'));


// app.use(function(req, res, next){
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';

        }
        return {param: formParam, msg: msg, value: value}
    }
}));
app.use(function(req, res, next){
    res.locals.messages = req.flash('success_messages');
    res.locals.messages = req.flash('error_messages');
    res.locals.messages = require('express-messages')(req, res);
    // res.locals.isAuthenticated = require('express-messages')(req, res);
    next();
});




app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.get('*', function(req, res, next){
  // console.log("Every page requsted ", req.user);
  // req.locals.user = req.user || null;
  next();

})
app.use('/users', users);
app.use('/', routes);
// app.use(passport.initialize());
// app.use(passport.session());
var i = 0;

app.get("/did", (req, res)=>{
    console.log('did requseted ', i);
    res.header("Access-Control-Allow-Origin", "*");
    
})



// app.get('/login', (req, res) => {
//     res.render("login");
// });
// app.post('/login',
// passport.authenticate('local', {failureRedirect: '/login'}),
//  (req, res) => {
//     console.log("login post requested");
//     res.send('Login post is requsted');
//     // res.redirect('/');
// })

http.listen(3333, function() {
    console.log("Listening to 3333 port ");
    console.log("I swear to GOD");
});
