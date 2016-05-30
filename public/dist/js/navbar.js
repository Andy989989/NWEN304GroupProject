$(document).ready(function(e){
    if(sessionStorage.test == 'no token'){
        $('#login').text('Login');
        $('#login').attr('href', '/login');
    }else{
        $('#login').text('Logout');
        $('#login').attr('href', '/login');
    }
});
