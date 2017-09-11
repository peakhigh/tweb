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

    //move this code main js file
    var data = new Bloodhound({ 
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
    
        prefetch: {
            url: CONSTANTS.apiServer + "users/service/manageUser",
            ajax : {
                /* beforeSend: function(jqXhr, settings){
                   settings.data = $.param({q: queryInput.val()})
                }, */
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
        }
    });
    // If prefetch is used, clear cache
    data.clearPrefetchCache();
    //console.log("** Clear cache called **")
    //Initialize the bloodhound suggestion engine
    data.initialize();
    //console.log("** Initialize called **")
    $(".modal-body").alpaca({
        "schema": {
            "type": "object",
            "properties": {
                "userType": {
                    "type": "string",
                    "enum": ["TRUCK_ADMIN", "TRIP_ADMIN"],
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
                    "helpers": []
                },
                "userName": {
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
                            "name": "data",
                            "displayKey": 'value',
                            "source": data.ttAdapter()
 
                        }
                    }
                }
            },
            "form": {
                "buttons": {
                    "submit": {
                        "title": "Submit",
                        "click": function() {
                            console.log("Value is: " , this.getValue());
                        }
                    },
                    "cancel": {
                        "title": "Cancel",
                        "click": function() {
                         //   console.log("Value is: " + this.getValue());
                            $('#myModal').modal('hide'); 
                        }
                    }
                }
            }
        },
       
    });

    chooseUser = function(){
        console.log();
    }
});