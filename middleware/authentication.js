var jwt = require('jsonwebtoken');
var express = require('express');
var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;





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

	if (req.isAuthenticated()){
		console.log("authenticated");
    	return next();
  	}else{
	 return res.status(401).send("Failed to authenticate: please login");
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
if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') ){
		res.statusCode = 400;
    	return res.send('Error 400');
}
var name = req.body.username;
var pass = req.body.password;


var hash = bcrypt.hashSync(pass, salt);
console.log("Hashed password"+ hash);



// TODO  put the data into the databse here
//var data = {"userName":name,"password":hash};
//database.push(data);
var user = users.put(name,hash);

console.log("added the data to the database:"+name+":"+pass);
console.log(user);
console.log("+++++++++++++++++");
if(user!=undefined || user[0].severity == 'ERROR'){
	// if this equals -1 that means there is no error
	// could change to get the currentn value of errror.

	// 409 - duplicate data
	console.log("There was a problem");
	res.status(409).send("User Already exsists in the database");
}

//console.log(data);
res.send('user created');

}
