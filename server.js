var express = require('express');
var fs = require('fs');
var cors = require('cors');

var app = express();
//var start = require('start');
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var jobsFilename = './jobs.json';

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

//use for accesing local files
app.use(express.static('/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, XHR');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

var auth = require('./middleware/authentication.js');
var codes = require('./middleware/code.js');

app.set('public', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(bp.json());
app.use(cors());

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
	console.log("get /")
	res.sendFile('/public/index.html');
});

app.get('/pages', function(req, res){
	res.send('q: ' + req.query.q);
});
//=====================================
//PUT METHODS
//=====================================

app.put('/', function(req,res){

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
  
});

//=====================================
//AUTHENTICATION METHODS
//=====================================


app.listen(port, function(){
	console.log('Listening:' + port);
});
// uncommment this for a secure server with a self sign cert
// https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server/

/*
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);
*/
