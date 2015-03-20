var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
	tn	: String,
	td	: String,
	cb	: String,
	cd	: Number,
	ed	: Number,
	nos	: Number,
	st	: Boolean
  	},{ collection: 'tasksCollection' });

module.exports = mongoose.model('tasksModel', dbSchema);