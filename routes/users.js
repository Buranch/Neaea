var express = require('express');
var router = express.Router();
var path = require('path');

// var db = require('./../db');
var User = require('./../models/user');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

// var NameBirr = require('./../models/user');
router.get('/', (req, res, next) => {
    // res.sendFile(path.resolve('views/login.html'));
    console.log("user ");
    res.render('login', { message: req.flash('signupMessage') });
    // res.sendFile(path.resolve('views/fuck.html'));

});
router.use(passport.initialize());
router.use(passport.session());
router.use(require('./adminAPI'));
// router.get('/login', (req, res, next) => {
//     console.log("im fucking login");
//     res.render('login');
//     // res.sendFile(path.resolve('views/logedin.html'));
// });
router.get('/register', (req, res, next) => {
    res.render('login');
    // res.sendFile(path.resolve('views/login.html'));
});

// passport.use(new localStrategy(User.authenticate()));
passport.use(new localStrategy(function(username, password, done) {
    console.log("on the stragety");
    console.log("username ", username);
    console.log("passowrd ", password);

    User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err
        }
        if (!user) {

            return done(null, false, {message: 'Unknown usr'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Invalid password"});
            }
        });
    });
}));
passport.serializeUser(function(user, cb) {
    console.log("serializing ", user);
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    console.log("deserializing ", id);
    User.getUserById(id, function(err, user) {
        if (err) {
            console.log("error happened deserializing");
            return cb(err);

        }
        console.log("No error happened deserializing");
        cb(null, user);
    });
});

router.get('/admin', require('connect-ensure-login').ensureLoggedIn(), (req, res)=>{

      console.log("user is ", req.user);
      var se = "user is "+ req.user;
      res.render('admin');
});
router.post('/login', passport.authenticate('local', {failureRedirect: '/users', failureMessages: "Invalid password"}), (req, res) => {

    req.flash("messages", "You are logged in");
    req.flash("isAuthenticated", "true");
    console.log("login post requested");
    // res.send('Login post is requsted');
    res.redirect('/users/admin');
})

router.get('*', function(req, res, next){
  // console.log("Every page requsted ", req.user);
  // req.locals.user = req.user || null;
  console.log("locals");
  console.log("ROUTER GET");

  next();

})
router.post('/register', (req, res, next) => {
    console.log("resgister post here");
    console.log(req.body);
    // res.send(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    console.log("name is ", name);
    //Form validation
    req.checkBody('name', "Name is field is required").notEmpty();
    req.checkBody('email', "Email field is required").notEmpty();
    req.checkBody('email', "Email field is required").isEmail();
    req.checkBody('username', "Username is required").notEmpty();
    req.checkBody('password', "Password is required").notEmpty();
    req.checkBody('password2', "Password doesn't match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        console.log("errors happend");
        res.send("Error happend");
    } else {
        console.log("Creating new user");
        var newUser = new User({email: email, username: username, password: password});
        console.log("No errors")
        User.createUser(newUser, (err, user) => {

            if (err) {
                console.log("err happened");

                throw err
            } else {
                console.log("without namebirr error ");
                res.location('/');
                res.redirect('/');
                // return res.redirect('/');
            }
        });
    }

});
router.get("/failed", (req, res) => {
    console.log("failed");
    res.render('failed');
});

router.get('/logout', (req, res) => {
    req.logout();
    console.log("someone logged out");
    req.flash('messages', "You are now logged out");
    res.redirect('/users');
})
module.exports = router;
