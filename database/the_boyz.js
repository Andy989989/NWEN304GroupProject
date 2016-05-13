var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');

//var cors = require('cors');
var pg = require('pg').native;
var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
var client = new pg.Client(connectionString);
client.connect();

app.use(bp.urlencoded());
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

function sort_it_out(req, res){
	var url = req.url.split('?');
	var array = url[0].split('/');
	var array_max_index = array.length - 1;
	var query;
	if(array_max_index == 0){
		//url is just /men
		query = client.query("select * from men");
	} else if(array_max_index == 1){
		//url is /men/some_category
		query = client.query("select * from mens_"+array[1]);
	 else{
		//url is /men/some_category/item_id
		query = client.query("select * from mens_"+array[1]+" where id='"+array[2]+"'");
	}
	handle_query_response(query, res);
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
