// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-driver-content", config, {
        bindings: {
            name: "column-1",
            mobile: "column-2",
            licenseNumber: "column-1",
            licenseExpiryDate: "column-2",
            experience: "column-1",
            email: "column-2",
            alternativePhone:"column-1"
        },
        schemaOverride: {
            fields: {
                experience: {
                    title: "Experience (in years)"
                },
                licenseExpiryDate: {
                    title: "License Expiry"
                }
            }
        },
        postUrl: "drivers/service/addDriver",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageDriver', 'manageDriver');
            }
        },
    });
});