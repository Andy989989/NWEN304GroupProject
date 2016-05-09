var express = require('express');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var jobsFilename = './jobs.json';
//var cors = require('cors');
//var pg = require('pg').native;
//var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
//var client = new pg.Client(connectionString);
//client.connect();


//use for accesing local files
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(bp.urlencoded());
app.use(bp.json());
//app.use(cors());
app.listen(port, function(){
	console.log('Listening:');
});

//=====================================
//HELPER METHODS
//=====================================

function postData(key, value){
	//client.query("update jobs set complete="+value+" where name='"+key+"'");
}

function putData(key, value){
	//client.query("insert into jobs (name, complete) values ('"+key+"',"+value+")");
}

//=====================================
//GET METHODS
//=====================================

app.get('/', function(req,res){
	/*
	var query = client.query("select * from items");
	var results = '{';
	query.on('row', function(row){
		console.log(row);
// TODO add entry to 'results':
//		results = results + JSON.stringify(row.name)+":"+JSON.stringify(row.complete)+",";
	});

	query.on('end', function(){
//TODO edit 'results' into valid json
//		results = results.slice(0,-1)+"}";
		res.json(results);
	});
*/
res.sendFile('/public/index.html');
});

//=====================================
//PUT METHODS
//=====================================

app.put('/', function(req,res){
	/*
	if(req.body.item==undefined){
		//Return a 'bad request' code
		res.statusCode = 400;
	} else{
		putData(req.body.item, false);
		res.statusCode = 200;
	}
	res.end();
	*/
});

//=====================================
//POST METHODS
//=====================================

app.post('/', function(req,res){
	if(req.body.item==undefined){

		res.statusCode = 400;
	} else{
		postData(req.body.item, true);
		res.statusCode = 200;
	}
	res.end();
});

//=====================================
//DELETE METHODS
//=====================================

app.delete('/', function(req,res){
//	client.query("delete from cart where name='"+req.body.item+"'");
	res.statusCode = 200;
	res.end();
});

