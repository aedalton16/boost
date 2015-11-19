var express = require('express'); 
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport'), 
GoogleStrategy = require('passport-google-oauth2').Strategy, 
LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser'); // pull from HTML POST
var methodOverride = require('method-override'); // HTML verb simulation, PUT and DELETE
var cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');
var session = require('express-session');


//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

var app = express(); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// PORT --- start webserver on port 3000
var server =  require('http').Server(app);
// var server =  require('http').createServer(function(req, res){
// 	require('./router').get(req, res);
// });

var io = require('socket.io').listen(server);
server.listen(process.env.PORT, function(){
	console.log('listening on *:3000');
});

// DIR
app.use(express.static(path.join(__dirname, 'public')));

// DB
var dbConfig = require('./db.js');
mongoose.connect(dbConfig.url);

// var db = monk('localhost:27017/boost_1');
var db = mongoose.connection; 

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});

// app.get('/', function(req, res){
// 	res.sendFile(__dirname + '/index.html');

// });

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
var routes = require('./routes/index');
app.use('/', routes);

require('./public/javascripts/passport')(passport); // pass passport for configuration
require('./routes/users')(app, passport); 
//app.use('/users', users);


app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
  res.locals.message = req.flash();
  next();
});
// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

	// first send the history to the new client
	for (var i in line_history) {
	    socket.emit('draw_line', { line: line_history[i] } );
	}

	// add handler for message type "draw_line".
	socket.on('draw_line', function (data) {
		// add received line to history 
		line_history.push(data.line);
		// send line to all clients
		io.emit('draw_line', { line: data.line });
	    });
	//console.log('listening on *:3000');
  	socket.on('chat message', function(msg){
  		io.emit('chat message', msg);
    console.log('chat message: ' + msg);
  });
});




