var jwt = require('jsonwebtoken');
//var pg = require('pg').native;
//var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
//var client = new pg.Client(connectionString);
//client.connect();
var secret ='secretKeyThing'
var exports = module.exports = {};

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
	{userName: "test",password:"test"}
*/
  if(!req.body.hasOwnProperty('userName') || !req.body.hasOwnProperty('password')){
    res.statusCode = 400;
    return res.send('please post syntax')
  }

 //get the hashed password from the database using the username
 //query = client.query('SELECT * from logins where userName = $1', [req.body.userName]);



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


};


exports.newToken = function (req, res){
  	//find username
  	query = client.query('SELECT * from logins where userName = $1', [req.body.userName]);
  

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



};