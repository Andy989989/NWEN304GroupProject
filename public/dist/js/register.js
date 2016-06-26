


	var ipAddr = 'https://morning-dawn-49717.herokuapp.com';
	//var ipAddr = 'https://127.0.0.1:8080';

	console.log("test");

	
	//<input type="text" class="form-control" id="registerUsername" rows="5" placeholder="Username">
	//<input type="text" class="form-control" id="registerPassword" rows="5" placeholder="Password">
	//<input type="text" class="form-control" id="registerConfirmPassword" rows="5" placeholder="Confirm Password">



$(document).ready(function(e) {



	$('#submit').button().click(

		function() {
			
			var userName = $('#registerUsername').val();
			var password = $('#registerPassword').val();
			var confirmPassword = $('#registerConfirmPassword').val();

			console.log($('#registerUsername').val());
			console.log($('#registerPassword').val());
			console.log($('#registerConfirmPassword').val());

			if(password !== confirmPassword){
				alert("Passwords must match");
				return;
			}



			if(userName == null || userName == undefined || userName == ''){
				alert("please enter a user Name and password");
			}else{
				var data = {'username':userName,'password':password};
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

