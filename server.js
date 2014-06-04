//------------------------------ set up -----------------------------------------
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var serverUrl = "10.176.127.252";

// ----------------------------------------- configuration -------------------------------------
var db = mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io


app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// For core functionality
	app.use(express.static(__dirname + '/public/html')); 	// For all HTML files
	app.use(express.static(__dirname + '/public/css')); 	// For all the corresponding css files
	app.use(express.static(__dirname + '/public/Bootstrap')); 	// For all the corresponding css files
	
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

//----------------------------------------- routes -----------------------------------------
require('./app/routes.js')(app,db);

//------------------- Start your Engines :P (listen )-----------------------------------------
//app.listen(port,serverUrl);
app.listen(port)
console.log("App listening on port " + port);
