MENU_HELPER = new function () {
    breadCrumbStack = [];
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
                partials: ['loading','breadCrumb']
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
            
           // window.location.href = href;
           if(extraOptions && extraOptions.skiphistory){
                   //dont add state..
           }else{
                history.pushState(page,null,href)
           }       

           MENU_HELPER.addToBreadCrumbStack(MODULE_DATA.loggedInUser.menu.SideMenu,page,parentpage);
        /*        breadCrumbStack.forEach(function(entry) {
            console.log(entry);
        });  */
        }
        
    }

    this.setCurrentPageDetails = function (page, parentpage, currentPageDetails) {
        CURRENT_PAGE = page;
        CURRENT_PARENT_PAGE = parentpage;
        CURRENT_PAGE_CONFIG = currentPageDetails;
    }
    // BreadCrumb methods start
    this.addToBreadCrumbStack = function(menu,page,parentpage){
            for (var i = 0; i < menu.length; i++) {
                if (parentpage && menu[i]['page'] === parentpage) {
                    return  MENU_HELPER.addToBreadCrumbStack(menu[i].Menu, page);
                } else if (menu[i]['page'] === page) {
                    if(menu[i]['hide'] === true){
                        if(MENU_HELPER.checkTopPageisSame(menu[i]) === false){
                            breadCrumbStack.push(menu[i]);
                        }
                    }else{
                        breadCrumbStack.length = 0;
                        breadCrumbStack.push(menu[i]);
                    }
                }
            }
    }
     //Dont navigate if we are already on the same page
    this.checkTopPageisSame = function(currentPage){ 
        if(breadCrumbStack.length > 0){
            var top = breadCrumbStack.length -1 ;
            var topPage = breadCrumbStack[top];
            if(topPage.page === currentPage.page){
                return true;
            }
        }
        return false;
    }
    //Pop the item from the breadcrumb stack.
    this.removeFromBreadCrumb = function(index){
        if(index < breadCrumbStack.length -1){
            for(var i = breadCrumbStack.length -1 ; i>index;i--){
                breadCrumbStack.pop();
            }
            if(breadCrumbStack[index].hide === true){
                MENU_HELPER.menuClick(breadCrumbStack[index].page,CURRENT_PARENT_PAGE);
            }else{
                MENU_HELPER.menuClick(breadCrumbStack[index].page);
            }
       }
    }

    this.getBreadCrumbStack = function(){
        return breadCrumbStack;
    }
    // BreadCrumb methods end

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

    this.showViewAsPopUp = function(){
        if(API_HELPER.getLoggedInUser().role === "CALL_CENTER_USER"){
            
            var selectedUser;
            var userType = "TRUCK_ADMIN";
            //move this code main js file
            var userdata = new Bloodhound({ 
                datumTokenizer: function(d) {
                var test = Bloodhound.tokenizers.whitespace(d.value);
                    $.each(test,function(k,v){
                        i = 0;
                        for (; i < v.length; i++) {
                            test.push(v.substr(i,v.length));
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
                    identify: function(obj) { 
                        return obj.id; },
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
            
          var val =  $(".modal-body").alpaca({
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
                            "onFieldChange": function(e) {
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
                                "click": function() {
                                    if(this.getValue().userName){
                                      var currentUser = this.getValue();
                                      currentUser._id = selectedUser.id;
                                      API_HELPER.setViewAsUser(currentUser);
                                    }
                                    this.clear();
                                    location.reload();
                                    console.log("Value is: " , this.getValue());
                                }
                            },
                            "cancel": {
                                "title": "Cancel",
                                "click": function() {
                                 //   console.log("Value is: " + this.getValue());
                                    $('#myModal').modal('hide'); 
                                    this.clear();
                                }
                            }
                        }
                    }
                },
               
            }).on('typeahead:selected', function(obj, datum, name) {
                selectedUser = datum;
                //alert(JSON.stringify(datum)); 
                // Your Code Here
            });
        
            $('.img-wrap .close').on('click', function() {
          //      var id = $(this).closest('.img-wrap').find('img').data('id');
                API_HELPER.setViewAsUser();
                location.reload();
            });

            $("#myModal").modal("show");
          }
          
    }

    this.clearViewAsSelection = function(){
        API_HELPER.setViewAsUser();
        location.reload();
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
