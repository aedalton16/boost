'use strict';

var mongoose = require('mongoose');
var generaterr = require('generaterr');
// Implements most of auth for us, including salt/hashing. See GitHub for impl details
// https://github.com/saintedlama/passport-local-mongoose/blob/master/index.js
var passportLocalMongoose = require('passport-local-mongoose');
var errors = passportLocalMongoose.errors;
errors.InvalidPasswordError = generaterr('InvalidPasswordError', null, {
  inherits: errors.AuthenticationError
});

var UserSchema = mongoose.Schema({
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

var options = {};
options.passwordValidator = function(password, cb) {
  // TODO: Change to actual test
  if (password.length >= 8) {
    cb(null);
  } else {
    cb(new errors.InvalidPasswordError("Password is of an invalid form."));
  }
};

UserSchema.plugin(passportLocalMongoose, options);

UserSchema.virtual('user_info').get(function () {
  return {
    _id: this._id,
    username: this.username
  };
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

