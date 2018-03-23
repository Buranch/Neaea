const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const passportLocalMongoose = require('passport-local-mongoose');


mongoose.Promise = global.Promise;
// mongoimport --db dbName --collection collectionName --file fileName.json --jsonArray
mongoose.connect('mongodb://localhost/nodeauth', (err, s)=>{
  if(err){
    console.log("error bappened connectin database");
  }else{
    console.log("no error bappened connectin database");

  }
});
// console.log(mongoose);

// mongoose.useMongoClient;
var db = mongoose.connection;
var User = new mongoose.Schema(
  {
    email:{
      type: String,
      // unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      // unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  }
);
// User.plugin(passportLocalMongoose);

var User = module.exports = mongoose.model("User", User);
// module.exports = mongoose.model("NameBirr", Schema);

module.exports.getUserById = (id, callback)=>{
    User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) =>{
  console.log("Get user by id: ");
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback)=>{
  bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
    callback(null, isMatch);
  });
}

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    })
  });
};
