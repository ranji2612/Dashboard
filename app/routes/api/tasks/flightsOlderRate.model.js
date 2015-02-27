var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
  	},{ collection: 'olderCheapRates' });

module.exports = mongoose.model('flightsOlderRate', dbSchema);