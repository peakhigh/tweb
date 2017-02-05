FORM_HELPER = new function (options) {
    this.setDefaultView = function (config, options) {
        config.view = {
            parent: "bootstrap-create-horizontal",
            layout: {
                template: "<div class='row'><div class='col-md-6' id='column-1'></div><div class='col-md-6' id='column-2'></div></div>"
            }
        }
        if (options.bindings) {
            if (config.view && config.view.layout) {
                config.view.layout.bindings = options.bindings;
            }
        }
    }
    this.draw = function (elementSelector, config, options) {
        if (config) {
            //  $(elementSelector).html('{{> loading }}');
            //  $(elementSelector).html(Handlebars.compile($(elementSelector).html())({}));
            if (!config.view) {
                FORM_HELPER.setDefaultView(config, options);
            }
            if (config.schema && config.schema.properties) {
                if (!config.options) {
                    config.options = {
                        fields: {}
                    }
                }
                if (!config.data) {
                    config.data = {};
                }
                FORM_HELPER.setDefaults(config.schema.properties, config.options.fields, config.data, options);
                console.log(config);
                $(elementSelector).alpaca(config);
            }
        }
    }
    this.setDefaults = function (schemaFields, fieldOptions, defaultData, formOptions) {
        Object.keys(schemaFields).forEach((field) => {
            if (schemaFields[field].type === 'array') {
                if (schemaFields[field].items.type === 'object') {
                    if (!formOptions.type || formOptions.type === 'create') {//set default data in create mode to display controls by default
                        if (!defaultData) {
                            defaultData = {}
                        }
                        defaultData[field] = [{}];
                    }
                    if (!fieldOptions[field]) {
                        fieldOptions[field] = {};
                    }
                    if (!fieldOptions[field].items) {
                        fieldOptions[field].items = {};
                    }
                    if (!fieldOptions[field].items.fields) {
                        fieldOptions[field].items.fields = {};
                    }
                    //set tool bar - default display at top with just add & remove options
                    fieldOptions[field].toolbarSticky = true;
                    fieldOptions[field].actionbarStyle = "top";
                    fieldOptions[field].actionbar = {
                        actions: [{
                            action: "up",
                            enabled: false
                        }, {
                            action: "down",
                            enabled: false
                        }]
                    }
                    //go for child items
                    FORM_HELPER.setDefaults(schemaFields[field].items.properties, fieldOptions[field].items.fields, defaultData[field][0], formOptions);
                } else if (schemaFields[field].items.type === 'string') {
                    if (!formOptions.type || formOptions.type === 'create') {
                        schemaFields[field].default = " ";
                    }
                    if (!fieldOptions[field]) {
                        fieldOptions[field] = {};
                    }
                    //set tool bar - default display at top with just add & remove options
                    fieldOptions[field].toolbarSticky = true;
                    fieldOptions[field].actionbarStyle = "top";
                    fieldOptions[field].actionbar = {
                        actions: [{
                            action: "up",
                            enabled: false
                        }, {
                            action: "down",
                            enabled: false
                        }]
                    }                    
                }
            } else if (schemaFields[field].type === 'object') {//set default data in create mode to display controls by default
                if (!formOptions.type || formOptions.type === 'create') {
                    if (!defaultData) {
                        defaultData = {}
                    }
                    defaultData[field] = {};
                }
                if (!fieldOptions[field]) {
                    fieldOptions[field] = {};
                }
                if (!fieldOptions[field].fields) {
                    fieldOptions[field].fields = {};
                }
                FORM_HELPER.setDefaults(schemaFields[field].properties, fieldOptions[field].fields, defaultData[field], formOptions);
            } else if (schemaFields[field].type === 'date') {
                if (!fieldOptions[field]) {
                    fieldOptions[field] = {};
                }
                fieldOptions[field].picker = {};//set also date format from constants here for all date time pickers  

                if(!schemaFields[field].format) {
                    schemaFields[field].format = "date";
                } else {                    
                    fieldOptions[field].picker.showClose = true;//show close button button for timepicker
                }     
                schemaFields[field].type = "string"
            } else if (schemaFields[field].type === 'objectid') {
                schemaFields[field].type = "string"
            }
        });
    }

}