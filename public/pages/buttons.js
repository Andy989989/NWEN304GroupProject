




	//var ipAddr = 'https://morning-dawn-49717.herokuapp.com/';
	var ipAddr = 'http://130.195.4.177:8080';

	console.log("test");

	
	//<input type="text" class="form-control" id="registerUsername" rows="5" placeholder="Username">
	//<input type="text" class="form-control" id="registerPassword" rows="5" placeholder="Password">
	//<input type="text" class="form-control" id="registerConfirmPassword" rows="5" placeholder="Confirm Password">



$(document).ready(function(e) {



	$('#submit').button().click(

		function() {
			console.log($('#registerUsername').val());
			console.log($('#registerPassword').val());
			console.log($('#registerConfirmPassword').val());
			var userName = $('#registerUsername').val();
			var password = $('#registerPassword').val();



			if(userName == null || userName == undefined || userName == ''){
				alert("please enter a user Name and password");
			}else{
				var data = {'userName':userName,'password':password};
				console.log(data);
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

			}

			

			




		});


});





