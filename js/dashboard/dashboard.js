CURRENT_MODULE = 'dashboard';
CURRENT_PAGE = 'dashboard';
CURRENT_PARENT_PAGE = null;
CURRENT_PAGE_CONFIG = null;
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