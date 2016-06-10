$(document).ready(function(e){
    if(sessionStorage.test == 'no token' || sessionStorage.test == undefined){
        $('#login').text('Login');
        $('#login').attr('href', '/login');
    }else{
        $('#login').text('Logout');
        $('#login').attr('href', '/auth/logout');
    }
});
