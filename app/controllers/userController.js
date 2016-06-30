'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.signup = function (req, res, next) {
  var newUser = new User(req.body);
  console.log(req.body);
  newUser.provider = 'local'; //local

  newUser.save(function(err) {
    if (err) {
      console.log('no save');
      return  res.status(400).json(err);
    }

    req.logIn(newUser, function(err) {
      if (err) { 
      console.log('no login err');return next(err);}
      return res.json(newUser.user_info);
    });
  });
};

/**
 *  Show profile
 *  returns {username, profile}
 */

// TODO:find a way to use one set of codes and pass in model param??
 exports.findById = function(req, res){
  User.findOne({'_id': req.params.userId}, function(err, user){
    if (err){
      console.log(error, {status: 500});
    }else{
      res.jsonp(user); //use passport? 
    }
  });
 };


/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var username = req.params.username;
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}
