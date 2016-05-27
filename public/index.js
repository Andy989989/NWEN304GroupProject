$(document).ready(function(e){

	var ERROR = console.error.bind(console);

	$('#men').click(function()
	{
		var link = $(this).attr("value");
		$.ajax({
			url: "/men/" + link,
			type: 'GET',

		}).then(display, ERROR);
	});


	function display(data){
		var jsonData = JSON.parse(data);		
		console.log(jsonData.name)

	}
});