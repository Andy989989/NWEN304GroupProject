var jwt = require('jsonwebtoken');
var express = require('express');
var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

/*
var pg = require('pg').native;
var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
var client = new pg.Client(connectionString);
client.connect();
*/

var secret ='secretKeyThing'
var exports = module.exports = {};
var database = [{'userName':'Andy','password':'test1'}];

exports.testAuth = function(req,res){

//console.log(req.user.access_token);
var data={'text':'got into testAuth : authentication succesfull','token':req.user.access_token };
res.send(data);

}

exports.authenticate = function (req, res,next){
	console.log("gets into auth");
	// TODO check to see if logged into fb first and then check to see if logged in locally
	// TODO try to figure out the timeout problem, will log out automattically after 30mins
	// TODO even if the person is still browsing/
	// possibly refreshed the token if the page has not been refreshed within 30 mins
 
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		jwt.verify(token, secret, function(error, decoded) {			
			if (error) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				// everything is fine and has been authenticated
				console.log("authenticated with logon");
				return next();
			}
		});

	} 

	else if (req.isAuthenticated()){
		console.log("authenticated with facebook");
    	return next();
  	}else{
 		// if there is no token
		// return an error
		//return res.status(403).send({ 
		//	success: false, 
		//	message: 'No token provided.'});
	
	// if gets here that means authentication failed
	 return res.status(401).send("Failed to authenticate: please login");
}

};

exports.login = function (req, res){
	 /*
		assuming this data is being sent from the client
		{userName: "andy",password:"test1"}
	 */

	  if(!req.body.hasOwnProperty('userName') || !req.body.hasOwnProperty('password')){
		res.statusCode = 400;
		return res.send('please post syntax')
	  }

	 //get the hashed password from the database using the username
	 var userName = req.body.userName;
	 var password = req.body.password;

	//console.log("gets into login");
	console.log(req.body.password);
	var hash = bcrypt.hashSync(password, salt);
	//console.log(hash);


	// console.log("UserName to get from the database:" + userName);
	// console.log("password entered by the user:" + password );
	// console.log("Hashed password:" + hash);
	// var databasePassword = users.get(userName,res,function(res,returnedPassword){
	// console.log("data returned from database: " + returnedPassword);

	// console.log(returnedPassword);
	// if(returnedPassword!=undefined){
	// 	var errorCheck = returnedPassword.search("ERROR:"); 
	// 	if(errorCheck != -1){
	// 	// if this equals -1 that means there is no error
	// 	// could change to get the currentn value of errror.
	// 	// 409 - duplicate data
	// 	console.log("There was a problem");
	// 	res.status(409).send("User doesnt exsists in the database");
	// 	}
	// }
	// //TODO error checking here
	// console.log(hash);
	// console.log(returnedPassword);
	// if(bcrypt.compareSync(password, returnedPassword)){
	// 	console.log("getting in hash test");
	// 	var userData= {'userName':userName};
	// 	var token = jwt.sign(userData, secret, {
	// 					expiresIn: 1800 // expires in 24 hours
	// 				});
	// 				//var data = {'data':token};
	// 				res.send({'token':token});
	// 				//res.render('index', {'token':token});
	// }else{
	// 	res.status(404).send("Error when checking password");
	// }
	// });
  	passport.authenticate('local', function(err, username, info) {
    	if (err) {
      		return next(err);
    	}    
    	if (!username) {
      	// print out error .message at the other end
      	return res.render('/login');
    	}
    // If everything's OK
    	req.logIn(username, function(err) {
      	if (err) {
        	req.session.messages = "Error";
        	return next(err);
      	}
      	// Set the message
      	req.session.messages = "successful login";

      	// Set the displayName 
      	var data = { userName : username };
      	console.log(req.user.passport);
      	console.log(req.user.passport.user);
      	//return res.render('/index');
      	return res.render('index', {data:data});
    });    
  })(req, res, next);



}



exports.logout = function (req, res){
if(!req.body.hasOwnProperty('token')) {
    res.statusCode = 400;
    return res.send('Error 400');
  }

}

exports.newToken = function (req, res){
	if(!req.body.hasOwnProperty('userName')) {
    res.statusCode = 400;
    return res.send('Error 400');
  }

  //for(var i=0;i>databse.length;i++){


	if(req.body.password == database[0].password){
		var token = jwt.sign(req.body.userName, secret, {
						expiresIn: 1800 // expires in 30 mins
					});
					var data = {'data':token};
					res.send(data)
				;
	}


  //}


/*
  	//find username
  	var query = client.query('SELECT * from logins where userName = $1', [req.body.userName]);
  

  query.on('error', function(error){
	  	res.statusCode = 400;
	    res.send('username does not exist');
	});

 query.on('end', function(result){
	  	if(result.rowCount === 0){
	  		res.statusCode = 400;
	    	res.send('username does not exist');
	  	}

	  	var hash = result.hash;
		if(hash === req.body.passowrd.hash()){

		// if user is found and password is right
				// create a token
				var token = jwt.sign(user, secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				var data = {'data':token};
				res.send{data};


		}else{
		// failed 
		res.statusCode = 400;
	    res.send('username does not exist');
    	}

	  });

	  */
}

exports.newUser = function(req,res,next){
console.log(req.body);
console.log("Creating a new User");
/*
assuming this data is being sent from the client
{userName: "test",password:"test"}
*/
//var query = client.query('SELECT * from logins where userName = $1', [req.body.userName]);

// error testing
if(!req.body.hasOwnProperty('userName') || !req.body.hasOwnProperty('password') ){
		res.statusCode = 400;
    	return res.send('Error 400');
}
var name = req.body.userName;
var pass = req.body.password;


var hash = bcrypt.hashSync(pass, salt);
console.log("Hashed password"+ hash);



// TODO  put the data into the databse here
//var data = {"userName":name,"password":hash};
//database.push(data);
var user = users.put(name,hash);

console.log("added the data to the database:"+name+":"+pass);

if(user!=undefined){
	var errorCheck = user.search("ERROR:"); 
	if(errorCheck != -1){
	// if this equals -1 that means there is no error
	// could change to get the currentn value of errror.

	// 409 - duplicate data
	console.log("There was a problem");
	res.status(409).send("User Already exsists in the database");
	}
}



//console.log(data);
res.send('user created');

}