//'use strict';

//Tasks collection
var taskModel  = require('./tasks.model');


var express = require('express');
var router = express.Router();


//Getting the current rate
router.post('/', function( req, res) {
	// Need to add Threshold also
	//If Date is empty, set for next 1 or 2 or 3 months
	

});

//For Graph - Getting the past record of cheapest rate on that date
router.post('/rateChange', function(req,res) {
		
});

module.exports = router;