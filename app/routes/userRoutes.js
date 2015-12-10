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
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  // var session = require('../controllers/sessionController');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  //Setting up the blogId param
//  app.param('blogId', blogs.blog);

  // Angular Routes HERE  override of drawingRoutes???
  // app.get('/views/*', function(req, res) {
  //   var requestedView = path.join('/', req.url);
  //   res.render(requestedView);
  // });


   //  app.get('/user/:userId', function(req, res){
   //      User.findOne({'_id': req.params.userId}, function(err, user){
   //          if(err){
   //              //res.render('error', {status:500});
   //              console.log('error', {status:500});
   //          } else {
   //              res.jsonp(user);
   //          }
   //      });
   //  });
   //  app.get('/users', function(req, res){
   //         User.find().exec(function(err, users){
   //      if(err){
   //          console.log("ERRORORERWER 500");
   //      } else {
   //          res.jsonp(users);
   //      }
   //  });
   //     });
   //  // app.delete('/drawings/:userId', drawingController.deleteById);

   //  // show the login form
   //  // app.get('/login', function(req, res) {

   //  //     // render the page and pass in any flash data if it exists
   //  //     res.render(, { message: 'signup'}); 
   //  // });

   //  // make sure flash is good 
   // app.post('/login', passport.authenticate('local-login', {
   //      successRedirect : path.format({root:"http://localhost/", dir:"/#/draw"}) , // redirect to the secure profile section
   //      failureRedirect : path.format({root:"http://localhost/", dir:"/login"}), // redirect back to the signup page if there is an error
   //      failureFlash : true // allow flash messages
   //  }), session.session);

   //  // show the signup form
   //  app.get('/signup', function(req, res) {

   //      // render the page and pass in any flash data if it exists
   //      res.render('user/signup.tpl.html', { message: 'login' });
   //  });

   //     app.post('/signup', passport.authenticate('local-signup', {
   //      successRedirect : path.format({root:"http://localhost/", dir:"/#/draw"}), // redirect to the secure profile section
   //      failureRedirect : 'http://localhost:3000/signup', // redirect back to the signup page if there is an error
   //      failureFlash : true // allow flash messages
   //  }));

   //  // TODO: this is pretty basic...need to continue wiring up the Angular {{User}} controller 
   //  // protected, logged in to visit
   //  app.get('/profile', isLoggedIn, function(req, res) {
   //      res.render('user/profile.tpl.html', { // TODO: modify for {{}}
   //          user : req.user // get the user out of session and pass to template
   //      });
   //  });

   //  app.get('/logout', function(req, res) {
   //      req.logout();
   //      res.redirect('/');
   //  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) { //ror 

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
};