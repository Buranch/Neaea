var express = require('express');
var routes = express.Router();
const jsonfile = require('jsonfile');
var path = require('path');
const result = require('./../new.json');
var User = require('./../models/user');
var passport = require('passport');
const localStrategy = require('passport-local').Strategy;

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

routes.get('/profile', require('connect-ensure-login').ensureLoggedIn(), (req, res)=>{

      console.log("user profile is ", req.user);
      res.send("user is ");
});
routes.get('/', function (req, res) {
    // res.sendFile(path.resolve('views/home.html'));
    console.log("user ", req.user);
    // console.log("user ", req.flash("user"));
    res.render('home', { messages: req.flash("messages") });
    // res.sendFile(__dirname+'./../views/home.html');
});



routes.get('/api/myjson', function(req, res){
    var ob = {
        name: "Jedrry"
    }
    res.send(JSON.stringify(ob));
})


routes.get('/exam_result', function (req, res) {
    var reqID = req.param('id');
    var i = 0;
    // console.log(result);
    console.log("requested id is ", reqID);

    Object.keys(result).every((student) => {
        //  console.log(i);
        // i++;
        // console.log("---------------------------");
        //   console.log(result[student]["Reg No"]);
        if (result[student]["Reg No"] == reqID) {
            res.send(result[student]);
            return true;

        }
        return true
        //   console.log("---------------------------");
    });
});

//rewrite it with space and formatting
// jsonfile.writeFile("space.json", result, {spaces: 2, EOL: '\r\n'}, function(err) {
//   console.error(err)
// });


routes.get('/firstName', (req, res) => {
    console.log("--------------------------------");
    var firstName = req.param('name');
    var lastName = req.param('lname');

    console.log("requested name is ", firstName);
    console.log("requested father name is ", lastName);
    console.log("lname==undefined ", lastName == "undefined");
    var strArr = [];
    var strArrIndex = [];

    var withFathArr = [];
    var withFathArrIndex = [];

    Object.keys(result).every((student) => {
        if (result[student]["Name"].startsWith(firstName)) {
            if (lastName != "undefined") {
                if (result[student]["F Name"].startsWith(lastName)) {
                    // console.log("found with father");
                    // console.log(result[student]["F Name"]);
                    withFathArr.push(result[student]["Name"] + " " + result[student]["F Name"] + " " + result[student]["GF Name"]);
                    withFathArrIndex.push(result[student]["Reg No"]);
                    strArr = [];
                    strArrIndex = [];
                }
            }
            strArr.push(result[student]["Name"] + " " + result[student]["F Name"] + " " + result[student]["GF Name"]);
            strArrIndex.push(result[student]["Reg No"]);
            return true
        }
        return true

    });
    console.log("sending", lastName);
    console.log("withFather.length ", withFathArr.length);
    console.log("strArr.length ", strArr.length);

    console.log("withFather == 0 ", withFathArr.length == 0);
    console.log("lastName == undefined", lastName)
    if (strArr.length > 0 && withFathArr.length == 0) {
        console.log("Only firstName ", lastName);
        // if(lastName.length != "undefined"){
        //     var notF = ["Not found"]
        //     res.send(notF);

        // }else{
        if (lastName == "undefined") {
            console.log("sending firstname");
            var data = [strArr, strArrIndex]
            // console.log(data);
            res.send(data);

        } else {
            // var notF = ["Not found"]
            // res.send(notF);

        }
        // }

    }
    else if (withFathArr.length == 0 && lastName != "undefined") {
        // var notF = ["Not found"]
        // res.send(notF);
    }
    else if (withFathArr.length > 0 && lastName != "undefined") {
        console.log("Only firstName")

        var data = [withFathArr, withFathArrIndex]
        // console.log(data);
        res.send(data);
    }

    console.log("--------------------------------");

});

routes.get('/flash', function(req, res){
  // res.redirect('/users/login');
  req.flash('info', 'Hi there!');
  // res.render('home', { message: req.flash('info')});
  res.redirect('/');
});
module.exports = routes;
