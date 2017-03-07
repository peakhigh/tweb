// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-users-content", config, {
        postUrl: "users/form",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageUser', 'manageUser');
            }
        },
    });
});