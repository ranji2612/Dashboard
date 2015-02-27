//'use strict';

module.exports = function(app, passport) {
	
	//All API
	app.use('/api/tasks', require('./api/tasks'));

	// Load the home page for others apart from api
	//404 handled at UI routing
	app.get('/*', function(req, res){
		
		res.sendfile('public/html/home.html');	
		
	});
	
};



	
