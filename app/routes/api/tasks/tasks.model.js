var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
  	},{ collection: 'tasksCollection' });

module.exports = mongoose.model('tasksModel', dbSchema);