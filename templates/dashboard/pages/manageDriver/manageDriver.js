// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    console.log(config);
    // FORM_HELPER.draw(".manage-driver-content", config, {
    //     postUrl: "drivers/service/manageDriver",
    //     callbacks: {
    //         afterSubmit: function () {
    //             MENU_HELPER.menuClick('manageDriver', 'manageDriver');
    //         }
    //     },
    // });
});