var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
  	},{ collection: 'currCheapRate' });

module.exports = mongoose.model('flightsCurrentRate', dbSchema);

