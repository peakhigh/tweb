console.log('template data acceptTripReq', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".accept-trip-content", config, {
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
                MENU_HELPER.menuClick('manageTrucks', 'manageTrucks');
            }
        },
    });
});