console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    config.data.status = "Cancelled";
    FORM_HELPER.draw(".cancel-trip-content", config, {
         bindings: {
            status: "column-1",
            comments: "column-1"
        } ,
        schemaOverride: {
            fields: {
                comments: {   
                    title: "Reason:",
                    items: {
                        properties: {

                        }
                    }
                }
            }
        },
        optionsOverride: {
            fields: {
                comments: {
                      type: "textarea"
                   /* items: {
                        fields: {
                            comment: {
                                type: "textarea"
                            } ,
                            date: {
                                hidden: true,
                                default: (new Date())
                            },  
                            commentedby: {
                                type: "text",
                                hidden: true,
                                default: "truck_admin"
                             //   default: API_HELPER.getLoggedInUser().username
                            } 
                        }
                    } */
                },
                status: {
                    default: "Cancelled",
                    disabled: true
                },
            }
        }, 
        postUrl: "trips/service/cancelTrip",
        callbacks: {
            beforeSubmit: function (data) {
                console.log(data);
             },
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });
});