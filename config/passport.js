var localStrategy = require('passport-local').Strategy
var User = require('../app/models/user')

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null,user.id);
	});
	
	passport.deserializeUser(function(id, done){
		User.findbyId(id, function(err,user){
		done(err, user);
		});
	});
	
	passport.use('local-signup', new LocalStrategy({
		usernamefield : 'email',
		passwordfield : 'password',
		passReqToCallBack : true
	}
	function (req, email, password, done){
		process.nextTick(function(){
		
		User.findOne({ 'local.email' : email}, function (err, user){
			if(err)
				return done(err)
			if(user){
				return (done, null, false, req.flash('signupMessage','Email Already Exists'));
			}
			else{
				var newUser = new User();
				newUser.local.email = email;
				newUser.local.passowrd = newUser.generateHash(password);
				newUser.save(function(err){
					if(err)
						throw err;
					return done(null, newUser);
				});
			}	
		});
		});
	}));
};
