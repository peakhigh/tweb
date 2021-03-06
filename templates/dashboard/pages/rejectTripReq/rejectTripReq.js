console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    config.data.comment = '';
    config.data.status = 'Rejected';
    
    FORM_HELPER.draw(".reject-trip-content", config, {
        bindings: {
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
                MENU_HELPER.menuClick('manageRequests', 'manageRequests');
            }
        },
    });
});