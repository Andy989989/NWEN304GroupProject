var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var exports = module.exports = {};
//var cors = require('cors');
var pg = require('pg').native;
var connectionString = "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
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
	var query;
	if(array.length == 1){
		//url is just /gender
		query = client.query("select * from ?", [array[0]]);
	} else if(array.length == 2){
		//url is /gender/some_category
		query = client.query("select * from ?_?", [array[0]], [array[1]]);
	} else {
		//url is /gender/some_category/item_id
		query = client.query("select * from ?_? where id='?'", [array[0]], [array[1]], [array[2]]);
	}
	handle_query(query, res);
}

function sanitize_url(url){
	var queries_removed = url.split('?');
	var leading_slash_removed = queries_removed[0].slice(1);
	return leading_slash_removed.split('/');
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
