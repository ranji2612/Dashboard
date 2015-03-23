//'use strict';

//Tasks collection
var taskModel  = require('./tasks.model');

var mongoose = require('mongoose');
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

//Get specific task based in Id
router.get('/:taskName', function( req, res) {
	//Return first 10 or 20 tasks based on some criteria
	//taskModel.find({"_id": mongoose.Types.ObjectId(req.params.taskId)},function(err, data) {
	taskModel.find({tn:req.params.taskName},function(err, data) {
		if(err) res.send(err);
		res.json(data[0]);
	});
});

//Delete specific task based in Id
router.delete('/:taskName', function( req, res) {
	//Return first 10 or 20 tasks based on some criteria
	//taskModel.find({"_id": mongoose.Types.ObjectId(req.params.taskId)},function(err, data) {
	taskModel.remove({tn:req.params.taskName},function(err, data) {
		if(err) res.send(err);
		res.json(data[0]);
	});
});

//Create a new task
router.post('/', function(req,res) {
	
	taskModel.create({tn: req.body.tn,td: req.body.td, cb: req.body.cb, cd: req.body.cd, ed: req.body.ed, nos: req.body.nos, st : req.body.st},function(err, data) {
		if (err) res.send(400);
		res.json(200);
	});
});

module.exports = router;