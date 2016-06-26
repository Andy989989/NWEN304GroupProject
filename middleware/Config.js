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
   //passReqToCallback : true,


  },
  function(accessToken, refreshToken, profile, cb) {

  	// need to check if fb data is in the data base. if not add it

 	//  	//var user = users.put(name,hash);
	// console.log(" FB data to the database:"+name+":"+pass);

	// if(user!=undefined){
	// var errorCheck = user.search("ERROR:"); 
	// if(errorCheck != -1){
	// // if this equals -1 that means there is no error
	// // could change to get the currentn value of errror.

	// // 409 - duplicate data
	// console.log("There was a problem");
	// res.status(409).send("User Already exsists in the database");
	// }
	//}
	console.log(profile.id);
	console.log(profile.displayName);

    return cb(null, profile);
  }));


passport.use('local', new LocalStrategy({
	 username : 'username',
     password : 'password',
	passReqToCallBack : true
}, function(username, password, done) {
	console.log("getting into the local start");

	process.nextTick(function() {

		console.log(password);
		console.log(username);

		var databasePassword = users.get(username,null,function(res,returnedPassword){
			console.log("data returned from database: " + returnedPassword);
			//console.log(req.body.password);
			console.log(password.toString());
			if(bcrypt.compareSync(password, returnedPassword)){
				console.log("getting in hash test");
				return done(null, username);
			}else{
				return done(null, false, {message: "Message: username not found in database"});

			}

		});

		if(databasePassword == "ERROR: Missing valid value for name."){
			return done(null, false, {message: "Message: username not found in database"});			
		}

		//return done(null, false, {message: "Message: username not found in database"});
		//console.log("database lookup failed : "+databasePassword);

	});			//res.status(404).send("Error when checking password");
		//console.log(hash);
		//console.log(returnedPassword);
}));

}
