var express = require('express');
var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var secret ='secretKeyThing'
var exports = module.exports = {};

exports.testAuth = function(req,res){
	var data={'text':'got into testAuth : authentication succesfull','token':req.user.access_token };
	res.send(data);
}

exports.authenticate = function (req, res,next){
	if (req.isAuthenticated()){
		return next();
	}else{
		return res.status(401).send("Failed to authenticate: please login");
	}
}

exports.newUser = function(req,res,next){

	if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') ){
		res.statusCode = 400;
		return res.send('Error 400');
	}
	var name = req.body.username;
	var pass = req.body.password;
	var hash = bcrypt.hashSync(pass, salt);
	console.log("Hashed password"+ hash);

	var user = users.put(name,hash);
	process.nextTick(function(){
		if(user!=undefined){
			console.log(user);
			if(user[0].severity == 'ERROR'){
				res.status(409).send("User Already exsists in the database");
		}
	}
			res.send('user created');
		});
}
