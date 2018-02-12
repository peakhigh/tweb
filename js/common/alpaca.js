//Alpaca global settings
Alpaca.defaultErrorCallback = function (err) {
    // log it for our own purposes
    console.log("Behold!  An Alpaca error: " + JSON.stringify(err));
    // and throw a proper JS error
    throw new Error("Alpaca caught an error with the default error handler: " + JSON.stringify(error));
};

FORM_HELPER = new function (options) {
    this.setDefaultView = function (config, options) {
        config.view = options.view;
        if (!config.view) {
            if (options.bindings) {
                config.view = {
                    parent: "bootstrap-create-horizontal",
                    layout: {
                        template: "<div class='row'><div class='col-md-6' id='column-1'></div><div class='col-md-6' id='column-2'></div></div>"
                    }
                }
                if (config.view && config.view.layout) {
                    config.view.layout.bindings = options.bindings;
                }
            } else {
                config.view = "bootstrap-create-horizontal";
            }
        }
    }
    this.draw = function (elementSelector, config, extraOptions) {
        if (config) {
            //  $(elementSelector).html('{{> loading }}');
            //  $(elementSelector).html(Handlebars.compile($(elementSelector).html())({}));   

            //format schema accroding to the alpaca needs
            config = FORM_HELPER.formatConfig(config, extraOptions);
            //set view
            if (!config.view) {
                FORM_HELPER.setDefaultView(config, extraOptions);
            }
            //set form options like buttons etc
            FORM_HELPER.setFormDetails(elementSelector, config, extraOptions);
            if (extraOptions.type === 'modify') {
                config.options.hideInitValidationError = false;
            }
            //attach callbacks
            if (extraOptions.callbacks && extraOptions.callbacks.postRender) {
                config.postRender = function (control) {
                    if (extraOptions.type === 'modify') {
                        //enable the submit button in edit mode
                        $('.alpaca-form-button-submit').removeProp('disabled');
                        //  control.refreshValidationState(true);//refresh validation state on every submit
                        //  if (!control.isValid(true)) {//if not valid
                        //     control.focus();//focus on first error element                                
                        // } 
                    }
                    extraOptions.callbacks.postRender.apply(this, [control]);
                }
            }
            if (extraOptions.optionsOverride && Object.keys(extraOptions.optionsOverride).length > 0) {
                let processedOptionKeys = ['fields'];
                Object.keys(extraOptions.optionsOverride).forEach(function (key) {
                    if (processedOptionKeys.indexOf(key) < 0) {
                        config.options[key] = extraOptions.optionsOverride[key];//set options like focus, etc
                    }
                });
            }
            if (extraOptions.schemaOverride && Object.keys(extraOptions.schemaOverride).length > 0) {
                let processedOptionKeys = ['fields'];
                Object.keys(extraOptions.schemaOverride).forEach(function (key) {
                    if (processedOptionKeys.indexOf(key) < 0) {
                        config.schema[key] = extraOptions.schemaOverride[key];//set override schema options 
                    }
                });
            }
            config.error = function () {//configure error handler
                console.log('Form Render Errors', arguments);
            };
            $(elementSelector).alpaca(config);
        }
    }

    this.setFormDetails = function (elementSelector, config, options) {
        //set options -> form buttons       
        config.options.form = (options.optionsOverride && options.optionsOverride.form) ? options.optionsOverride.form : {};
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
        if (options.postUrl) {
            if (options.postUrl.indexOf('://') > 0) {
                config.options.form.attributes.action = options.postUrl;
            } else {
                if (options.postUrl.indexOf('/') === 0) {
                    options.postUrl = options.postUrl.substring(1, options.postUrl.length)
                }
                config.options.form.attributes.action = CONSTANTS.apiServer + options.postUrl;
            }
        }
        if (!config.options.form.buttons.submit.click) {
            config.options.form.buttons.submit.click = function () {
                //this.getValue() - gives you the json object of the form
                console.log(this.getValue());
                this.refreshValidationState(true);//refresh validation state on every submit
                if (!this.isValid(true)) {//if not valid
                    this.focus();//focus on first error element
                    return;
                }
                var promise = this.ajaxSubmit({
                    preSubmit: function (ajaxConfig) {

                         if (options.type === 'modify' && config.data && config.data._id && ajaxConfig.data && !ajaxConfig.data._id) {
                            //on modify, set _id to all the post requests
                            ajaxConfig.data._id = config.data._id;
                        }
                        
                        if (options.callbacks && options.callbacks.beforeSubmit) {
                            options.callbacks.beforeSubmit.apply(this, [ajaxConfig]);
                        }
                       
                    }
                });
                promise.done(function () {
                    console.log(JSON.stringify(arguments[0]));
                    if (options.callbacks && options.callbacks.afterSubmit) {
                        options.callbacks.afterSubmit.apply(this, []);
                    }
                });
                promise.fail(function () {
                    if (options.callbacks && options.callbacks.onSubmitError) {
                        options.callbacks.onSubmitError.apply(this, []);
                    }
                });
                promise.always(function () { });
            }
        }
    }
    this.formatConfig = function (config, extraOptions) {
        var formattedConfig = {};
        if (config && Object.keys(config).length > 0) {
            if (config.schema) {
                formattedConfig.schema = {
                    type: 'object',
                    properties: config.schema
                }
            } else {
                formattedConfig.schema = {
                    type: 'object',
                    properties: config
                }
            }
            formattedConfig.options = {
                fields: config.options || {}
            }
            if (config.data && !extraOptions.type) {
                extraOptions.type = 'modify';
                formattedConfig.data = config.data;
            } else {
                formattedConfig.data = {}
            }
            FORM_HELPER.formatFieldConfig(formattedConfig.schema.properties, formattedConfig.options.fields, formattedConfig.data,
                (extraOptions.schemaOverride && extraOptions.schemaOverride.fields) ? extraOptions.schemaOverride.fields : null,
                (extraOptions.optionsOverride && extraOptions.optionsOverride.fields) ? extraOptions.optionsOverride.fields : null, extraOptions);
        }
        return formattedConfig;
    }
    this.formatFieldConfig = function (schema, options, data, overrideFieldSchema, overrideFieldOptions, extraOptions) {
        Object.keys(schema).forEach((key) => {
            if (!schema[key].type && Array.isArray(schema[key])) {//array of objects [{}]/[string] etc
                //set schema of the field
                schema[key] = {
                    title: FORM_HELPER.getFieldTitle(key),
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: schema[key][0]
                    },
                    minItems: 1
                };
                //override schema of the field
                if (overrideFieldSchema && overrideFieldSchema[key]) {//override shcema from UI pespective
                    $.extend(true, schema[key], overrideFieldSchema[key]);
                }
                //set data of the field  
          //      if (!extraOptions.type || extraOptions.type === 'create') {//set default data in create mode to display controls by default
                    if (!data) {
                        data = {}
                    }
                    if (!data[key]) {
                        data[key] = [{}];
                    }
              //  }
                //set options of the field                                
                if (!options[key]) {
                    options[key] = {
                        items: {
                            fields: {}
                        }
                    };
                }
                //options -> set tool bar - default display at top with just add & remove options                
                options[key].toolbarSticky = true;
                options[key].actionbarStyle = "top";
                options[key].actionbar = {
                    actions: [{
                        action: "up",
                        enabled: false
                    }, {
                        action: "down",
                        enabled: false
                    }]
                }
                // override options of the field
                if (overrideFieldOptions && overrideFieldOptions[key]) { //override options from UI pespective
                    $.extend(true, options[key], overrideFieldOptions[key]);
                }
                //go for child items                    
                FORM_HELPER.formatFieldConfig(schema[key].items.properties, options[key].items.fields, data[key][0],
                    (overrideFieldSchema && overrideFieldSchema[key] && overrideFieldSchema[key].items && overrideFieldSchema[key].items.fields) ? overrideFieldSchema[key].items.fields : null,
                    (overrideFieldOptions && overrideFieldOptions[key] && overrideFieldOptions[key].items && overrideFieldOptions[key].items.fields) ? overrideFieldOptions[key].items.fields : null, extraOptions);
            } else if (!schema[key].type && typeof schema[key] === 'object') {//object
                //set schema of the field
                schema[key] = {
                    title: FORM_HELPER.getFieldTitle(key),
                    type: 'object',
                    properties: schema[key]
                };
                //override schema 
                if (overrideFieldSchema && overrideFieldSchema[key]) {//override shcema from UI pespective
                    $.extend(true, schema[key], overrideFieldSchema[key]);
                }

                //set data of the field
             //   if (!extraOptions.type || extraOptions.type === 'create') {
                    if (!data) {
                        data = {}
                    }
                    if (!data[key])
                        data[key] = {};
              //  }
                //set options of the field
                if (!options[key]) {
                    options[key] = { fields: {} };
                }
                //override options
                if (overrideFieldOptions && overrideFieldOptions[key]) {//override options from UI pespective
                    $.extend(true, options[key], overrideFieldOptions[key]);
                }
                FORM_HELPER.formatFieldConfig(schema[key].properties, options[key].fields, data[key],
                    ((overrideFieldSchema && overrideFieldSchema[key] && overrideFieldSchema[key].fields) ? overrideFieldSchema[key].fields : null),
                    ((overrideFieldOptions && overrideFieldOptions[key] && overrideFieldOptions[key].fields) ? overrideFieldOptions[key].fields : null), extraOptions);

            } else if (schema[key].type && Array.isArray(schema[key].type)) {//[string] etc    
                //set options of the field
                if (!options[key]) {
                    options[key] = {};
                }
                //set tool bar - default display at top with just add & remove options
                options[key].toolbarSticky = true;
                options[key].actionbarStyle = "top";
                options[key].actionbar = {
                    actions: [{
                        action: "up",
                        enabled: false
                    }, {
                        action: "down",
                        enabled: false
                    }]
                };
                //override options
                if (overrideFieldOptions && overrideFieldOptions[key]) {//override options from UI pespective
                    $.extend(true, options[key], overrideFieldOptions[key]);
                }
                //override backend options
                if (schema[key].form) {
                    $.extend(true, options[key], schema[key].form);
                    delete schema[key].form;
                }

                //set schema of the field
                var newSchema = {
                    title: FORM_HELPER.getFieldTitle(key),
                    type: 'array',
                    items: {
                        properties: {}
                    }
                };
                newSchema.items.type = schema[key].type[0].toLowerCase();
                delete schema[key].type;

                $.extend(true, newSchema, schema[key]);
                if (!extraOptions.type || extraOptions.type === 'create') {
                    newSchema.default = " ";
                }
                //override schema
                if (overrideFieldSchema && overrideFieldSchema[key]) {//override shcema from UI pespective
                    $.extend(true, newSchema, overrideFieldSchema[key]);
                }    
                schema[key] = newSchema;                                                       
            } else {//type=string/date/object/ etc  
                if (typeof schema[key] === 'object') {
                    schema[key].type = schema[key].type.toLowerCase();
                    //default for all types
                    if (!options[key]) {
                        options[key] = {};
                    }
                    if (schema[key].form && Object.keys(schema[key].form).length > 0) {//clone all form properties                          
                        $.extend(true, options[key], schema[key].form);
                        delete schema[key].form;
                    }

                    if (schema[key].type === 'date') {
                        if(schema[key].setmin == false){
                                options[key].picker = {
                                    defaultDate: new Date()
                                };
                        }else{
                                options[key].picker = {
                                    defaultDate: new Date()
                                    // minDate: new Date()
                                };//set also date format from constants here for all date time pickers  
                         }
                        
                        if (!schema[key].format) {
                            schema[key].format = "date";
                        } else {
                            options[key].picker.showClose = true;//show close button button for timepicker
                        }
                        schema[key].type = "string";
                    } else if (schema[key].type === 'objectid') {
                        schema[key].type = "string";
                    }

                    if (schema[key].format === 'phone') {
                        if (!data) {
                            data = {}
                        }
                        if (!data[key])
                            data[key] = '';
                    }

                    //override schema
                    if (overrideFieldSchema && overrideFieldSchema[key]) {//override shcema from UI pespective
                        $.extend(true, schema[key], overrideFieldSchema[key]);
                    }
                    //override options
                    if (overrideFieldOptions && overrideFieldOptions[key]) {//override options from UI pespective
                        $.extend(true, options[key], overrideFieldOptions[key]);
                    }
                }
            }
        });
    }
    this.getFieldTitle = (field) => {
        //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character            
        return field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
    };

    // this.setDefaults = function (schemaFields, fieldOptions, defaultData, formOptions, overrideFieldOptions, overrideFieldSchema) {
    //     Object.keys(schemaFields).forEach((field) => {
    //         if (schemaFields[field].type === 'array') {
    //             if (schemaFields[field].items.type === 'object') {
    //                 if (!schemaFields[field].minItems)
    //                     schemaFields[field].minItems = 1;
    //                 if (!formOptions.type || formOptions.type === 'create') {//set default data in create mode to display controls by default
    //                     if (!defaultData) {
    //                         defaultData = {}
    //                     }
    //                     if (!defaultData[field])
    //                         defaultData[field] = [{}];
    //                 }
    //                 if (!fieldOptions[field]) {
    //                     fieldOptions[field] = {};
    //                 }
    //                 if (!fieldOptions[field].items) {
    //                     fieldOptions[field].items = {};
    //                 }
    //                 if (!fieldOptions[field].items.fields) {
    //                     fieldOptions[field].items.fields = {};
    //                 }
    //                 //set tool bar - default display at top with just add & remove options
    //                 fieldOptions[field].toolbarSticky = true;
    //                 fieldOptions[field].actionbarStyle = "top";
    //                 fieldOptions[field].actionbar = {
    //                     actions: [{
    //                         action: "up",
    //                         enabled: false
    //                     }, {
    //                         action: "down",
    //                         enabled: false
    //                     }]
    //                 }
    //                 if (overrideFieldOptions && overrideFieldOptions[field]) { //override options from UI pespective
    //                     jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //                 }
    //                 if (overrideFieldSchema && overrideFieldSchema[field]) {//override shcema from UI pespective
    //                     jQuery.extend(true, schemaFields[field], overrideFieldSchema[field]);
    //                 }
    //                 //go for child items                    
    //                 FORM_HELPER.setDefaults(schemaFields[field].items.properties, fieldOptions[field].items.fields, defaultData[field][0], formOptions,
    //                     (overrideFieldOptions && overrideFieldOptions[field] && overrideFieldOptions[field].items && overrideFieldOptions[field].items.fields) ? overrideFieldOptions[field].items.fields : null,
    //                     (overrideFieldSchema && overrideFieldSchema[field] && overrideFieldSchema[field].items && overrideFieldSchema[field].items.fields) ? overrideFieldSchema[field].items.fields : null);
    //             } else if (schemaFields[field].items.type === 'string') {
    //                 if (!formOptions.type || formOptions.type === 'create') {
    //                     schemaFields[field].default = " ";
    //                 }
    //                 if (!fieldOptions[field]) {
    //                     fieldOptions[field] = {};
    //                 }
    //                 //set tool bar - default display at top with just add & remove options
    //                 fieldOptions[field].toolbarSticky = true;
    //                 fieldOptions[field].actionbarStyle = "top";
    //                 fieldOptions[field].actionbar = {
    //                     actions: [{
    //                         action: "up",
    //                         enabled: false
    //                     }, {
    //                         action: "down",
    //                         enabled: false
    //                     }]
    //                 }
    //                 if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
    //                     jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //                 }
    //                 if (overrideFieldSchema && overrideFieldSchema[field]) {//override shcema from UI pespective
    //                     jQuery.extend(true, schemaFields[field], overrideFieldSchema[field]);
    //                 }
    //             }
    //         } else if (schemaFields[field].type === 'object') {//set default data in create mode to display controls by default
    //             if (!formOptions.type || formOptions.type === 'create') {
    //                 if (!defaultData) {
    //                     defaultData = {}
    //                 }
    //                 if (!defaultData[field])
    //                     defaultData[field] = {};
    //             }
    //             if (!fieldOptions[field]) {
    //                 fieldOptions[field] = {};
    //             }
    //             if (!fieldOptions[field].fields) {
    //                 fieldOptions[field].fields = {};
    //             }
    //             if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
    //                 jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //             }
    //             if (overrideFieldSchema && overrideFieldSchema[field]) {//override shcema from UI pespective
    //                 jQuery.extend(true, schemaFields[field], overrideFieldSchema[field]);
    //             }
    //             FORM_HELPER.setDefaults(schemaFields[field].properties, fieldOptions[field].fields, defaultData[field], formOptions,
    //                 ((overrideFieldOptions && overrideFieldOptions[field] && overrideFieldOptions[field].fields) ? overrideFieldOptions[field].fields : null),
    //                 ((overrideFieldSchema && overrideFieldSchema[field] && overrideFieldSchema[field].fields) ? overrideFieldSchema[field].fields : null));
    //         } else if (schemaFields[field].type === 'date') {
    //             if (!fieldOptions[field]) {
    //                 fieldOptions[field] = {};
    //             }
    //             fieldOptions[field].picker = {};//set also date format from constants here for all date time pickers  

    //             if (!schemaFields[field].format) {
    //                 schemaFields[field].format = "date";
    //             } else {
    //                 fieldOptions[field].picker.showClose = true;//show close button button for timepicker
    //             }
    //             schemaFields[field].type = "string";
    //             if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
    //                 jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //             }
    //             if (overrideFieldSchema && overrideFieldSchema[field]) {//override shcema from UI pespective
    //                 jQuery.extend(true, schemaFields[field], overrideFieldSchema[field]);
    //             }
    //         } else if (schemaFields[field].type === 'objectid') {
    //             schemaFields[field].type = "string";
    //             if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
    //                 jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //             }
    //         } else {//for string, numbers etc
    //             if (!fieldOptions[field]) {
    //                 fieldOptions[field] = {};
    //             }
    //             if (schemaFields[field].format === 'phone') {
    //                 if (!defaultData) {
    //                     defaultData = {}
    //                 }
    //                 if (!defaultData[field])
    //                     defaultData[field] = '';
    //             }
    //             if (overrideFieldOptions && overrideFieldOptions[field]) {//override options from UI pespective
    //                 jQuery.extend(true, fieldOptions[field], overrideFieldOptions[field]);
    //             }
    //             if (overrideFieldSchema && overrideFieldSchema[field]) {//override shcema from UI pespective
    //                 jQuery.extend(true, schemaFields[field], overrideFieldSchema[field]);
    //             }
    //         }
    //     });
    // }
}