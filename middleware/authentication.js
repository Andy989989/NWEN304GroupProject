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
 // var query = client.query('SELECT * from logins where userName = $1', [req.body.userName]);

console.log("gets into login");
console.log(req.body.password);
var hash = bcrypt.hashSync(req.body.password, salt);
console.log(hash);
console.log(database[0].password);

if(hash == database[0].password){
	console.log("getting in hash test");
    var token = exports.newToken(req,res);
}

// bcrypt.compareSync(database[0].password, hash, function(err, res) {
//     // res === true
    
// });

//console.log("hashing failed");

/*
 query.on('row', function(result){
	 // verify hasshed passed word and then if it is correct then create token and send it back
	var hash = result.hash;
	if(hash === req.body.passowrd.hash()){
	//success
	// TODO send token to client
	var token = exports.newtoken(result);
	res.send(token);
	}else{
		// failed 
		res.statusCode = 401;     
      	res.send('wrong username or password');
    }
}

});

query.on('end', function(result){
    if(result.rowCount === 0){
      res.statusCode = 401;     
      res.send('wrong username or password');
    }
});
*/

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


var hash = bcrypt.hashSync(req.body.password, salt);
console.log("Hashed password"+ hash);

var name = req.body.userName;
var pass = req.body.password;
var data = {"userName":name,"password":hash};
database.push(data);
console.log(data);
res.send('user created');



// hash the pasword here then add to database
// TODO find a way to has stuff
// var hash = /*get hashed password using req.body.password*/
/*
query = client.query('Insert into login(userName, password) values($1, $2)', [req.body.userName, hash]);

query.on('error', function(error){
	  	res.statusCode = 400;
	    res.send('username already exists, please pick another');
});

 query.on('end', function(result){
	  	if(result.rowCount === 0){
	  		res.statusCode = 400;
	    	res.send('Error: username already exists');	
	  	}

	  	//succesfull in adding, we should then add the rest of the details into the database
	  	// in a another table with a foreign key of the logins table
	  	res.send('user created');
 });
*/
}