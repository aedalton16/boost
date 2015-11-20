// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require("path");

var configDB = require('./db.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./public/javascripts/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.join(__dirname, 'public')));

// db.on('error', function (err) {
// console.log('connection error', err);
// });
// db.once('open', function () {
// console.log('connected.');
// });

// routes ======================================================================
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
var server =  require('http').Server(app);
var io = require('socket.io').listen(server);
server.listen(3000, function(){
  console.log('listening on *:3000');
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


//app.listen(port);
console.log('The magic happens on port ' + port);
