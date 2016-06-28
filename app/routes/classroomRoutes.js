var classroomController = require('../controllers/classroomController');

module.exports = funciton(app) {
	app.post('/classrooms', classroomController.create);
	app.get('/classrooms', classroomController.all);
	app.get('/classrooms/:classroomId', classroomController.findById);
	app.delete('/classrooms/:classroomId', classroomController.deleteById);
}