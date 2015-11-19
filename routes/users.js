var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});


/* GET users listing.*/ 

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	var userToDelete = req.params.id;
	collection.remove({ '_id' : userToDelete }, function(err) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
	});
});
module.exports = router;