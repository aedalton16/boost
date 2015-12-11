var express  = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var path     = require('path');

// TODO adalton: This should be split out into session router
var auth     = require('../auth/auth');
var session  = require('../controllers/sessionController');

var router   = express.Router();
var User     = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;

// Route handlers
var createUser = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function(err) {
    if (err) {
      return res.status(400).json(err);
    }

    req.logIn(newUser, function(err) {
      if (err) return next(err);
      return res.json(newUser.user_info);
    });
  });
};


var getUser = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER NOT FOUND')
    }
  });
};

var userExists = function (req, res, next) {
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
};

// User Routes
router.post('/users', createUser);
router.get('/users/:userId', getUser);

// Check if username is available
// todo: probably should be a query on users
router.get('/check_username/:username', userExists);

// TODO Session should be split out into session routes file
// Session Routes
// var session = require('../controllers/sessionController');
router.get('/session', auth.ensureAuthenticated, session.session);
router.post('/session', session.login);
router.delete('/session', session.logout);

//Setting up the blogId param
//  router.param('blogId', blogs.blog);

// Angular Routes HERE  override of drawingRoutes???
// router.get('/views/*', function(req, res) {
//   var requestedView = path.join('/', req.url);
//   res.render(requestedView);
// });


//  router.get('/user/:userId', function(req, res){
//      User.findOne({'_id': req.params.userId}, function(err, user){
//          if(err){
//              //res.render('error', {status:500});
//              console.log('error', {status:500});
//          } else {
//              res.jsonp(user);
//          }
//      });
//  });
//  router.get('/users', function(req, res){
//         User.find().exec(function(err, users){
//      if(err){
//          console.log("ERRORORERWER 500");
//      } else {
//          res.jsonp(users);
//      }
//  });
//     });
//  // router.delete('/drawings/:userId', drawingController.deleteById);

//  // show the login form
//  // router.get('/login', function(req, res) {

//  //     // render the page and pass in any flash data if it exists
//  //     res.render(, { message: 'signup'}); 
//  // });

//  // make sure flash is good 
// router.post('/login', passport.authenticate('local-login', {
//      successRedirect : path.format({root:"http://localhost/", dir:"/#/draw"}) , // redirect to the secure profile section
//      failureRedirect : path.format({root:"http://localhost/", dir:"/login"}), // redirect back to the signup page if there is an error
//      failureFlash : true // allow flash messages
//  }), session.session);

//  // show the signup form
//  router.get('/signup', function(req, res) {

//      // render the page and pass in any flash data if it exists
//      res.render('user/signup.tpl.html', { message: 'login' });
//  });

//     router.post('/signup', passport.authenticate('local-signup', {
//      successRedirect : path.format({root:"http://localhost/", dir:"/#/draw"}), // redirect to the secure profile section
//      failureRedirect : 'http://localhost:3000/signup', // redirect back to the signup page if there is an error
//      failureFlash : true // allow flash messages
//  }));

//  // TODO: this is pretty basic...need to continue wiring up the Angular {{User}} controller 
//  // protected, logged in to visit
//  router.get('/profile', isLoggedIn, function(req, res) {
//      res.render('user/profile.tpl.html', { // TODO: modify for {{}}
//          user : req.user // get the user out of session and pass to template
//      });
//  });

//  router.get('/logout', function(req, res) {
//      req.logout();
//      res.redirect('/');
//  });

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) { //ror 

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
};
