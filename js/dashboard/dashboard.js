var pageDetails = MENU_HELPER.getCurrentPageDetailsByLocation();
CURRENT_MODULE = 'dashboard';
CURRENT_PAGE = pageDetails.page;
CURRENT_PARENT_PAGE = pageDetails.parentPage;
CURRENT_PAGE_CONFIG = pageDetails.currentPageConfig;
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
});