Handlebars.registerHelper('stringify', function (data) {
    return JSON.stringify(data);
});
Handlebars.registerHelper('whichPage', function (data) {
    return MENU_HELPER.getHomePageByLocation();
});