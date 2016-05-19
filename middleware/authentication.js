var jwt = require('jsonwebtoken');
/*
var pg = require('pg').native;
var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
var client = new pg.Client(connectionString);
client.connect();
*/

var secret ='secretKeyThing'
var exports = module.exports = {};
var database = [];

exports.authenticate = function (req, res){
 
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

if(req.body.password == database[0].password){
	var token = exports.newtoken(result);
	//res.send(token);
}

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

  for(int i=0;i>databse.length;i++){


	if(req.body.password == database[i].password){
		var token = jwt.sign(req.body.userName, secret, {
						expiresIn: 86400 // expires in 24 hours
					});
					var data = {'data':token};
					res.send{data};
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

exports.newUser = function(req,res,next){
console.log(req);
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
var data = {req.body.userName:req.body.password};
database.push(data);
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