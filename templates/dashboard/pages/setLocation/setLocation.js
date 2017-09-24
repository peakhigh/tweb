console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    config.data.comments = [{}];
    FORM_HELPER.draw(".set-location-content", config, {
        schemaOverride: {
            fields: {
                comments: {   
                    title: "Comment",
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
                },
            }
        }, 
        postUrl: "trips/service/setLocation",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });
});