Handlebars.registerHelper('stringify', function (data) {
    return JSON.stringify(data);
});
Handlebars.registerHelper('whichPage', function (data) {
    return MENU_HELPER.getHomePageByLocation();
});
Handlebars.registerHelper('raw-helper', function (options) {
    return options.fn();
});

Handlebars.registerHelper('getLoggedInUser', function () {
    return API_HELPER.getLoggedInUser();
});

Handlebars.registerHelper('compileTemplateByName', function (templateId, record, config) {
    if (templateId) {
        var template = Handlebars.compile($('#' + templateId).html());
        if (config && config.preRender) {
            record = config.preRender(record) || record;
        }
        if (record && typeof record === 'object') {
            return template(record);
        } else {
            return template();
        }
    } else {
        return '';
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



Handlebars.registerHelper('currency', function (value) {
    //TODO: format value with commas
    return "₹" + value;
});

Handlebars.registerHelper('commaSeperatedArray', function (array) {
    return array.join(", ");
});

Handlebars.registerHelper('exceptOnFirst', function (index, html) {
    return (index > 0) ? html: '';
});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('ifArray', function(arr) {
    if (!arr || !Array.isArray(arr) || arr.length == 0)
    {
        return false;
    }
    return true;
});

Handlebars.registerHelper('isloggedIn', function(arg1, arg2, options) {
    return (arg1._id == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('getIcon', function(mimetype) {
    var icon = 'fa-file';
    switch (mimetype){
        case 'image/jpeg':
        case 'image/png':
        icon = 'fa-picture-o';
        break;
        case  'application/pdf':
            icon = 'fa-file-pdf-o';
        break;
    }
    return icon;
});
