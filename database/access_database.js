var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var exports = module.exports = {};
//var cors = require('cors');
var pg = require('pg').native;
var connectionString = "postgres://watsonben:secure_password@depot:5432/group_2_database";
var client = new pg.Client(connectionString);
client.connect();

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());
//app.use(cors());

//=====================================
//HELPER METHODS
//=====================================

function postData(key, value){
	//client.query("update jobs set complete="+value+" where name='"+key+"'");
}

function putData(key, value){
	//client.query("insert into jobs (name, complete) values ('"+key+"',"+value+")");
}

exports.sort_it_out = function(req, res){
	var array = sanitize_url(req.url);
	if(array == null){
		//The path name was invalid
		res.status(400);
		res.send("400 BAD REQUEST!");
		return;
	}
	//TODO make /kidsssss stop breaking
	var query;
	if(array.length == 1){
		//url is just /gender
		query = client.query("select * from " + array[0]);
	} else if(array.length == 2){
		//url is /gender/some_category
		query = client.query("select * from " + array[0] + "_" + array[1]);
	} else {
		//url is /gender/some_category/item_id
		query = client.query("select * from " + array[0] + "_" + array[1] +" where id='"+array[2]+"'");
	}
	res.status(200);
	handle_query(query, res);
//	res.end();
}

function sanitize_url(url){
	var queries_removed = url.split('?');
	var leading_slash_removed = queries_removed[0].slice(1);
	var path = leading_slash_removed.split('/');
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
