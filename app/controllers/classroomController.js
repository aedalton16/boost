var classroomController = require('../controllers/classroomController');
var Classroom = require('../models/classroomModel');


exports.all = function(req, res){
	Classroom.find().exec(function(err, classrooms){
		if (err) {
			console.log('error all');
		}
		else {
			res.jsonp(classrooms);
		}
	})
}
exports.create = function(req, res) {
	var classroom = new Classroom(req.body); // here 
	classroom.save(function(err){
		if(err) { 
			console.log("Error " + err); 
			res.send(500);
		} else {
			res.jsonp(classroom);
			sockets.emit("add-classroom", classroom);
		}

	});
};

exports.findById = function(req, res) {
	Classroom.findOne({'_id': req.params.classroomId}, 
		function(err, classroom){
			if (err) { 
				console.log('error', {status: 500});
			} else { 
				res.jsonp(classroom);
			}
	});
};

exports.classroomWithAllDrawings(req, res) {
	Classroom.findOne({'_id': req.params.classroomId}, 
		function(err, classroom))

}
