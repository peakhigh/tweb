Handlebars.registerHelper('stringify', function (data) {
    return JSON.stringify(data);
});
Handlebars.registerHelper('whichPage', function (data) {
    return MENU_HELPER.getHomePageByLocation();
});
Handlebars.registerHelper('raw-helper', function (options) {
    return options.fn();
});

Handlebars.registerHelper('compileTemplateByName', function (templateId, record, config) {
    var template = Handlebars.compile($('#' + templateId).html());
    if (config && config.preRender) {
        record = config.preRender(record) || record;
    }
    if (record && typeof record === 'object') {
        return template(record);
    } else {
        return template();
    }
});

Handlebars.registerHelper('compileTemplateByHtml', function (html, record, config) {
    if (html) {
        var template = Handlebars.compile(html);
        if (config && config.preRender) {
            record = config.preRender(record) || record;
        }
        if (record && typeof record === 'object') {
            return template(record);
        } else {
            return template();
        }
    }
    return '';
});

Handlebars.registerHelper('gridRowPostHook', function (rowConfig, rowData, rowId) {
    if (rowConfig && rowConfig['postRender']) {
        return rowConfig['postRender'](rowData, rowId, rowConfig);
    }
});

Handlebars.registerHelper('gridPreHook', function (gridConfig) {
    if (gridConfig && gridConfig['preRender']) {
        return gridConfig['preRender'](gridConfig.gridData, gridConfig);
    }
});

Handlebars.registerHelper('gridPostHook', function (gridConfig, gridId) {
    if (gridConfig && gridConfig['postRender']) {
        return gridConfig['postRender'](gridConfig.gridData, gridId, gridConfig);
    }
});

