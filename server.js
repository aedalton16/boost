var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var passport = require('passport');
var path = require('path');
var flash    = require('connect-flash');

var ExpressPeerServer = require('peer').ExpressPeerServer;
var port = process.env.PORT || 3000;
/*
 * web socket config
 */
var io = require('socket.io').listen(server, {log:false});

/*
 * standard utilities
 */
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

app.use(morgan('dev'));
app.use(cookieParser());

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
/* 
 * safest for Express 4
 */

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); 
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/*
 * db config
 */

// mongodb://<dbuser>:<dbpassword>@ds011314.mlab.com:11314/boost
// MONGOHQ_URI fails 
var mongoURL = process.env.MONGODB_URI || "mongodb://localhost";
mongoose.connect(mongoURL + "/boost");

mongoose.connection.on('error', function (err) {
	console.log('Could not connect to mongo server!');
	console.log(err);
	process.exit(1);
    });

// TODO: parse into db.js file 
// var mongoURL = 'mongodb://myUserAdmin:abc123@localhost:27017/boost'; //process.env.MONGOHQ_URL || 
// mongoose.connect(mongoURL); // somehow a little tick mark got in here which is terrifying.......


// required for passport
// app.use(session({ secret: 'dartmongoose' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(session({
	    secret: 'cookie_secret',
		resave: true,
		saveUninitialized: true
		}));

/*
 * controller config, db models 
 */
require('./app/models/drawingModel');
require('./app/models/userModel');

require('./app/controllers/drawingController').init(io);
// require('./app/controllers/userController');//(passport);
// require('./app/controllers/chatController').init(io);


require('./app/config/config'); // ** 

/*
 * routes
 */
require('./app/routes/drawingRoutes')(app);
require('./app/routes/userRoutes')(app,  passport); //'/auth', yes 

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');


app.use('/peerjs', ExpressPeerServer(server, {debug:true}));
server.listen(port);

exports = module.exports = app;