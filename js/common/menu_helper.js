MENU_HELPER = new function () {
    this.menuClick = function (page, parentpage){
        console.log(page, parentpage, CURRENT_MODULE);
        console.log(MODULE_DATA);
        var currentPageDetails;
        if(MODULE_DATA &&  MODULE_DATA.loggedInUser &&  MODULE_DATA.loggedInUser.menu &&  MODULE_DATA.loggedInUser.menu.SideMenu) {
            currentPageDetails =  MENU_HELPER.getMenuItem(MODULE_DATA.loggedInUser.menu.SideMenu, page, parentpage);
        }
        if(currentPageDetails) {
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
            $('#content-wrapper').render(page, helperData);
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