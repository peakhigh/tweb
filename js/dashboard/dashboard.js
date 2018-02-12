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

   /*  window.onhashchange = function(e) {
        console.log(e);
        if (window.innerDocClick) {
            //Your own in-page mechanism triggered the hash change
            console.log('browserclick');
        } else {
            //Browser back button was clicked
            console.log('Browser clicked..');
        }

        var baseURL = "dashboard.html#";
        var oldURL = e.oldURL.split('#')[1];
        var newURL = e.newURL.split('#')[1];

        
        if(!newURL){
            newURL = "home";
        }
     //   MENU_HELPER.menuClick(newURL, oldURL);
        e.preventDefault();
         
        console.log("back button...",oldURL,newURL);
        return false;    
    } */
});