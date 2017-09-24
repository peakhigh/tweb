console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".reject-trip-content", config, {
        bindings: {
            truckid: "column-1",
            driverid: "column-1",
            comment: "column-1",
        },
        schemaOverride: {
            fields: {
            }
        },
        optionsOverride: {
            fields: {
                comment: {
                      type: "textarea"
                },
            }
        }, 
        postUrl: "requests/service/addRequest",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });
});