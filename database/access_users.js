var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var exports = module.exports = {};
//var cors = require('cors');
var pg = require('pg').native;
var connectionString = "postgres://rybgtwaenxzadm:Ia_YiG0ih5FblKPT71enEMI4z-@ec2-54-243-236-70.compute-1.amazonaws.com:5432/d6map6onq4uhlg";
var client = new pg.Client(connectionString);
client.connect();

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());
//app.use(cors());

function postData(name, password){
	client.query("update users set password='"+password+"' where name='"+name+"'");
}

exports.put = function(req, res){
	var missing = check_everything_is_here(req.body.name, req.body.password);
	if(missing == null){
		//Case: The request body is valid
		var name = req.body.name;
		var password = req.body.password;
		var exists = check_if_user_already_exists(name);
		if(exists){
			res.status(409).send("Conflict! User already exists.");
			return;
		}
		//Case: There is no entry in 'users' under 'name'
		client.query("insert into users (name, password) values ('"+name+"','"+password+"')");
		res.status(201).end();
	} else {
		res.status(400).send("Missing a value for '" + missing + "'");
	}
}

function check_everything_is_here(name, password){
	//Check name exists and is valid
	if(name == undefined || name == null || !(/^\w+$/.test(name))){
		return "name";
	}
	//Check password exists and is valid
	if(password == null || password == undefined){
		return "password";
	}
	return null;
}

function check_if_user_already_exists(name){
	//TODO this doesn't work properly.
	var results = [];
	var query = client.query("select * from users where name='"+name+"'", function(err){
			if(err){
			res.status(404).send("Users table not longer exists!");
			}
			});
	query.on('row', function(row){
			results.push(row);
			});
	return results.length > 0;
}

function sanitize_url(url){
	var queries_removed = url.split('?');
	var leading_slash_removed = queries_removed[0].slice(1);
	var path = leading_slash_removed.split('/');
	if(path[path.length - 1] == ""){
		path = path.slice(0,-1);
	}
	path = ensure_only_letters_and_numbers(path);
	return path;
}

function ensure_only_letters_and_numbers(path){
	for(var i = 0; i < path.length; i++){
		if(!(/^\w+$/.test(path[i])) || path[i] == undefined){
			return null;
		}
	}
	return path;
}

function handle_query(query, res){
	var query_results = [];
	query.on('row', function(row){
			query_results.push(row);
			});
	query.on('end', function(){
			res.json(query_results);
			});
}
