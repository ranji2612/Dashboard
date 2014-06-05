//./app/model/user.js
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

//decalring user schema
var userSchema = mongoose.Schema({
	email : String,
	password : String,
});

//method to hash password
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

//method to validate password
userSchema.method.validatePassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
