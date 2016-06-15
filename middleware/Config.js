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


    return cb(null, profile);
  }));

passport.use('local',new LocalStrategy({
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
         //get the hashed password from the database using the username
	 var userName = username;
	 var password = password;

	//console.log("gets into login");
	console.log(req.body.password);
	var hash = bcrypt.hashSync(password, salt);

     var databasePassword = users.get(userName,res,function(res,returnedPassword){
	console.log("data returned from database: " + returnedPassword);

	console.log(returnedPassword);
	if(returnedPassword!=undefined){
		var errorCheck = returnedPassword.search("ERROR:"); 
		if(errorCheck != -1){
		// if this equals -1 that means there is no error
		// could change to get the currentn value of errror.
		// 409 - duplicate data

		//console.log("There was a problem");
		//res.status(409).send("User doesnt exsists in the database");
		return done(null, false,{message: returnedPassword}); // failed 
		}
	}
	//TODO error checking here
	console.log(hash);
	console.log(returnedPassword);
	if(bcrypt.compareSync(password, returnedPassword)){
		console.log("getting in hash test");

		return done(null, userName);


		// var userData= {'userName':userName};
		// var token = jwt.sign(userData, secret, {
		// 				expiresIn: 1800 // expires in 24 hours
		// 			});
		// 			//var data = {'data':token};
		// 			res.send({'token':token});
		// 			//res.render('index', {'token':token});
	}else{
		return done(null, false, {message: "Message: email not found in database"});
		//res.status(404).send("Error when checking password");
	}

	});


	}
));






}
