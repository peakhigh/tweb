$(document).ready(function () {
    navigateToPage = function(page){
        var extras;
        switch(page){
            case 'Quoted':
            case 'Paymentpending':
            case 'Running':
            case 'Assigned':
           extras ={ data : {
                status: page
            }};
            page = 'manageTrip';
            break;
        }
        MENU_HELPER.menuClick(page, page, extras);
    }
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
    })


    $('.img-wrap .close').on('click', function() {
  //      var id = $(this).closest('.img-wrap').find('img').data('id');
        API_HELPER.setViewAsUser();
        location.reload();
    });
  }
});