'use strict';

var express  = require('express');
var passport = require('passport');
var mongoose = require('mongoose');

var router   = express.Router();
var User     = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;
var LocalStrategy = require('passport-local').Strategy;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// User Routes
router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.status(500).json({err: err});
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({status: 'Registration successful!'});
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

