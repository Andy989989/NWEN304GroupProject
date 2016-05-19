var fs = require('fs');
//var pg = require('pg').native;
//var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
//var client = new pg.Client(connectionString);
//client.connect();



var exports = module.exports = {};



exports.newUser = function(req,res,next){
console.log(req);
console.log("Creating a new User");
/*
assuming this data is being sent from the client
{userName: "test",password:"test"}
*/

// error testing
if(!req.body.hasOwnProperty('userName') || !req.body.hasOwnProperty('password') ){
		res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
}


// hash the pasword here then add to database
// TODO find a way to has stuff
// var hash = /*get hashed password using req.body.password*/
//query = client.query('Insert into login(userName, password) values($1, $2)', [req.body.userName, hash]);

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

}