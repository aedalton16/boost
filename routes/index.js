var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});


router.get('/user', function(req, res) {
    res.render('user');
});



router.post('/login', function(req, res, next) {


  passport.authenticate('loginUsers', function(err, user, info) {

    if (err) {
       return next(err);
   }
    // if user is not found due to wrong username or password
    if (!user) {
      //return res.render('login', {});
      res.json({detail: info});
    }//(!user)
    //passport.js has a logIn user method

    req.logIn(user, function(err) {

      if (err) { return next(err); }
      return res.render('account', {});
    }); //req.logIn
  })(req, res, next); 
}); 


module.exports = router;


