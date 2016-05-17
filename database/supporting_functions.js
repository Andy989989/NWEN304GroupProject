var exports = module.exports = {};

exports.sanitize_url = function(url){
	//Remove any queries from the end of the url
	var new_url = url.split('?');
	//Get the /gender/... part, remove the leading '/', and split it into the query
	var array = new_url[0].slice(1).split('/');
	return array;
}

exports.handle_query = function(query, res){
	var query_results = [];
	query.on('row', function(row){
		query_results.push(row);
	});
	query.on('end', function(){
		res.json(query_results);
	});
}
