$(document).ready(function(e) {
    $('#search').button().click(function(){
        var query = $('#search-query');
        window.location.href = "/search?q="+query.val()
    });
    $('#search-query').bind("enterKey", function(){
        var query = $('#search-query');
        window.location.href = "/search?q="+query.val()
    });
    $('#search-query').keyup(function(e){
        if(e.keyCode == 13)        {
            $(this).trigger("enterKey");
        }
    });
});
