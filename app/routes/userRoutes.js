'use strict';

// drawings routes use drawings controller
var userController = require('../controllers/userController');

module.exports = function(app) {

    app.post('/users', userController.create);

    app.get('/users', userController.all);

    app.get('/user/:userId', userController.findById);

    // app.delete('/drawings/:userId', drawingController.deleteById);

};