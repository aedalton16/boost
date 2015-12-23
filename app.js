'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport');
var path = require('path');
var flash  = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var server = require('http').createServer(app)

var port = process.env.PORT || 3000;
var mongoURL = process.env.MONGOHQ_URL || "mongodb://localhost";
/*
 * web socket config TODO: Let's set up separate ports for chat, whiteboard, etc
 */
var io = require('socket.io').listen(server, {log:false});

app.use(morgan('dev'));
app.use(cookieParser());

/* 
 * safest for Express 4
 */

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); 
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// TODO: Why do we still have this?
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/*
 * db config
 */
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
  process.exit(1);
});
mongoose.connect(mongoURL + "/boost");
// Initialize models
var models = require('./app/models');


// required for passport
app.use(session({ secret: 'dartmongoose' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Initialize routes
require('./app/controllers/drawingController').init(io);
var routes = require('./app/routes');
app.use('/api', routes)

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');

server.listen(port);

exports = module.exports = app;

