var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var exports = module.exports = {};
var pg = require('pg').native;
var connectionString = "postgres://rybgtwaenxzadm:Ia_YiG0ih5FblKPT71enEMI4z-@ec2-54-243-236-70.compute-1.amazonaws.com:5432/d6map6onq4uhlg";
var client = new pg.Client(connectionString);
client.connect();

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

/* Returns all occurrences (should only be one, or zero) of a given name in the database.
 * If the query is successful (ie. the user does exist in the database) then this method
 * returns the password that is associated with that name, otherwise it returns an error
 * message, starting with 'ERROR: ', and followed by a short sentence describing the nature
 * of the error.
 */
exports.get = function(name){
	var name = req.body.name;
	if(name == undefined || name == null){
		return "ERROR: Missing value for name.";
	}
	var password = client.query("select * from users where name='"+name+"'", function(err){
		if(err){ //User does not exist and therefore has no password to get.
			return "ERROR: that name does not exist in the database.";
		}
	});
	return password;
}

/* Adds a user to the database. If the adding is successful (ie. the given name and password
 * were valid and no errors were thrown by the database (that is, the user did not already
 * exist)) then this method returns a 'Success.' message, otherwise it returns an error
 * message, starting with 'ERROR: ', and followed by a short sentence describing the nature
 * of the error.
 */
exports.put = function(name, password){
	var missing = check_everything_is_here(name, password);
	if(missing == null){ //Name and password are valid.
		client.query("insert into users (name, password) values ('"+name+"','"+password+"')", function(err){
			if(err){ //There is already a user with that name in the database.
				return "ERROR: User already exists.";
			}
		});
		return "Success.";
	}
	return missing;
}

/* Updates the password associated with a user's name. If the update is successful (ie. the
 * given name and password were valid and no errors were thrown by the database) then this
 * method returns a 'Success.' message, otherwise it returns an error message, starting with
 * 'ERROR: ', and followed by a short sentence describing the nature of the error.
 */
exports.update_password = function(name, new_password){
	var missing = check_everything_is_here(name, new_password);
	if(missing != null){
		return missing;
	}
	client.query("update users set password='"+new_password+"' where name='"+name+"'", function(err){
		if(err){ //User does not exist, and therefore has no password to update.
			return "ERROR: that name is not in the database.";
		}
	});
	return "Success."
}

/*
 * =====================================================
 * HELPER METHODS
 * =====================================================
 */

/* Ensures that the given name and password are valid (ie. neither are null or undefined,
 * and the name contains only letters, numbers, and underscores (this prevents SQL
 * injections)). This returns an error message of the form 'ERROR: ' followed by a short
 * description of the error, if one is thrown. Otherwise, it returns null to signal success.
 */
function check_everything_is_here(name, password){
	//Check name exists and is valid
	if(name == undefined || name == null || !(ensure_only_letters_and_numbers(name))){
		return "ERROR: Missing a valid name.";
	}
	//Check password exists and is valid
	if(password == null || password == undefined){
		return "ERROR: Missing a valid password.";
	}
	// #winning
	return null;
}

/* This methods checks whether a given word contains anything that is not a letter, number,
 * or underscore, returning a boolean of whether it is valid (does not contain anything else)
 * or not. This is useful for preventing SQL injection attacks on the database.
 */
function ensure_only_letters_and_numbers(word){
	return /^\w+$/.test(word);
}
