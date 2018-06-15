var pageDetails = MENU_HELPER.getCurrentPageDetailsByLocation();
CURRENT_MODULE = 'dashboard';
if (typeof CURRENT_PAGE === "undefined" || !CURRENT_PAGE) {
    CURRENT_PAGE = pageDetails.page;
    CURRENT_PARENT_PAGE = pageDetails.parentPage;
    CURRENT_PAGE_CONFIG = pageDetails.currentPageConfig;
}

$(function() {
    $(window).bind("load resize", setPageHeight);

    function setPageHeight(){
        var topOffset = 100;
        var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");            
        }
    }
    setPageHeight();    

     window.onpopstate = function(event) {
            if(location.hash && location.hash.length>0){
                var uri = location.hash.replace('#','');
                var page = uri.split('/')[1];
                var parentpage = uri.split('/')[0];
                if(!page){
                    page = parentpage;
                    parentpage = null;
                }
                MENU_HELPER.menuClick(page, parentpage,{'skiphistory':'true'});
            }else{
          //      MENU_HELPER.menuClick('dashboard');
            }
        event.preventDefault();
        return false;  
    } 
});