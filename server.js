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
var codes = require('./middleware/code.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

// this is for authentication

//var loggedOn = require('connect-ensure-login');
var geoip = require('geoip-lite');

var bp = require('body-parser');
var jobsFilename = './jobs.json';

// these are used in the authentication
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true,maxAge :20000 }));

// app.use(express.session({secret:'andyisawesome',  
//                             cookie: { maxAge : 20000 } //1 Hour
//                             }));


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

// this is the passprt authentication methods
require('./middleware/Config.js')(passport);
var auth = require('./middleware/authentication.js');



// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.session({  
//                             cookie: { maxAge : 20000 } //1 Hour
//                             }));


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
		res.render('index',{'user':req.user});
		});


app.get('/search*', products.search);

app.get('/id/*', products.get_from_id);


			  app.get('/men*', products.get_me_something);

        app.get('/creditCard', function(req, res){
          res.render('creditCard', {'user':req.user});
        })

        app.post('/buy_kart', users.buy_kart);

			  app.get('/women*', products.get_me_something);

			  app.get('/kids*', products.get_me_something);

			  app.get('/login', function(req, res){
			  res.render('login',{'user':req.user})
			  });

			  app.get('/profile', function (req, res) {
			  if(req.user ==undefined || req.user.name == undefined){
			  res.render('index', {'user': req.user});
			  return;
			  }
			  users.get_kart(req, res);
			  });

			  app.get('/logout', function(req, res){
			  req.logout();
			  req.user = undefined;
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

			  app.get('/add_to_cart/*', function (req, res) {
			  var url = "" + req.url;
			  var array = url.split("/");
			  var id = array[2]; //The third item is the id. eg array=[' ', id', '32']
			  if(req.user == undefined || req.user.name == undefined){
			  res.render('index', {'user':req.user});
			  return;
			  }
			  users.add_to_kart(req, res, id);
			  });

app.get('/remove_from_kart/*', function (req, res) {
    var url = "" + req.url;
    var array = url.split("/");
    var id = array[2]; //The third item is the id. eg array=[' ', id', '32']
    if(req.user == undefined || req.user.name == undefined){
        res.render('index', {'user':req.user});
        return;
    }
    users.delete_from_kart(req, res, id);
});

app.get('/delete_entire_kart', function(req, res) {
    var url = "" + req.url;
    var array = url.split("/");
    var id = array[2]; //The third item is the id. eg array=[' ', id', '32']
    users.delete_entire_kart(req, res, id);
});

app.get('/purchase_item/*', function(req, res) {
    var url = "" + req.url;
    var array = url.split("/");
    var id = array[2]; //The third item is the id. eg array=[' ', id', '32']
    users.delete_from_kart(req, res, id);
});

app.get('/getRecommendations', function (req, res) {
	var ipAddr = req.headers["x-forwarded-for"];
	if (ipAddr){
		var list = ipAddr.split(",");
		ipAddr = list[list.length-1];
	} else {
		ipAddr = req.connection.remoteAddress;
	}

  var ipAddr = "130.195.6.167";
	var geo = geoip.lookup(ipAddr);
	if(req.user == undefined){
		res.render('index', {'user':req.user});
		return;
	}
	//var country = geo.city!=undefined && geo.city!='' && geo.city!=null ? geo.city : geo.country;
	var name = req.user.name;
	if(name!==undefined){
		users.get_recommendations(name, geo, function(results){
			//res.send({recommendation: results});
			res.render('display', {results: results, user: req.user, kart: false});
		});
	}
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
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {

checkDatabase(res,req.user.displayName,req.user.id);

var data = { 'name' : req.user.displayName };
req.session.passport.user = data;
//console.log(req.user.displayName);
//var data = {'data':req.user.accessToken};
//'res.render('index', {data:data});

res.render('index', {'user':data});
//console.log(req.user.accessToken);
});

function checkDatabase(res,name,id){
users.get(name, res, function(res, password){
if(password == null || password == undefined){
//User does not already exist, so add to database
users.put(name, id);
users.get(name, res, function(res, returnedDB){
		if(returnedDB == null || returnedDB == undefined){
		console.log("failed to add to the database");
		} else {
		console.log("didn't fail to add to the database");
		}
		});
return;
}
//Otherwise the user alread exists
console.log("user already exists");
if(id == password){
	//Correct authentication TODO
} else{
	//Don't let them in, they have the wrong password TODO
}
});
}




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
		res.status(401).send("Failed to authenticate: please login")
	}

}


app.listen(port, function(){
		console.log('Listening:' + port);
		});

app.get('*', function(req, res){
		res.status(400).send("Sorry, that page doesn't exist.");
		});

