var express = require('express'); 
var mongo = require('mongodb');
var monk = require('monk');
// var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser'); // pull from HTML POST
var methodOverride = require('method-override'); // HTML verb simulation, PUT and DELETE
var cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');
var expressSession = require('express-session');

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

var app = express(); 
app.set('views', path.join(__dirname, 'views'));
// PORT --- start webserver on port 3000
var server =  require('http').Server(app);
// var server =  require('http').createServer(function(req, res){
// 	require('./router').get(req, res);
// });

var io = require('socket.io').listen(server);
server.listen(3000, function(){
	console.log('listening on *:3000');
});

// DIR
app.use(express.static(__dirname + '/public'));

// DB
// var dbConfig = require('./db.js');
// mongoose.connect(dbConfig.url);

var db = monk('localhost:27017/boost_1');
// var db = mongoose.connection; 

db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

var users = require('./routes/users'); 
app.use('/users', users);


app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());



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




