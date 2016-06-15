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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// METHODS FOR DEALING WITH THE USERS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/* Returns all occurrences (should only be one, or zero) of a given name in the database.
 * If the query is successful (ie. the user does exist in the database) then this method
 * returns the password that is associated with that name, otherwise it returns an error
 * message, starting with 'ERROR: ', and followed by a short sentence describing the nature
 * of the error.
 */
exports.get = function(name, res, callback){
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		return "ERROR: Missing valid value for name.";
	}
	var password = client.query("select password from users where name='"+name+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			callback(res, rows.rows[0].password);
			});
}

/* Adds a user to the database. If the adding is successful (ie. the given name and password
 * were valid and no errors were thrown by the database (that is, the user did not already
 * exist)) then this method returns a 'Success.' message, otherwise it returns an error
 * message, starting with 'ERROR: ', and followed by a short sentence describing the nature
 * of the error.
 */
exports.put = function(name, password){
	var missing = check_everything_is_here(name, password);
	if(missing == null){
		client.query("insert into users (name, password) values ('"+name+"','"+password+"')", function(err){
				if(err){
				return err;
				}
				});
	}
	else {return missing;}
}

/* Updates the password associated with a user's name. If the update is successful (ie. the
 * given name and password were valid and no errors were thrown by the database) then this
 * method returns nothing, otherwise it returns an error message, starting with 'ERROR: ',
 * and followed by a short sentence describing the nature of the error.
 */
exports.update_password = function(name, new_password){
	var missing = check_everything_is_here(name, new_password);
	if(missing != null){
		return missing;
	}
	client.query("update users set password='"+new_password+"' where name='"+name+"'", function(err){
			if(err){
			return err;
			}
			});
}

/* Gets an array of suggested items that the user should purchase. This takes a userName, a country (loc),
 * and a callback method. This method gets the previous item from the database, and passes everything to
 * the get_suggestion_based_on_previous_item method, which carries on the procedure. This is the only way
 * I could make this appen synchronously in Node.js. As always, this throws helpful error messages when it
 * fails.
 */
exports.get_recommendations = function(name, loc, callback){
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		return "ERROR: Missing a valid value for name.";
	}
	if(loc == null || loc == undefined || !ensure_only_letters_and_numbers(loc)){
		return "ERROR: Missing a valid value for loc.";
	}
	client.query("select previous_item_id from users where name='"+name+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			var prev = -1;
			if(rows.length != 0){
			prev = rows.rows[0].previous_item_id;
			}
			return get_suggestion_based_on_previous_item(prev, loc, callback);
			});
}

/* This method queries the databsase to find all entries with the same type as the previous purchase (prev),
 * and then passes the array of products, the location, and the callack, to get_suggestion_based_on_weather.
 * If something goes wrong, a descriptive error message is returned, however, if everything goes nicely,
 * nothing is returned, and instead, the callback method is called (by get_suggestion_based_on_weather).
 */
function get_suggestion_based_on_previous_item(prev, loc, callback){
	var types = {};
	if(prev == -1){
		//Ignore the previous item and just get the information from the location
		return get_suggestion_based_on_weather(loc, null, callback);
	}
	client.query("select type from products where id='"+prev+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			if(rows.length!=0){
			var type = rows.rows[0].type;
			client.query("select id from products where type='"+type+"'", function(e, r, f){
					if(e || r.rows.length==0){
					return e;
					}
					return get_suggestion_based_on_weather(loc, r.rows, callback);
					});
			}
			});
}

/* This gets all of the products in the database with the location of 'loc', adds them to the arry of
 * suggestions, and passes the now-complete array to the callback method. If something goes wrong, a
 * descriptive error is thrown.
 */
function get_suggestion_based_on_weather(loc, suggestions, callback){
	if(suggestions == null){
		suggestions = [];
	}
	client.query("select id from products where location='"+loc+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			for(var i in rows.rows){
			suggestions.push(rows.rows[i]);
			}
			callback(suggestions);
			});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// METHODS FOR DEALING WITH THE KART
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/* Initializes a kart associated with a user's name by storing the id of an item. If the add
 * is successful (ie. the given name and id were valid and no errors were thrown by the
 * database) then this method returns nothing, otherwise it returns an error object.
 */
exports.add_to_kart = function(name, item_id){
	var missing = check_for_kart(name, item_id);
	if(missing!=null){
		return missing;
	}
	client.query("insert into karts (name, item_ids[0]) values ('"+name+"', "+item_id+")", function(err){
			if(err){
			return err;
			}
			});
}

/* Updates the kart associated with a user's name by adding the id of an item. If the update
 * is successful (ie. the given name and id were valid and no errors were thrown by the
 * database) then this method returns nothing, otherwise it returns an error object.
 */
exports.update_kart = function(name, item_id){
	var missing = check_for_kart(name, item_id);
	if(missing != null){
		return missing;
	}
	client.query("update karts set item_ids = array_append(item_ids, "+item_id+") where name='"+name +"'", function(err){
			if(err){
			return err;
			}
			});
}

/* Returns the items in the kart associated with a user's name. If the query is successful
 * (ie. the given name was valid and no errors were thrown by the database) then this method
 * returns directly to the client via the response object 'res', sending a 200-OK status code
 * and returning the item numbers of the kart. Otherwise it returns an error code and message,
 * detailing what went wrong.
 */
exports.get_kart = function(res, name){
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		res.status(400).send("Missing valid value for name.");
		return;
	}
	var ids = [];
	var query = client.query("select * from karts where name='"+name+"'", function(err){
			if(err){
			res.status(404).send("Could not get items from kart.");
			return;
			}
			});
	query.on('row', function(row){
			ids.push(JSON.stringify(row));
			});
	query.on('end', function(){
			res.status(200);
			res.render('display', {results: ids});
			});
}

exports.buy_kart = function(name){
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		return "ERROR: Missing a valid value for name.";
	}
	client.query("select item_ids from karts where name='"+name+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			if(rows.length == 0){
			return;
			}
			var ids = rows[0];
			client.query("update users set previous_items_ids = array_cat(previous_items_ids, "+ids+") where name='"+name+"'", function(err){
					if(err){
					return err;
					}
					});
			});
	delete_entire_kart(name);
}

exports.delete_entire_kart = function(name){
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		return "ERROR: Missing a valid value for name.";
	}
	client.query("delete from karts where name='"+name+"'", function(err){
			if(err){
			return err;
			}
			});
}

exports.delete_from_kart = function(name, item_id){
	var missing = check_for_kart(name, item_id);
	if(missing != null){
		return missing;
	}
	var query = client.query("update karts set item_ids = array_remove(item_ids,"+item_id+") where name='"+name+"'", function(err, rows, fields){
			if(err){
			return err;
			}
			});
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

/* Ensures that the given name and id are valid (ie. neither are null or undefined, and the
 * name contains only letters, numbers, and underscores (this prevents SQL injections), and
 * the id is made up of only numbers, and is not and empty string). This returns an error
 * message of the form 'ERROR: ' followed by a short description of the error, if one is
 * thrown. Otherwise, it returns null to signal success.
 */
function check_for_kart(name, id){
	//Check for valid name.
	if(name == undefined || name == null || !ensure_only_letters_and_numbers(name)){
		return "ERROR: invalid name.";
	}
	//Check for valid id number.
	if(id == undefined || id == null || !/^[0-9]+$/.test(id)){
		return "ERROR: invalid password.";
	}
	//Both are valid.
	return null;
}

/* This methods checks whether a given word contains anything that is not a letter, number,
 * or underscore, returning a boolean of whether it is valid (does not contain anything else)
 * or not. This is useful for preventing SQL injection attacks on the database.
 */
function ensure_only_letters_and_numbers(word){
	return /^\w+$/.test(word);
}
