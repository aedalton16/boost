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
  // (                  - Start of group
  // ^                  - Start of string
  //  (?=.*\d)          - Decimal
  //  (?=.*[a-z])       - lowercase
  //  (?=.*[A-Z])       - UPPERCASE
  //  (?=.*[@#$%!?^&*]) - $p3c!a1
  //  .{6,20}           - Between 6 to 20 characters
  // $                  - End of string
  // )                  - End of group
  var passwordFormat = /(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!?^&*]).{6,20}$)/g;
  if (passwordFormat.test(password)) {
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

