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

res.send("got into testAuth : authentication succesfull");

}

exports.authenticate = function (req, res,next){
	console.log("gets into auth");
 
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
				console.log("authenticated");
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}

};

exports.newToken = function (req, res){
	// if(!req.body.hasOwnProperty('userName')) {
 //    res.statusCode = 400;
 //    return res.send('Error 400');
 //  }
 console.log(req.body);
 var hash = bcrypt.hashSync(req.body.password, salt);

  for(var i=0;i<database.length;i++){


	if(hash == database[i].password){
		var token = jwt.sign({'password':req.body.password}, secret, {
						expiresIn:1800 // expires in 30 hours
					});
					var data = {'token':token};
					res.send(data)
				;
	}
  }
}



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
var hash = bcrypt.hashSync(req.body.password, salt);
//console.log(hash);


console.log("UserName to get from the database:" + userName);
console.log("password entered by the user: " + password );
console.log("Hashed password: " + hash);
var databasePassword = users.get(userName);
console.log("data returned from database: " + databasePassword);
res.status(404).send(databasePassword);

// for(var i;i<databasePassword.length;i++){
// 	console.log(databasePassword[i]);
// }

console.log(databasePassword);
//console.log(databasePassword[0]);


//var errorCheck = databasePassword.indexof("ERROR:");
// if(errorCheck > -1){
// 	// if this equals -1 that means there is no error
// 	// could change to get the currentn value of errror.

// 	// 409 - duplicate data
// 	console.log("error gettting username from the database")
// 	res.status(404).send("User Name not found in the database");
// }



//TODO error checking here


console.log(databasePassword);

if(hash == databasePassword){
	console.log("getting in hash test");
    var token = exports.newToken(req,res);
}

//console.log("hashing failed");

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
						expiresIn: 1800 // expires in 24 hours
					});
					var data = {'data':token};
					res.send(data)
				;
	}
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


var hash = bcrypt.hashSync(req.body.password, salt);
console.log("Hashed password"+ hash);

var name = req.body.userName;
var pass = req.body.password;

// TODO  put the data into the databse here
var data = {"userName":name,"password":hash};
//database.push(data);
var user = users.put(name,hash);

console.log("added the data to the database:" + user);


var errorCheck = user.search("ERROR:"); 

if(errorCheck != -1){
	// if this equals -1 that means there is no error
	// could change to get the currentn value of errror.

	// 409 - duplicate data
	console.log("There was a problem");

	res.status(409).send("User Already exsists in the database");
}

console.log(data);
res.send('user created');

}