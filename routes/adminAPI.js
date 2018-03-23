var express = require('express');
var admin = express.Router();
var path = require('path');
// var db = require('./../db');
var User = require('./../models/user');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const jsonfile = require('jsonfile');
const result = require('./../new.json');

const schoolArr = []


// console.log(result);
var counter = 0;
Object.keys(result).every((student) => {

      if(counter == 0){
        schoolArr.push(result[student]["School Name"]);
        counter+=1;
        return true;
      }else{

        if(schoolArr[counter-1] != result[student]["School Name"]){

          var finder = schoolArr.findIndex(function(ele){

            return ele.localeCompare(result[student]["School Name"]);
          });
          // console.log("finder ", finder);

          if(finder == 0){
            schoolArr.push(result[student]["School Name"]);
            // console.log("Pushing school ", result[student]["School Name"]);
            counter+=1;
          }
        }
        return true;
      }
})
// console.log(schoolArr);

admin.post("/admin/manipulate", (req, res)=>{
  console.log("manipulate called");
  var touched = req.body;
  console.log("touched ", touched);
  console.log("typeof", typeof(req.body));
  console.log(touched[0]);
  var touchedCounter = 0;
  Object.keys(result).every((student)=>{
    // console.log(student);
    for(obj in touched){
      if(touched[obj]["id"] == result[student]["Reg No"]){
        //manipulate this object studnet
        //add counter ++
        touchedCounter++;
        console.log("touchedCounter ", touchedCounter);
        var sub = touched[obj]["subject"];

        Object.keys(sub).forEach((ject)=>{
          //first accessing from result and assigning from touched
          result[student][ject] = sub[ject];

        });

      }
    }
    if(touchedCounter == touched.length){
      console.log("terminating every ");
      return false
    }
    return true
  });

  // rewrite it with space and formatting
  jsonfile.writeFile("./../new.json", result, {spaces: 2, EOL: '\r\n'}, function(err) {
    if(err)
      console.error(err)
    else console.log("Done rewriting");
  });
  res.send({ messages: req.flash("messages") });
});

admin.get('/admin/school', function(req, res){
    console.log("school called");

    console.log("school name is ", req.param('school'));
    searchSchool = [];
    schoolArr.forEach((school)=>{
      // console.log("schoool is ", school);
      if(school.startsWith(req.param('school'))){
        searchSchool.push(school);
        console.log("owww got the schoool ", school);
      }
    });
    console.log("sending ");
    console.log(searchSchool);
    res.send(searchSchool);

  });
admin.get('/admin/school_list', function(req, res){
      console.log("school _list called");
      console.log("school name ", req.param('school'));
      var schoolList = result.filter(function(el){
        // console.log("el ", el);
        return el["School Name"] == req.param("school")
      });
      console.log("sending list");
      // console.log(schoolList);
      res.send(schoolList);


});

module.exports = admin;
