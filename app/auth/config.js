// config/passport.js
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

module.exports = function(passport) {
  // required for persistent login sessions
  // used to serialize the user for the session

};

