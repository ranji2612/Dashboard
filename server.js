
//Initial configuration
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var bodyParser     = require('body-parser');			// To fetch data during posts
var port  	 = process.env.PORT || 8000; 				// set the port
var database = require('./config/database'); 			// load the database config

var db = mongoose.connect(database.url);	// connect to mongoDB database on modulus.io

// auth related
var passport = require('passport');
var flash 	 = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');


// required for passport
app.use(session({ secret: 'jhhsdjakorijfsmdhtuypaswlmdjfk' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//Middle-tier configuration

app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.use(cookieParser())

// All the minified files will be stored in dist Eg. dist/js/app.min.js 
app.use(express.static(__dirname + '/dist')); 	// set the static files location
app.use(express.static(__dirname + '/public')); 	// set the static files location
app.use(express.static(__dirname + '/scripts')); 	// set the static files location

require('./config/security/passport.js')(passport);
//route file
require('./app/routes/routes.js')(app,passport);


//Start the awesomeness
app.listen(port ,function() {	
	console.log('Magic happens on port ',port); 
});
