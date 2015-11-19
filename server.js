var express = require('express'); 
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
// var morgan = require('morgan');
var passport = require('passport'), 
GoogleStrategy = require('passport-google').Strategy, 
LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser'); // pull from HTML POST
var methodOverride = require('method-override'); // HTML verb simulation, PUT and DELETE
var cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');
var expressSession = require('express-session');


//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

var app = express(); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
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
app.use(express.static(path.join(__dirname, 'public')));

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
var users = require('./routes/users'); 
app.use('/users', users);


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));



app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new GoogleStrategy({
    returnURL: 'localhost:3000/auth/google/return',
    realm: 'localhost:3000'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));


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




