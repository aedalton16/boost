'use strict';

var mongoose = require('mongoose');
var passport = require('passport');

/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
  res.json(req.user.user_info);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
  if(req.user) {
    req.logout();
    res.sendStatus(200);
  } else {
    res.status(400).send("Not logged in");
  }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    err = err || info;
    if (err) { return res.status(400).json(err); }
    req.logIn(user, function(err) {
      if (err) { return res.status(400).send(err); }
      res.json(req.user.user_info);
    });
  })(req, res, next);
};

