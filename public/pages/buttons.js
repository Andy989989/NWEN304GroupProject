




	var ipAddr = 'https://morning-dawn-49717.herokuapp.com/';
	//var ipAddr = 'localhost:8080';
	var data = {'UserName':'Andy','password':'test1'};

	console.log("test");



$(document).ready(function(e) {


	$('#submit').button().click(
		function() {
			console.log("asdfsadf");
			


			$.ajax({
				method:'POST',
				url: ipAddr+"/newUser",
				data: data,
    		//url: ipAddr+"/test",
    		error: function(data,status) {
    			alert("failed Register: " + status);
    			console.log(data);
    		},
    		success: function(data,status){
    			alert("succesful Register: " + status);
    			console.log(data);
    		}

    		});
	});


});





