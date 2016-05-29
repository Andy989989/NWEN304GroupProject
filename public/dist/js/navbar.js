$(document).ready(function(e){
    if(sessionStorage.test == 'no token'){
        console.log('empty');
        $('#login').text('Login');
        $('#login').attr('href', '/login');
        sessionStorage.test = 'token'
    }else{
        console.log('full');
        $('#login').text('Logout');
        $('#login').attr('href', '/login');
        sessionStorage.test = 'no token'
    }
});
