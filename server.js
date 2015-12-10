var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var passport = require('passport');
var path = require('path');
var flash    = require('connect-flash');
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
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
  process.exit(1);
});

// TODO: parse into db.js file 
var mongoURL = process.env.MONGOHQ_URL;// || "mongodb://localhost";
mongoose.connect(mongoURL + "/boost_1"); // somehow a little tick mark got in here which is terrifying.......


// required for passport
app.use(session({ secret: 'dartmongoose' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/*
* controller config, db models 
*/
require('./app/models/drawingModel');
require('./app/models/userModel');

require('./app/controllers/drawingController').init(io);
// require('./app/controllers/userController');//(passport);
// require('./app/controllers/chatController').init(io);


require('./app/auth/config')(passport); // ** 

/*
 * routes
 */
require('./app/routes/drawingRoutes')(app);
require('./app/routes/userRoutes')(app, passport);
// require('./app/routes/userRoutes')(app, passport);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');


server.listen(port);

exports = module.exports = app;
