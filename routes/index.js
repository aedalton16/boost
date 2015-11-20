var express = require('express');
var passport = require('passport');
var router = express.Router();
var flash = require('connect-flash');
var user = require('../models/user');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});


router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.post('/signup', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.email;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});


 router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });
// process the signup form
    
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
module.exports = router;


