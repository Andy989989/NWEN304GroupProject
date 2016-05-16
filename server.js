var express = require('express');
var fs = require('fs');

var app = express();
var start = require('start');
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


var cors = require('cors');


var auth = require('./middleware/authentication.js');
var codes = require('./middleware/code.js');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
      clientID: codes.getClientID,
      clientSecret: codes.getClientSecret,
      callbackURL: "http://130.195.4.178:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.set('public', __dirname + '/public');
app.set('view engine', 'ejs');

//var cors = require('cors');
//var pg = require('pg').native;
//var connectionString; //= "postgres://watsonben:mypassword@depot:5432/watsonben_nodejs"; //TODO Create a new database.
//var client = new pg.Client(connectionString);
//client.connect();




app.use(bp.json());
//app.use(bp.urlencoded());
//app.use(bp.json());
//app.use(cors());
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
	//auth.beginAuth;
	console.log("get /")
	res.sendFile('/public/index.html');
});
app.get('/test',function(req,res){
	res.send("test succesfull");
});

app.get('/pages', function(req, res){
	res.send('q: ' + req.query.q);
});


//app.get('/', function(req,res){
	//res.sendFile(__dirname +'/public/index.html');
//});
//
app.get('/auth/google',
	passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
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

/*
app.listen(port, function(){
	console.log('Listening:' + port);
});*/


var LEX = require('letsencrypt-express').testing();

var lex = LEX.create({
  configDir: require('os').homedir() + '/letsencrypt/etc'
, approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration
    // Note: this is the place to check your database to get the user associated with this domain
    cb(null, {
      domains: 'https://morning-dawn-49717.herokuapp.com'
    , email: 'andy989989@gmail.com' // user@example.com
    , agreeTos: true
    });
  }
});


lex.onRequest = app;

lex.listen([port], [443, 5001], function () {
  var protocol = ('requestCert' in this) ? 'https': 'http';
  console.log("Listening at " + protocol + '://localhost:' + this.address().port);
});