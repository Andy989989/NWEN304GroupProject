var ipAddr = 'https://morning-dawn-49717.herokuapp.com';
//var ipAddr = 'st:8080';
//var data = {'userName':'Andy','password':'test1'};
console.log("test");

$(document).ready(function(e) {
//var ipAddr = 'https://morning-dawn-49717.herokuapp.com';
    var ipAddr = 'http://130.195.4.164:8080';
    //var data = {'userName':'Andy','password':'test1'};
    var token;
    $('#submitLogin').button().click(
    function() {
      console.log($('#registerUsername').val());
      console.log($('#registerPassword').val());
      //console.log($('#registerConfirmPassword').val());
      var userName = $('#registerUsername').val();
      var password = $('#registerPassword').val();



      if(userName == null || userName == undefined || userName == ''){
        alert("please enter a user Name and password");
      }else{

        var data = {'userName':userName,'password':password};
        console.log(data);


         $.ajax({
              method:'POST',
              url: ipAddr+"/login",
              data: data,
              //url: ipAddr+"/test",
              error: function(data,status) {
                  alert("failed login");
                  console.log(data);

              },
              success: function(data,status){
                 alert("succesful login");
                console.log(data);
                 console.log(data.token);
                  token = {"token":data.token};
                  console.log(token);
              }
          });

      }




    });


    $('#testAuth').button().click(
    function() {
        $.ajax({
            method:'POST',
            url: ipAddr+"/auth/authenticate",
            data: token,
            //url: ipAddr+"/test",
            error: function(data,status) {
                alert("failed auth");
                console.log(data);

            },
            success: function(data,status){
                alert("succesful auth");
                console.log(data);
                //console.log(data.token);
                //token = {"token":data.token};
                //console.log(token);
                console.log(data.token);
            }
         });
    
    });





  $('#test').button().click(
        function(){
            if(sessionStorage.test != 'token'){
                sessionStorage.test = 'token'
            }else{
                sessionStorage.test = 'no token'
            }
        }
    )


});

