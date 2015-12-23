'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
var UserSchema = mongoose.Schema({
  provider: String
  // for now only local
  // facebook         : {
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  // },
  // twitter          : {
  //     id           : String,
  //     token        : String,
  //     displayName  : String,
  //     username     : String
  // },
  // google           : {
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  // }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual('user_info').get(function () {
  return {
    _id: this._id,
    username: this.username
  };
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

