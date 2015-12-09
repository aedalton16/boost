'use strict';

// drawings routes use drawings controller
var path = require('path');
var userController = require('../controllers/userController');
var User = require('../models/userModel');

module.exports = function(app, passport) {

    // app.post('/users', userController.create);

    // app.get('/users', userController.all);

    var session = require('../controllers/sessionController');

    app.get('/auth/session', isLoggedIn, session.session);
    app.post('/auth/session', session.login);
    app.del('/auth/session', session.logout);

    app.get('/user/:userId', function(req, res){
        User.findOne({'_id': req.params.userId}, function(err, user){
            if(err){
                //res.render('error', {status:500});
                console.log('error', {status:500});
            } else {
                res.jsonp(user);
            }
        });
    });
    app.get('/users', function(req, res){
           User.find().exec(function(err, users){
        if(err){
            console.log("ERRORORERWER 500");
        } else {
            res.jsonp(users);
        }
    });
       });
    // app.delete('/drawings/:userId', drawingController.deleteById);

    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('user/login.tpl.html', { message: 'signup'}); 
    });

    // make sure flash is good 
   app.post('/login', passport.authenticate('local-login', {
        successRedirect : 'http://localhost:3000/#draw', // redirect to the secure profile section
        failureRedirect : 'http://localhost:3000/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('user/signup.tpl.html', { message: 'login' });
    });

       app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : 'http://localhost:3000/#draw', // redirect to the secure profile section
        failureRedirect : 'http://localhost:3000/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // protected, logged in to visit
    app.get('/draw', isLoggedIn, function(req, res) {
        res.render('drawings/drawing.tpl.html', { // TODO: modify for {{}}
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};