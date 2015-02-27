//'use strict';

//Tasks collection
var taskModel  = require('./tasks.model');


var express = require('express');
var router = express.Router();


//Get all the task
router.get('/', function( req, res) {
	//Return first 10 or 20 tasks based on some criteria
	taskModel.find({}, function(err, data) {
		if (err) res.send(400);
		res.json(data);
	});

});

//Create a new task
router.post('/', function(req,res) {
	console.log(req.body.cd);
	console.log(req.body.ed);
	taskModel.create({tn: req.body.tn, cb: req.body.cb, cd: req.body.cd, ed: req.body.ed, nos: req.body.nos, st : req.body.st},function(err, data) {
		if (err) res.send(400);
		res.json(200);
	});
});

module.exports = router;