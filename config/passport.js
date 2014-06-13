// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		console.log('AUthenticating');
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
			console.log ('in next');
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
			console.log(email);
			console.log(password);
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
			console.log('hi terehe');
            if (err)
                return done(err);
			
            // check to see if theres already a user with that email
            if (user) {
				console.log('hi terehe1');
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
				console.log('hi terehe2');
				// if there is no user with that email
                // create the user
				console.log('Creating new User');
                var newUser            = new User();

                // set the user's local credentials
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);

				// save the user
				console.log('Saving User info');
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};
