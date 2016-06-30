'use strict';

// drawings routes use drawings controller
var path = require('path');
var userController = require('../controllers/userController');
var users = userController; 
var auth = require('../auth/auth');
var session = require('../controllers/sessionController');

var User = require('../models/userModel');

module.exports = function(app, passport) {

    // app.post('/users', userController.create);

    // app.get('/users', userController.all);

    
  // User Routes
  // var users = require('../controllers/userController');
  app.post('/signup', users.signup);
  // app.get('/auth/users/:userId', users.findById);

  // Check if username is available
  // todo: probably should be a query on users
  // app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  // var session = require('../controllers/sessionController');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  
  app.del('/auth/session', session.logout);

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) { //ror 

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
};