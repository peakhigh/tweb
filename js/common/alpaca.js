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
                FORM_HELPER.setDefaults(config.schema.properties, config.options.fields, config.data, options, options.optionsOverride.fields);                
                FORM_HELPER.setFormDetails(elementSelector, config, options);
                if (options.callbacks && options.callbacks.postRender) {
                    config.postRender = function(control) {
                        options.callbacks.postRender.apply(this, [control]);   
                    }                    
                }
                console.log(config);
                $(elementSelector).alpaca(config);
            }
        }
    }

    this.setFormDetails = function (elementSelector, config, options) {
        //set options -> form buttons       
        config.options.form = options.optionsOverride.form || {};                   
        if (!config.options.form.buttons)
            config.options.form.buttons = {};
        if (!config.options.form.buttons.submit)
            config.options.form.buttons.submit = {};
        if (!config.options.form.buttons.submit.title) {
            config.options.form.buttons.submit.title = 'Submit';
        }
        if (!config.options.form.attributes) {
            config.options.form.attributes = {};
        }
        //form.attributes{post, action} - used to post a form
        if (!config.options.form.attributes.method) {
            config.options.form.attributes.method = "post";
        }
        if (!config.options.form.attributes.action) {
            config.options.form.attributes.action = options.postUrl;
        }        
        if (!config.options.form.buttons.submit.click) {
            config.options.form.buttons.submit.click = function() {
                //this.getValue() - gives you the json object of the form
                this.refreshValidationState(true);//refresh validation state on every submit
                if (!this.isValid(true)) {//if not valid
                    this.focus();//focus on first error element
                    return;
                }
                if (options.callbacks && options.callbacks.beforeSubmit) {
                    options.callbacks.beforeSubmit.apply(this, []);
                }
                var promise = this.ajaxSubmit();
                promise.done(function() {                   
                    if (options.callbacks && options.callbacks.afterSubmit) {
                        options.callbacks.afterSubmit.apply(this, []);
                    }
                });
                promise.fail(function() {                   
                    if (options.callbacks && options.callbacks.onSubmitError) {
                        options.callbacks.onSubmitError.apply(this, []);
                    }
                });
                promise.always(function() {});
            }
        }
    }

    this.setDefaults = function (schemaFields, fieldOptions, defaultData, formOptions, overrideFieldOptions) {
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
                    if (overrideFieldOptions && overrideFieldOptions[field]) { //override options from UI pespective
                        UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
                    }                    
                    FORM_HELPER.setDefaults(schemaFields[field].items.properties, fieldOptions[field].items.fields, defaultData[field][0], formOptions, 
                        (overrideFieldOptions && overrideFieldOptions[field] && overrideFieldOptions[field].items && overrideFieldOptions[field].items.fields) ? overrideFieldOptions[field].items.fields : null);
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
                    if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
                        UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
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
                if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
                    UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
                } 
                FORM_HELPER.setDefaults(schemaFields[field].properties, fieldOptions[field].fields, defaultData[field], formOptions, 
                    ((overrideFieldOptions && overrideFieldOptions[field] && overrideFieldOptions[field].fields) ? overrideFieldOptions[field].fields : null));
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
                schemaFields[field].type = "string";
                if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
                    UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
                } 
            } else if (schemaFields[field].type === 'objectid') {
                schemaFields[field].type = "string";
                if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
                    UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
                } 
            } else {//for string, numbers etc
                if (!fieldOptions[field]) {
                    fieldOptions[field] = {};
                }
                if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
                    UTILS.overrideObject(overrideFieldOptions[field], fieldOptions[field]);
                } 
            }
        });
    }

}