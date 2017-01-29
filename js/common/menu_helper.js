MENU_HELPER = new function () {
    this.menuClick = function (page, parentpage){
        // console.log(page, parentpage, CURRENT_MODULE);
        // console.log(MODULE_DATA);
        CURRENT_PAGE = page;
        CURRENT_PARENT_PAGE = parentpage;
        var currentPageDetails;
        if(MODULE_DATA &&  MODULE_DATA.loggedInUser &&  MODULE_DATA.loggedInUser.menu &&  MODULE_DATA.loggedInUser.menu.SideMenu) {
            currentPageDetails =  MENU_HELPER.getMenuItem(MODULE_DATA.loggedInUser.menu.SideMenu, page, parentpage);
        }
        if(currentPageDetails) {
            CURRENT_PAGE_CONFIG = currentPageDetails;
            /** TODO: how to get partials list in a template ? change lib ? set in api level ?*/
            $.handlebars({
                templatePath: 'templates/' + CURRENT_MODULE + '/pages',
                templateExtension: 'html',
                partialPath: 'templates/' + CURRENT_MODULE + '/partials',
                partialExtension: 'html',
                partials: []
            });
            var helperData = {}; 
            helperData.pageHeading = currentPageDetails.title;
            helperData.pageSubHeading = currentPageDetails.title;
            helperData.pageIcon =  currentPageDetails.icon;
            // console.log(currentPageDetails);
            if(currentPageDetails.service) {//first load the service, get the service data & render the template                
                API_HELPER.loadService(currentPageDetails, function(error, response) {
                    // console.log (error, response);
                    if (error) {
                        console.log(error);
                        return;
                    }
                    helperData.templateData = response;
                    STORAGE.setItem(currentPageDetails.page+'-template-data', response);//set response in the storage
                    $('#content-wrapper').render(page, helperData);
                });
            } else {
                $('#content-wrapper').render(page, helperData);
            }           
        }        
    }  

    this.getMenuItem = function(menu, page, parentpage){
         for(var i=0; i < menu.length; i++){
             if(parentpage && menu[i]['page'] ===  parentpage){
                 return MENU_HELPER.getMenuItem(menu[i].Menu, page);
             } else if(menu[i]['page'] ===  page){
                return menu[i];
             }
        }
        return null;
    }  
}