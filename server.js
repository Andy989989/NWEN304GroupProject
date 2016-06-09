var express = require('express');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var user = require('./middleware/User.js');
var auth = require('./middleware/authentication.js');
var products = require('./database/access_products.js');
var users = require('./database/access_users.js');
//var cors = require('cors');
//var pg = require('pg').native;
var codes = require('./middleware/code.js');

// this is for authentication
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
//var loggedOn = require('connect-ensure-login');
var geoip = require('geoip-lite');

var bp = require('body-parser');
var jobsFilename = './jobs.json';

// these are used in the authentication
//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

//use for accesing local files
app.use(express.static('/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(bp.urlencoded({extended:true}));
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



app.set('public', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(bp.json());

//=====================================
//AUTHENTICATION SETUP
//=====================================
passport.use(new Strategy({
    clientID: 261460150870678,//process.env.CLIENT_ID,
    clientSecret: '54da0a9f6352a8adf21c359a545b2257',//process.env.CLIENT_SECRET,
    callbackURL: 'https://morning-dawn-49717.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//=====================================
//GET METHODS
//=====================================
// app.get('*',function(req,res,next){
//   if(req.headers['x-forwarded-proto']!='https')//&&process.env.NODE_ENV === 'production')
//     res.redirect('https://'+req.hostname+req.url)
//   else
//     next() 
// });


app.get('/', function(req,res){
	res.render('index');
});

app.get('/search*', products.search);
app.get('/men*', products.get_me_something);
app.get('/women*', products.get_me_something);
app.get('/kids*', products.get_me_something);

app.get('/pages', function(req, res){
	res.send('q: ' + req.query.q);
});

app.get('/login', function(req, res){
    res.render('login')
});

app.get('/register', function (req, res) {
    res.render('register')
});

app.get('/aboutus', function (req, res) {
    res.render('aboutus')
});

app.get('getRecommendations',function (req, res) {
  var ip = req.ip;
  var geo = geoip.lookup(ip);
  console.log(geo);
});

//=====================================
//PUT METHODS
//=====================================

app.put('/', function(req,res){

});

app.put('/login', users.put);

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


//check to see if loggedon with fb and then locally
app.all('/auth/*',auth.authenticate);

app.post('/auth/testAuth',auth.testAuth);

app.post('/newUser',auth.newUser);

// TODO check to see if a person is already logged onto facebook
app.post('/login', auth.login);


// TODO have a database of vaild tokens
app.post('/auth/logout',auth.logout);

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.data);
    console.log(req);
          var data = {'data':req.user.access_token};
          //'res.render('index', {data:data});

          res.render('index', {data:data});
          console.log(req.user.access_token);
  });

app.get('/profile',
//  loggedOn.ensureLoggedIn(),
  function(req, res){
  res.render('profile', { user: req.user });
});



app.get( '/auth/facebook/logout',function( request, response ) {
      request.logout();
      response.send( 'Logged out!' );
      //res.redirect('/');
  });

function checkAuth(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  else{
    //return next();  

    res.status(401).send("Failed to authenticate: please login")
  }
}


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

app.get('*', function(req, res){
    res.status(400).send("Sorry, that page doesn't exist.");
});
