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

function postData(name, password){
	client.query("update users set password='"+password+"' where name='"+name+"'");
}

exports.get = function(name){
	var name = req.body.name;
	if(name == undefined || name == null){
		return "ERROR: Missing value for name.";
	}
	var password = client.query("select * from users where name='"+name+"'", function(err){
		return "ERROR: that name does not exist in the database.";
	});
	return password;
}

exports.put = function(name, password){
	var missing = check_everything_is_here(name, password);
	if(missing == null){
		client.query("insert into users (name, password) values ('"+name+"','"+password+"')", function(err){
			if(err){
				return "ERROR: User already exists.";
			}
		});
		return "Success.";
	}
	return "ERROR: Missing a valid " + missing;
}

function check_everything_is_here(name, password){
	//Check name exists and is valid
	if(name == undefined || name == null || !(ensure_only_letters_and_numbers(name))){
		return "name";
	}
	//Check password exists and is valid
	if(password == null || password == undefined){
		return "password";
	}
	return null;
}

function ensure_only_letters_and_numbers(word){
	return /^\w+$/.test(word);
}
