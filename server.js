var express = require('express');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var user = require('./middleware/User.js');
var connect = require('connect-ensure-login');

var products = require('./database/access_products.js');
var users = require('./database/access_users.js');
var passport = require('passport');
//var cors = require('cors');
//var pg = require('pg').native;
var codes = require('./middleware/code.js');
//var users = require('../database/access_users.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

// this is for authentication

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

<<<<<<< HEAD
// this is the passprt authentication methods
require('./middleware/Config.js')(passport);
var auth = require('./middleware/authentication.js');

=======
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
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502

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
<<<<<<< HEAD
	res.render('index',{'user':req.user});
});
=======
		res.render('index');
		});
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502

app.get('/search*', products.search);
app.get('/men*', products.get_me_something);
app.get('/women*', products.get_me_something);
app.get('/kids*', products.get_me_something);

app.get('/login', function(req, res){
<<<<<<< HEAD
  res.render('login',{'user':req.user})
});

app.get('/logout', function(req, res){
  req.logout();
  req.user = undefined;
  console.log(req.user);
  res.render('index',{'user':req.user});
});

app.get('/register', function (req, res) {
  res.render('register',{'user':req.user})
});

app.get('/aboutus', function (req, res) {
  res.render('aboutus',{'user':req.user})
});

app.get('/local', function (req, res) {
  res.render('local',{user:req.user})
});

app.get('/getRecommendations',function (req, res) {
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
    var list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }



  //var ip = req.ip;
  var geo = geoip.lookup(ipAddr);
  console.log(geo);
  res.send({'geo':geo,'ip':ipAddr});
});
=======
		res.render('login')
		});

app.get('/register', function (req, res) {
		res.render('register')
		});

app.get('/aboutus', function (req, res) {
		res.render('aboutus')
		});

app.get('/getRecommendations',function (req, res) {
		var ipAddr = req.headers["x-forwarded-for"];
		if (ipAddr){
		var list = ipAddr.split(",");
		ipAddr = list[list.length-1];
		} else {
		ipAddr = req.connection.remoteAddress;
		}
		var geo = geoip.lookup(ipAddr);
		var country = geo.city!=undefined && geo.city!='' && geo.city!=null ? geo.city : geo.country;
		var name = 'gareth'; //TODO change this, it's temporary
		users.get_recommendations(name, country, function(results){
				res.send({recommendation: results});
				});
		});
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502

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
 app.all('/auth/*',checkAuth);
//app.all('/auth/*', connect.ensureLoggedIn();

				app.post('/auth/testAuth',auth.testAuth);

				app.post('/newUser',auth.newUser);


app.post('/login', function(req,res, next){
    passport.authenticate('local',{ failureRedirect: '/login'  },function(err,user,info){
      console.log("gets into loacl auth");
      console.log(user);

        if(user!=false){
            console.log("user exists");
            console.log("username :" + user);
            req.session.username = "'" + user + "'";
            req.session.save();
            //return res.redirect('/');
        }
        else{
            console.log("Login unsucessful");
            //res.send({redirect: '/'});
            //res.status(401).send(user);
        }


        req.logIn(user, function(err) {
          if (err) {
            req.session.messages = "Error";
            console.log('login Error');
            return res.status(401).send(user +" :   " +err);

          }
          req.session.messages = "Login successfully";
          var data = { 'name' : user };
          req.session.passport.user = data;
          console.log(data +" : " +user);

          console.log('login successful');
          res.render('index',{'user':req.user});
      });  
    })(req,res,next);
});

// TODO have a database of vaild tokens
app.post('/auth/logout',auth.logout);

app.get('/login/facebook',
passport.authenticate('facebook'));

app.get('/login/facebook/return',
<<<<<<< HEAD
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    //console.log(req.data);
    console.log(req.user);
    var data = {'data':req.user.accessToken};
          //'res.render('index', {data:data});

          res.render('index', {data:data});
          //console.log(req.user.accessToken);
        });

app.get('/profile',
//  connect.ensureLoggedIn(),
function(req, res){
  res.render('profile', { user: req.user });
=======
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
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502
});



app.get( '/auth/facebook/logout',function( request, response ) {
<<<<<<< HEAD
  request.logout();
  response.send( 'Logged out!' );
      //res.redirect('/');
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.status(401).send("Failed to authenticate: please login")
  }
=======
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
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502
}


app.listen(port, function(){
console.log('Listening:' + port);
});
<<<<<<< HEAD

app.get('*', function(req, res){
  res.status(400).send("Sorry, that page doesn't exist.");
});
=======
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
>>>>>>> 2ad39f44ff5635427576f7323550f61469b82502
