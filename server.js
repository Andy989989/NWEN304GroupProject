var express = require('express');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var jobsFilename = './jobs.json';
var cors = require('cors');
var pg = require('pg').native;
var connectionString = "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs";
var client = new pg.Client(connectionString);
client.connect();

app.use(bp.urlencoded());
app.use(bp.json());
app.use(cors());
app.listen(port, function(){
	console.log('Listening:');
});

//=====================================
//HELPER METHODS
//=====================================

function postData(key, value){
	client.query("update jobs set complete="+value+" where name='"+key+"'");
}

function putData(key, value){
	client.query("insert into jobs (name, complete) values ('"+key+"',"+value+")");
}

//=====================================
//GET METHODS
//=====================================

app.get('/jobs/complete', function(req,res){
	var query = client.query("select * from jobs where complete=true");
	var results = '{';
	query.on('row', function(row){
		console.log(row);
		results = results + JSON.stringify(row.name)+":"+JSON.stringify(row.complete)+",";
	});

	query.on('end', function(){
		results = results.slice(0,-1)+"}";
		res.json(results);
	});
});

app.get('/jobs/incomplete', function(req,res){
	var query = client.query("select * from jobs where complete=false");
	var results = '{';
	query.on('row', function(row){
		console.log(row);
		results = results + JSON.stringify(row.name)+":"+JSON.stringify(row.complete)+",";
	});

	query.on('end', function(){
		results = results.slice(0,-1)+"}";
		res.json(results);
	});
});

app.get('/jobs', function(req,res){
	var query = client.query("select * from jobs");
	var results = '{';
	query.on('row', function(row){
		console.log(row);
		results = results + JSON.stringify(row.name)+":"+JSON.stringify(row.complete)+",";
	});

	query.on('end', function(){
		results = results.slice(0,-1)+"}";
		res.json(results);
	});
});

//=====================================
//PUT METHODS
//=====================================

app.put('/jobs/incomplete', function(req,res){
	if(req.body.name==undefined){
		res.statusCode = 400;
	} else{
		putData(req.body.name, false);
		res.statusCode = 200;
	}
	res.end();
});

//=====================================
//POST METHODS
//=====================================

app.post('/jobs/incomplete', function(req,res){
	if(req.body.name==undefined){
		res.statusCode = 400;
	} else{
		postData(req.body.name, false);
		res.statusCode = 200;
	}
	res.end();
});

app.post('/jobs/complete', function(req,res){
	if(req.body.name==undefined){
		res.statusCode = 400;
	} else{
		postData(req.body.name, true);
		res.statusCode = 200;
	}
	res.end();
});

//=====================================
//DELETE METHODS
//=====================================

app.delete('/jobs*', function(req,res){
	client.query("delete from jobs where name='"+req.body.name+"'");
	res.statusCode = 200;
	res.end();
});
