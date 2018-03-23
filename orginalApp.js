const express = require('express');
const app = require('express')();

const path = require('path');
const fs = require('fs');;
const http = require('http').Server(app);
// const XLSX = require('xlsx');
// const xlsx = require('node-xlsx');
// Or var xlsx = require('nsode-xlsx').default;
//const result = require('./myJsonFile.json');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const users = require('./routes/users');

const mongo = require('mongodb');

const mongoose = require('mongoose');

// var db = mongoo

app.use(express.static(__dirname+ '/public'));
app.use(express.static(__dirname+ '/views'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/users', users);
app.use('/', routes);

http.listen(3000, function() {
    console.log("Listening to 3000 port ");
    console.log("I swear to GOD");
});
