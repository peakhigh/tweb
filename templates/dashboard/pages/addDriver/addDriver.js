// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-driver-content", config, {
        postUrl: "drivers/service/addDriver",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageDriver', 'manageDriver');
            }
        },
    });
});