MENU_HELPER = new function () {

    this.menuClick = function (page, parentpage, extraOptions) {
       //  console.log(page, parentpage, CURRENT_MODULE);
       //  console.log(MODULE_DATA); 
        $("#content-wrapper").html(Handlebars.compile('{{> loading }}')); 

        CURRENT_PAGE = page;
        CURRENT_PARENT_PAGE = parentpage;
        $('.navbar-nav .list-group-item  a.active').removeClass('active');
        if (parentpage) {
            $('#amenu' + parentpage + '-' + page).addClass('active');
        } else {
            $('#amenu' + page).addClass('active');
        }
        var currentPageDetails;
        if (MODULE_DATA && MODULE_DATA.loggedInUser && MODULE_DATA.loggedInUser.menu && MODULE_DATA.loggedInUser.menu.SideMenu) {
            currentPageDetails = MENU_HELPER.getMenuItem(MODULE_DATA.loggedInUser.menu.SideMenu, page, parentpage);
        }
        if (currentPageDetails) {
            console.log(currentPageDetails);
            CURRENT_PAGE_CONFIG = currentPageDetails;
            /** TODO: how to get partials list in a template ? change lib ? set in api level ?*/
            $.handlebars({
                templatePath: 'templates/' + CURRENT_MODULE + '/pages',
                templateExtension: 'html',
                partialPath: 'templates/' + CURRENT_MODULE + '/partials',
                partialExtension: 'html',
                partials: ['loading']
            });
            var helperData = {};
            helperData.pageHeading = currentPageDetails.title;
            helperData.pageSubHeading = currentPageDetails.title;
            helperData.pageIcon = currentPageDetails.icon;
            helperData.extraOptions = extraOptions;
            currentPageDetails.extraOptions = extraOptions;
            if (currentPageDetails.service) {//first load the service, get the service data & render the template 
                if (extraOptions && extraOptions.data) {
                    if (!extraOptions.data) {
                        extraOptions.data = {};
                    }
                    if (!currentPageDetails.data) {
                        currentPageDetails.data = {};
                    }
                    
                    $.extend(true, currentPageDetails.data, extraOptions.data);
                }
                if (MENU_HELPER_CALLBACKS[page] && MENU_HELPER_CALLBACKS[page].setFilters) {
                    MENU_HELPER_CALLBACKS[page].setFilters(currentPageDetails);
                } else if (parentpage) {
                    var key = parentpage + '#' + page;
                    if (MENU_HELPER_CALLBACKS[key] && MENU_HELPER_CALLBACKS[key].setFilters) {
                        MENU_HELPER_CALLBACKS[key].setFilters(currentPageDetails);
                    }
                }
                API_HELPER.loadService(currentPageDetails, function (error, response) {
                    // console.log (error, response);
                    if (error) {
                        console.log('error', error);
                        return;
                    }
                    helperData.templateData = response;
                    STORAGE.setItem(currentPageDetails.page + '-template-data', response);//set response in the storage
                    $('#content-wrapper').render(page, helperData);
                });
            } else {
                $('#content-wrapper').render(page, helperData, function () {
                    MENU_HELPER.setCurrentPageDetails(page, parentpage, currentPageDetails);
                });
            }
            var href = 'dashboard.html#';
            if (parentpage) {
                href += parentpage + '/';
            }
            if (page) {
                href += page;
            }
            if (extraOptions && Object.keys(extraOptions.length > 0)) {
                if (extraOptions.extraHref) {
                    href += '/' + extraOptions.extraHref;
                }
            }
            window.location.href = href;
        }
    }

    this.setCurrentPageDetails = function (page, parentpage, currentPageDetails) {
        CURRENT_PAGE = page;
        CURRENT_PARENT_PAGE = parentpage;
        CURRENT_PAGE_CONFIG = currentPageDetails;
    }

    this.getMenuItem = function (menu, page, parentpage) {
        for (var i = 0; i < menu.length; i++) {
            if (parentpage && menu[i]['page'] === parentpage) {
                return $.extend(true, {}, MENU_HELPER.getMenuItem(menu[i].Menu, page));
            } else if (menu[i]['page'] === page) {
                return $.extend(true, {}, menu[i]);
            }
        }
        return null;
    }

    this.getHomePageByLocation = function (pathNeeded) {
        if (window.location.href.indexOf('#') < 0) {
            return pathNeeded ? 'templates/dashboard/pages/home' : 'home';
        } else {
            return 'loading';
        }
    }
    this.setUIMenuItem = function (page, parentpage) {
        if (parentpage) {
            $('#submenu' + parentpage).addClass("in");
            $('#submenu' + parentpage).prop('aria-expanded', true);
        }
    }
    this.getCurrentPageDetailsByLocation = function () {
        var details = {};
        if (window.location.href.indexOf('#') > 0) {
            var currentPagePathDetails = window.location.href.substr(window.location.href.indexOf('#') + 1, window.location.href.length - 1).split('/');
            if (currentPagePathDetails.length > 1) {
                details.page = currentPagePathDetails[1];
                details.parentPage = currentPagePathDetails[0];
                currentPagePathDetails.shift();
                currentPagePathDetails.shift();
                if (currentPagePathDetails.length > 0) {
                    details.extraHref = currentPagePathDetails.join('/');
                }
            } else {
                details.page = currentPagePathDetails[0];
                details.parentPage = null;
            }
        } else {
            details.page = 'home';
            details.parentPage = null;
        }
        if (MODULE_DATA && MODULE_DATA.loggedInUser && MODULE_DATA.loggedInUser.menu && MODULE_DATA.loggedInUser.menu.SideMenu) {
            details.currentPageConfig = MENU_HELPER.getMenuItem(MODULE_DATA.loggedInUser.menu.SideMenu, details.page, details.parentPage);
        }
        return details;
    }
    this.reloadData = function (options, cb) {
        var pageDetails = MENU_HELPER.getCurrentPageDetailsByLocation();
        pageDetails.currentPageConfig.extraOptions = {
            extraHref: pageDetails.extraHref
        };
        if (options && Object.keys(options).length > 0) {
            $.extend(true, pageDetails.currentPageConfig, options);
        }
        if (MENU_HELPER_CALLBACKS[pageDetails.page] && MENU_HELPER_CALLBACKS[pageDetails.page].setFilters) {
            MENU_HELPER_CALLBACKS[pageDetails.page].setFilters(pageDetails.currentPageConfig);
        } else if (pageDetails.parentpage) {
            var key = pageDetails.parentpage + '#' + pageDetails.page;
            if (MENU_HELPER_CALLBACKS[key] && MENU_HELPER_CALLBACKS[key].setFilters) {
                MENU_HELPER_CALLBACKS[key].setFilters(pageDetails.currentPageConfig);
            }
        }
        API_HELPER.loadService(pageDetails.currentPageConfig, function (error, response) {
            // console.log (error, response);
            if (error) {
                console.log('error', error);
                return;
            }
            cb(response);
        });
    }
}

MENU_HELPER_CALLBACKS = {//define callbacks for each menu item
    manageTrip: {
        setFilters: function (config) {//set filters for all manage calls
            //change config.data here
            // config.data = {
            //     limit: CONSTANTS.gridPageSize
            // }
            // config.data = {//set where, skip, limit, sort
            //     // where: { _id: '58a917f4e904510f97fd19ef'}
            // }
        }
    }
}
