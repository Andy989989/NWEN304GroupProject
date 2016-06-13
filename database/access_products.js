var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bp = require('body-parser');
var exports = module.exports = {};
var pg = require('pg').native;
var connectionString = "postgres://rybgtwaenxzadm:Ia_YiG0ih5FblKPT71enEMI4z-@ec2-54-243-236-70.compute-1.amazonaws.com:5432/d6map6onq4uhlg";
var client = new pg.Client(connectionString);
client.connect();
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

/*
 * =====================================================
 * SEARCH
 * =====================================================
 */

exports.search = function(req, res){
	var q = req.query.q;
	if(q == undefined || q == null || !ensure_only_letters_and_numbers(q)){
		res.status(400).send("Invalid query.");
		return;
	}
	//Replaces all underscores with spaces (so multiple words can be passed in a query).
	for(var i = 0, len = q.length; i!=len; i++){
		if(q.charAt(i) == '_'){
			q = q.substr(0, i) + ' ' + q.substr(i + 1);
		}
	}
	var error = false;
	var query = client.query("select * from products where description ilike '%"+q+"%' or name ilike '%"+q+"%'", function(err){
			if(err){
			res.status(500).send("Could not search in database.");
			error = true;
			}
			});
	if(error){
		return;
	}
	res.status(200);
	handle_query(query, res, null);
}

/*
 * =====================================================
 * GET
 * =====================================================
 */

exports.get_me_something = function(req, res){
	var array = sanitize_url(req.url);
	if(array == null){
		//The url was invalid
		res.status(400).send("Invalid url.");
		return;
	}
	var error = false;
	var query;
	if(array.length == 1){
		//url is just /gender
		query = client.query("select * from products where gender='" + array[0]+"'", function(err, rows, fields){
				if(err){
				res.status(404).send("Sorry, we can't find that.");
				error = true;
				}
				});
	} else if(array.length == 2){
		//url is /gender/some_category
		query = client.query("select * from products where gender='" + array[0] + "' and type='" + array[1]+"'", function(err, rows, fields){
				if(err){
				res.status(404).send("Sorry, we can't find that.");
				error = true;
				}
				});
	} else {
		//url is /gender/some_category/item_id
		query = client.query("select * from products where id='"+array[2]+"'", function(err, rows, fields){
				if(err){
				res.status(404).send("Sorry, we can't find that.");
				error = true;
				}
				});
	}
	if(error){
		return;
	}
	res.statusCode = 200;
	handle_query(query, res, array[0]);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// All of these following exports should only be able to
// be used by an admin user.
// From here...
//++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
 * =====================================================
 * DELETE
 * =====================================================
 */
exports.delete_something = function(req,res){
	res.send("Unimplemented function 'delete'.");
}

/*
 * =====================================================
 * POST
 * =====================================================
 */
exports.update_something = function(req,res){
	res.send("Unimplemented function 'post'.");
}

/*
 * =====================================================
 * PUT
 * =====================================================
 */
exports.put_something_in_database = function(req,res){
	res.send("Unimplemented function 'put'.");
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ... to here.
//++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
 * =====================================================
 * HELPER METHODS
 * =====================================================
 */

function postData(key, value){
	//client.query("update jobs set complete="+value+" where name='"+key+"'");
}

function putData(key, value){
	//client.query("insert into jobs (name, complete) values ('"+key+"',"+value+")");
}

function sanitize_url(url){
	var queries_removed = url.split('?');
	var leading_slash_removed = queries_removed[0].slice(1);
	var path = leading_slash_removed.split('/');
	if(path[path.length - 1] == ""){
		path = path.slice(0,-1);
	}
	return test_path(path);
}

function test_path(path){
	for(var i = 0; i < path.length; i++){
		if(path[i] == undefined || !ensure_only_letters_and_numbers(path[i])){
			return null;
		}
	}
	return path;
}

function ensure_only_letters_and_numbers(word){
	return /^\w+$/.test(word);
}

function handle_query(query, res, tableID){
	var query_results = [];
	query.on('row', function(row){
		query_results.push(JSON.stringify(row));
	});
	query.on('end', function(){
		res.render('display', {results: query_results, table: tableID})
	});
}
