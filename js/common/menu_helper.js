MENU_HELPER = new function () {
    this.menuClick = function (page, parentpage, extraOptions) {
        // console.log(page, parentpage, CURRENT_MODULE);
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
            CURRENT_PAGE_CONFIG = currentPageDetails;
            /** TODO: how to get partials list in a template ? change lib ? set in api level ?*/
            $.handlebars({
                templatePath: 'templates/' + CURRENT_MODULE + '/pages',
                templateExtension: 'html',
                partialPath: 'templates/' + CURRENT_MODULE + '/partials',
                partialExtension: 'html',
                partials: ['loading']//, 'breadCrumb'
            });
            var helperData = {};
            helperData.pageHeading = currentPageDetails.title;
            helperData.pageSubHeading = currentPageDetails.title;
            helperData.pageIcon = currentPageDetails.icon;
            helperData.extraOptions = extraOptions;
            currentPageDetails.extraOptions = extraOptions;
            if (!currentPageDetails.breadcrum) {//if breadcrum already not exists
                currentPageDetails.breadcrum = new MENU_HELPER.BREADCRUM();
            }                
            currentPageDetails.breadcrum.addPage(MODULE_DATA.loggedInUser.menu.SideMenu, page, parentpage);
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

            // window.location.href = href;
            if (extraOptions && extraOptions.skiphistory) {
                //dont add state..
            } else {
                history.pushState(page, null, href)
            }       
            MENU_HELPER.setCurrentPageDetails(page, parentpage, currentPageDetails);
        }

    }

    this.setCurrentPageDetails = function (page, parentpage, currentPageDetails) {
        CURRENT_PAGE = page;
        CURRENT_PARENT_PAGE = parentpage;
        CURRENT_PAGE_CONFIG = currentPageDetails;
    }

    this.getCurrentPageConfig = function() {
        return CURRENT_PAGE_CONFIG;
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

    this.showViewAsPopUp = function () {
        if (API_HELPER.getLoggedInUser().role === "CALL_CENTER_USER") {

            var selectedUser;
            var userType = "TRUCK_ADMIN";
            //move this code main js file
            var userdata = new Bloodhound({
                datumTokenizer: function (d) {
                    var test = Bloodhound.tokenizers.whitespace(d.value);
                    $.each(test, function (k, v) {
                        i = 0;
                        for (; i < v.length; i++) {
                            test.push(v.substr(i, v.length));
                            i++;
                        }
                    })
                    return test;
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: CONSTANTS.apiServer + "users/service/manageUser?userType=",
                    replace: function (url, query) {
                        //   console.log(url,query);
                        url += encodeURIComponent(userType);
                        return url;
                    },
                    identify: function (obj) {
                        return obj.id;
                    },
                    ajax: {
                        type: "GET"
                    },
                    filter: function (data) {
                        //console.log("** Filter response to get remote data **")
                        return $.map(data.data, function (item) {
                            return {
                                id: item._id, value: item.firstName + " " + item.lastName
                            };
                        });
                    }
                },
                /*         prefetch: {
                            url: CONSTANTS.apiServer + "users/service/manageUser?profile.userType=TRIP_ADMIN",
                            replace: function (url, query) {
                                console.log(userType);
                                url += encodeURIComponent(userType);
                                return url;
                            },
                            ajax : {
                                 type: "GET"
                             },
                             filter: function(data) {
                                //console.log("** Filter response to get remote data **")
                                 return $.map(data.data, function(item) {  
                                     return {
                                       id:item._id,value: item.firstName+" "+item.lastName
                                     };
                                 });
                             }
                        }  */
            });
            // If prefetch is used, clear cache
            userdata.clearPrefetchCache();
            //console.log("** Clear cache called **")
            //Initialize the bloodhound suggestion engine
            userdata.initialize();

            var val = $(".modal-body").alpaca({
                "schema": {
                    "type": "object",
                    "properties": {
                        "userType": {
                            "type": "string",
                            "enum": ["TRUCK_ADMIN", "TRIP_ADMIN"],
                            "default": "TRUCK_ADMIN",
                            "required": false
                        },
                        "userName": {
                            "type": "string"
                        }
                    }
                },
                "options": {
                    "fields": {
                        "userType": {
                            "type": "select",
                            "label": "User Type:",
                            "hideNone": true,
                            "helpers": [],
                            "onFieldChange": function (e) {
                                userType = this.getValue();
                                userdata.clearRemoteCache();
                                userdata.initialize(true);
                            }
                        },
                        "userName": {
                            "id": "mytypehead",
                            "type": "text",
                            "label": "User Name:",
                            "helper": "Select user name",
                            "typeahead": {
                                "config": {
                                    "autoselect": true,
                                    "highlight": true,
                                    "hint": true,
                                    "minLength": 1
                                },
                                "datasets": {
                                    "name": "userdata",
                                    "displayKey": "value",
                                    "source": userdata.ttAdapter()
                                }
                            }
                        }
                    },
                    "form": {
                        "buttons": {
                            "submit": {
                                "title": "Submit",
                                "click": function () {
                                    if (this.getValue().userName) {
                                        var currentUser = this.getValue();
                                        currentUser._id = selectedUser.id;
                                        API_HELPER.setViewAsUser(currentUser);
                                    }
                                    this.clear();
                                    location.reload();
                                    console.log("Value is: ", this.getValue());
                                }
                            },
                            "cancel": {
                                "title": "Cancel",
                                "click": function () {
                                    //   console.log("Value is: " + this.getValue());
                                    $('#myModal').modal('hide');
                                    this.clear();
                                }
                            }
                        }
                    }
                },

            }).on('typeahead:selected', function (obj, datum, name) {
                selectedUser = datum;
            });

            $('.img-wrap .close').on('click', function () {
                API_HELPER.setViewAsUser();
                location.reload();
            });

            $("#myModal").modal("show");
        }

    }

    this.clearViewAsSelection = function () {
        API_HELPER.setViewAsUser();
        location.reload();
    }

    this.BREADCRUM = function () {
        //breadcrum items stack
        this.pages = [];

        //add item to breadcrum
        this.addPage = function (menu, page, parentpage) {
            let parentPageItem = null;
            if (parentpage) {
                parentPageItem = MENU_HELPER.getMenuItem(menu, parentpage);
                if (parentPageItem && !this.isExists(parentPageItem)) {
                    this.pages.push(parentPageItem);
                }
            }
            let pageItem = MENU_HELPER.getMenuItem(parentPageItem && parentPageItem.Menu ? parentPageItem.Menu : menu, page);
            if (pageItem && !this.isExists(pageItem)) {
                this.pages.push(pageItem);
            }
        }
        
        //check if we are already on the same page
        this.isExists = function (currentPage) {
            if (this.pages.length > 0) {
                for (var i = 0; i < this.pages.length; i++) {
                    if(this.pages[i].page === currentPage.page) {
                        return true;
                    }
                }
            }
            return false;
        }

        //Pop the item from the breadcrumb stack.
        this.removePage = function (index) {
            if (index < this.pages.length - 1) {
                for (var i = this.pages.length - 1; i > index; i--) {
                    this.pages.pop();
                }
                if (this.pages[index].hide === true) {
                    MENU_HELPER.menuClick(this.pages[index].page, CURRENT_PARENT_PAGE);
                } else {
                    MENU_HELPER.menuClick(this.pages[index].page);
                }
            }
        }

        //get all items from breadcrum
        this.getPages = function () {
            return this.pages;
        }
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
