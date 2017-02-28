// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".edit-trips-content", config, {
        postUrl: "trips/service/setQuote",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });
});