var express = require('express'); 
var app = express(); 

// var socketIo = ;

// start webserver on port 8080
var server =  require('http').Server(app);
var io = require('socket.io').listen(server);
// server.listen(3000);

// add directory with our static files
app.use(express.static(__dirname + '/public'));

// DB
var mongo = require('mongodb');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});

var classroom = require('./routes/classroom');
var users = require('./routes/users');
app.use('/class', classroom);
app.use('/users', users);



server.listen(3000, function(){
	console.log('listening on *:3000');
});

// array of all lines drawn
var line_history = [];


var nsp = io.of('/classroom');

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




