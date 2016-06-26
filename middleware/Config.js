// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);



module.exports = function(passport) {
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
//=====================================
//AUTHENTICATION SETUP
//=====================================
passport.use('facebook',new FacebookStrategy({
    clientID: 261460150870678,//process.env.CLIENT_ID,
    clientSecret: '54da0a9f6352a8adf21c359a545b2257',//process.env.CLIENT_SECRET,
    callbackURL: 'https://morning-dawn-49717.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
	//console.log(profile.id);
	//console.log(profile.displayName);
    return cb(null, profile);
  }));


passport.use('local', new LocalStrategy({
	 username : 'username',
     password : 'password',
	passReqToCallBack : true
}, function(username, password, done) {
	process.nextTick(function() {
		var databasePassword = users.get(username,null,function(res,returnedPassword){
			if(bcrypt.compareSync(password, returnedPassword)){
				return done(null, username);
			}else{
				return done(null, false, {message: "Message: username not found in database"});

			}

		});

		if(databasePassword == "ERROR: Missing valid value for name."){
			return done(null, false, {message: "Message: username not found in database"});			
		}
	});			
}));

}
