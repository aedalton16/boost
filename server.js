var express = require('express'); 
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var expressSession = require('express-session');

var app = express(); 

// PORT --- start webserver on port 3000
var server =  require('http').Server(app);
var io = require('socket.io').listen(server);
server.listen(3000, function(){
	console.log('listening on *:3000');
});

// DIR
app.use(express.static(__dirname + '/public'));


// ROUTES 
var classroom = require('./routes/classroom');
var users = require('./routes/users');
app.use('/class', classroom);
app.use('/users', users);

// DB
var dbConfig = require('./db.js');

mongoose.connect(dbConfig.url);
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});

// USER AUTH
app.use(expressSession({secret: 'authKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
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




