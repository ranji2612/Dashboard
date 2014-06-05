var mongoose = require('moongose')
var bcrypt = require('bcrypt-nodejs')

var userSchema = moongose.Schema({
	email : String,
	password : String,
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
});

userScehema/method.validatePassword = function(password){
	return bcrypt.compareSync(password, this.local.password):
};

modules.exports = moongose.model('User', userSchema);
