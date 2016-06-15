$(document).ready(function(e) {

    console.log("inside index");

    if(token != null){
        console.log(token);
    }
    $('#search').button().click(function(){
        var query = $('#search-query');
        queryString = query.val().replace(/ /g,"_");
        window.location.href = "/search?q="+queryString;
    });
    $('#search-query').bind("enterKey", function(){
        var query = $('#search-query');
        queryString = query.val().replace(/ /g,"_");
        window.location.href = "/search?q="+queryString;
    });
    $('#search-query').keyup(function(e){
        if(e.keyCode == 13)        {
            $(this).trigger("enterKey");
        }
    });
});
