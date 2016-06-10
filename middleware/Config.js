// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);



module.exports = function(passport) {

//=====================================
//AUTHENTICATION SETUP
//=====================================
passport.use(new FacebookStrategy({
    clientID: 261460150870678,//process.env.CLIENT_ID,
    clientSecret: '54da0a9f6352a8adf21c359a545b2257',//process.env.CLIENT_SECRET,
    callbackURL: 'https://morning-dawn-49717.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',		
	},

	function(username, password, done){

		console.log('in local auth username: ' + username + '. password: ' + password);
		// from tutuorial website
        // User.findOne({ 'local.email' :  email }, function(err, user) {
        //     // if there are any errors, return the error before anything else
        //     if (err)
        //         return done(err);

        //     // if no user is found, return the message
        //     if (!user)
        //         return done(null, false, {message: "Message: email not found in database"}); // req.flash is the way to set flashdata using connect-flash

        //     // if the user is found but the password is wrong
        //     if (!user.validPassword(password))
        //         return done(null, false,{message: "Message: email not found in database"}); // create the loginMessage and save it to session as flashdata

        //     // all is well, return successful user
        //     return done(null, user);
        // });


	}
));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});




}