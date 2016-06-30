'use strict';

// drawings routes use drawings controller
var path = require('path');

var auth = require('../config/auth');
var session = require('../controllers/sessionController');

var User = require('../models/userModel');
'use strict';

var users = require('../controllers/userController');
module.exports = function(app) {
  // User Routes
  
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });



};