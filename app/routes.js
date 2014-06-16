	var MyTask = require('./models/task');

module.exports = function(app, passport) {

	// api ---------------------------------------------------------------------
	// get all todos
	
	
	// application -------------------------------------------------------------
	app.get('/login', function(req, res) {
		res.sendfile('./public/html/login.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
	
	app.get('/home', isLoggedIn, function(req, res){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.sendfile('./public/html/home.html');
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	//GET function for signup page
	app.get('/signup', function(req, res){
		res.sendfile('./public/html/signup.html');
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : false // allow flash messages
	}));
	
	
	
	// Routes for Tasks
	app.get('/api/tasks', function(req, res) {
	
		// use mongoose to get all tasks in the database
		MyTask.find(function(err, tasks) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
			res.json(tasks); // return all tasks in JSON format
		});
	});
	
	// create tasks and send back all tasks after creation
	app.post('/api/tasks', function(req, res) {
	
		// create a todo, information comes from Angular
		MyTask.create({
			title: req.body.taskname,
			description: req.body.taskdesc,
			pc : 0,
			assignee: "Ranjith"
		},function(err, todo) {
			if (err)
				res.send(err);
			MyTask.find(function(err,tasks) {
				if (err)
					res.send(err)
				res.json(tasks);
				});
		});
	});
	
	// delete a task and send back all tasks after deletion
	app.delete('/api/tasks/:task_id', function(req, res) {
		MyTask.remove({
			_id : req.params.task_id
		}, function(err, todo) {
			if (err)
				res.send(err);
			
			MyTask.find(function(err,tasks) {
				if (err)
					res.send(err)
				res.json(tasks);
				});
		});
	});
	
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
