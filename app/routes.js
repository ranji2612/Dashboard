	var MyTask = require('./models/todo');

module.exports = function(app,db) {

	// api ---------------------------------------------------------------------
	// get all todos
	
	
	// application -------------------------------------------------------------
	app.get('/home', function(req, res) {
		res.sendfile('./public/html/home.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
	
	
	// get all tasks
	app.get('/api/tasks', function(req, res) {

		// use mongoose to get all tasks in the database
		MyTask.find(function(err, tasks) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(tasks); // return all tasks in JSON format
		});
	});
	
	// create todo and send back all tasks after creation
	app.post('/api/tasks', function(req, res) {
		console.log("working");
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
	
		// delete a task
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