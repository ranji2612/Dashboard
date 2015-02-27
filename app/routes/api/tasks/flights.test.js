//Testing using mocha for api routes	
var assert = require("assert");
//var expect = require("expect");
var request = require('supertest');

describe('Flight Track Test', function(){
  
  describe('# Flights Current Rate', function(){
    
	it('POST req should respond with JSON & has two entries', function(done) { 
	request('http://localhost:8080')
	  .post('/api/flightTrack')
	  .send({"fromLoc":"DEL","toLoc":"BLR", "dateList": ["04/01/2015","05/01/2015"]})
	  .expect('Content-Type', "application/json")
	  .expect(200)
	  .end(function(err, res){
		assert.equal(2,JSON.parse(res.text).length);
		if (err) throw err;
		done();
	  });
	});
	  
	//Default search with just from and to should return 3 month from now result
	//If threshold is also given(but not dates), its handled at the client side
	it('should return 3 months results for default search (not yet written)', function() {
		
	});
  });
	

  describe('# Flight Rate Change', function() {
	  it('POST to get old rates should return atleast one entry', function(done) {
		  request('http://localhost:8080')
			  .post('/api/flightTrack/rateChange')
			  .send({"date": "05/01/2015"})
			  .expect('Content-Type', "application/json")
			  .expect(200)
			  .end(function(err, res){
				//Checking if the response has some elements in it
			  	assert.notEqual(JSON.parse(res.text).length, 0, 'there are some entries');
			    if (err) throw err;
				done();
			  });
	  });
  });
});