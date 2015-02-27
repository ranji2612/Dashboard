//'use strict';

//Current rate collection
var flightsCurrentRate  = require('./flightsCurrentRate.model');
//Older Rate collection
var flightsOlderRate  = require('./flightsOlderRate.model');


var express = require('express');
var router = express.Router();


//Getting the current rate
router.post('/', function( req, res) {
	// Need to add Threshold also
	//If Date is empty, set for next 1 or 2 or 3 months
	flightsCurrentRate.find( {from:req.body.fromLoc, to:req.body.toLoc, date: { $in : req.body.dateList }}, function(err, data) {
		if (err) {
			res.send(err);
			res.end();
		}
		res.json(data);
	});

});

//For Graph - Getting the past record of cheapest rate on that date
router.post('/rateChange', function(req,res) {
		flightsOlderRate.find({date : req.body.date }, function(err, data) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(data); // return all tasks in JSON format

		});		
});

module.exports = router;