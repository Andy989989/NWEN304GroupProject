$(document).ready(function(e){
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
