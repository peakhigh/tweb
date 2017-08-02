// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data quote', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
   // config.schema = {priceQuote:{title:"Cost (in Rs)"}};
    FORM_HELPER.draw(".quote-trips-content", config, {
        postUrl: "requests/service/setQuote",
        callbacks: {
            beforeSubmit: function (config) {
                console.log(config);
                var data = {};
                data.message = config.data.message;
                data.priceQuote = config.data.priceQuote;
                data.type = "Bid";
                data.status = "New";
                data.itemId = config.data._id;
                config.data = data;

             },
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTruck', 'manageTruck');
            }
        },
    });
});