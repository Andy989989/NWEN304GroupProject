$(document).ready(function(e) {
	$('#purchase').button().click(function(){
    	
    	$.ajax({
              method:'POST',
              url: "/buy_kart",
              error: function(data,status) {
              	alert("failed purchase");
        		window.location.href = "profile";
              },
              success: function(data,status){
                alert("succesful purchase");
        		window.location.href = "profile";
              }
        });
  	});
}); 
