$(document).ready(function(e) {

    console.log("inside index");

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
    $('#recomendations').button().click(function(){
        var ok = window.confirm("Are you okay with us using your location for recommendations?");
        if(ok){
            window.location.href = "/getRecommendations";
        }else{
            return;
        }
    });
});
