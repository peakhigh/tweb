//get total from backend
//grid plugin with header-template, data-template, data, paging options
//may be grid rendering should be handle bars templates
//should be like a grid plugin, not like a handle bars template

//set hooks flags and use them in the grid.html for checking if/else hook exists
GRID_HELPER = new function () {
    this.GRID = function (elementSelector, options) {
        /**
         * gridData: data to draw
         * gridId: unique grid identifier
         * preRender: callback before render
         * postRender: callback after render
         * dataTemplates: [], //load handler bar templates which can be used in the grid rows
         * headerTemplateId: 'grid-header-template'//pass a header template id
         * rowConfig: {//config for rows only
         *      template: //row template id
         *      rowId: //unique row identifier(can be handlebar template html) which can be used in post row render callbacks, can be used to change the html element
         *      preRender: callback (input = rowData) - return modified rowData which will be used in rendering
         *      postRender: callback (input = rowData, rowIdentifier) - return extra html which can be appened after row
         * }      
         */
        var me = this;
        me.element = $(elementSelector);
        me.template = Handlebars.compile('{{> grid }}');
        me.dataTemplate = Handlebars.compile('{{> griddata }}');
        me.options = {
            drawPager: true,
            drawSort: true,
            drawFilters: true
        };
        jQuery.extend(true, me.options, options);
        if (!me.options.gridId) {
            me.options.gridId = 'grid_' + (new Date()).getTime();
        }
        me.draw = function () {
            //draw grid
            $(elementSelector).html(me.template(me.options)); 
            if (me.options.rowConfig.optionsTemplate)   
                me.options.rowConfig.optionsTemplate = Handlebars.compile($('#' + me.options.rowConfig.optionsTemplate).html()); 
            // if (me.options.rowConfig.detailsTemplate)
            //     me.options.rowConfig.detailsTemplate = Handlebars.compile($('#' + me.options.rowConfig.detailsTemplate).html());
            me.attachRowHooks();      
            if (me.options.drawPager) {               
                if (!me.options.pagerConfig) {
                    me.options.pagerConfig = {}
                }
                if (!me.options.pagerConfig.total) {
                    me.options.pagerConfig.total = me.options.gridData.total || 0;
                }
                
                //deal the pager
                if ($(elementSelector).find('.pager-container')) {
                    me.pager = new GRID_HELPER.PAGER($(elementSelector).find('.pager-container'), me.options.pagerConfig, function(page, size) {
                         me.showLoading();
                         MENU_HELPER.reloadData({
                            data: {
                                skip: (page - 1) * size,
                                limit: size
                            }
                        }, function(response) {   
                            me.hideLoading();                         
                            me.redraw(response);
                        });
                    });
                }
            }
            if (me.options.drawSort) {
                me.sorter = new GRID_HELPER.SORTER($(elementSelector).find('.sort-container'), me.options.sortConfig, function(sortOptions) {
                  //  console.log(sortOptions);
                    var sort = {};
                    if (sortOptions && Array.isArray(sortOptions) && sortOptions.length > 0) {                        
                        sortOptions.forEach(function(entry) {
                            var details = entry.split('#');
                            if (details.length === 2) {
                                sort[details[0]] = (details[1] === 'asc') ? 1 : -1;
                            } else {
                                sort[details[0]] = 1;
                            }                            
                        });
                    } else if(typeof sortOptions === 'string') {
                        var details = sortOptions.split('#');
                        sort[sortOptions] = 1;
                        if (details.length === 2) {
                            sort[details[0]] = (details[1] === 'asc') ? 1 : -1;
                        } else {
                            sort[details[0]] = 1;
                        } 
                    }
                    me.showLoading();
                    MENU_HELPER.reloadData({
                        data: {
                            sort: sort
                        }
                    }, function(response) { 
                        me.hideLoading();                           
                        me.redraw(response);
                    });                    
                });
            }
            if (me.options.drawFilters) {  
                if (!me.options.filterConfig) {
                    me.options.filterConfig = {}
                }                          
                //deal the filters
                if ($(elementSelector).find('.filters-container')) {
                    me.filters = new GRID_HELPER.FILTERS($(elementSelector).find('.filters-container'), me.options, me.element, function(query) {
                         me.showLoading();
                         var data = {};
                         if (typeof query === 'string') {
                             data.queryStr = query;
                         } else {
                             data.query = query;
                         }
                         MENU_HELPER.reloadData({
                            data: data
                        }, function(response) {   
                            me.hideLoading();                         
                            me.redraw(response);
                        });
                    });
                }
            }
        }
        me.attachRowHooks = function() {
            //for all rows
            $('#' + me.options.gridId).find('.grid-row-default').each(function(index, row){
                if (me.options.rowConfig.click) {
                    $(row).bind('click', function(e) {
                        me.options.rowConfig.click(e, me.getRecordById($(row).attr('_id')), row);
                    });
                }
                if (me.options.rowConfig.hover) {
                    $(row).bind('mouseover', function(e) {
                        if (!me.currentHoverRowId || $(row).attr('_id') !== me.currentHoverRowId) {
                            me.options.rowConfig.hover(e, me.getRecordById($(row).attr('_id')), row);
                            me.currentHoverRowId = $(row).attr('_id');
                        }                        
                    });
                }
                // if (me.options.rowConfig.detailsTemplate) {
                //     $(row).bind(me.options.rowConfig.detailsEvent || 'mouseover', function(e) {                        
                //         if (!me.currentDetailsRowId || $(row).attr('_id') !== me.currentDetailsRowId) {
                //             $('#'+me.options.gridId).find('.grid-row-details-default').hide(250);
                //             if (!$(row).find('.grid-row-details-default').data('rendered')) {
                //                 $(row).find('.grid-row-details-default').html(me.options.rowConfig.detailsTemplate(me.getRecordById($(row).attr('_id'))));
                //                 $(row).find('.grid-row-details-default').data('rendered', true);
                //             }                            
                //             $(row).find('.grid-row-details-default').slideDown(250);
                //             me.currentDetailsRowId = $(row).attr('_id');
                //         }                        
                //     });
                // }
                if (me.options.rowConfig.optionsTemplate) {
                    $(row).find('.grid-row-option-icon').on('mouseover click', function(e) {    
                        if (!me.currentOptionsRowId || $(row).attr('_id') !== me.currentOptionsRowId) {
                            //new visit to a row                            
                            $('#'+me.options.gridId).find('.grid-row-options-default').hide(250);
                            if (!$(row).find('.grid-row-options-default').data('rendered')) {
                                var record = me.getRecordById($(row).attr('_id'));
                                //$(row).find('.grid-row-options-default .grid-row-options-panel').html(me.options.rowConfig.optionsTemplate(record));
                                $(row).find('.grid-row-options-default').html(me.options.rowConfig.optionsTemplate(record));
                                $(row).find('.grid-row-options-default').data('rendered', true);
                                if (me.options.rowConfig.optionsPostRender) {
                                    me.options.rowConfig.optionsPostRender($(row).find('.grid-row-options-default'), record);
                                }
                            }                            
                            $(row).find('.grid-row-options-default').slideDown(250);
                            me.currentOptionsRowId = $(row).attr('_id');
                        } else if (me.currentOptionsRowId && $(row).attr('_id') === me.currentOptionsRowId) {
                            //existing row
                            if (e.type === 'click') {
                                if ($(row).find('.grid-row-options-default').is(':visible')) {
                                    $(row).find('.grid-row-options-default').hide(250);
                                } else {
                                    $(row).find('.grid-row-options-default').show(250);
                                }                             
                            }  
                        }                       
                    });
                    // $(row).bind(me.options.rowConfig.optionsEvent || 'mouseover', function(e) {                        
                    //     if (!me.currentOptionsRowId || $(row).attr('_id') !== me.currentOptionsRowId) {
                    //         $('#'+me.options.gridId).find('.grid-row-options-default').hide(250);
                    //         if (!$(row).find('.grid-row-options-default').data('rendered')) {
                    //             var record = me.getRecordById($(row).attr('_id'));
                    //             $(row).find('.grid-row-options-default').html(me.options.rowConfig.optionsTemplate(record));
                    //             $(row).find('.grid-row-options-default').data('rendered', true);
                    //             if (me.options.rowConfig.optionsPostRender) {
                    //                 me.options.rowConfig.optionsPostRender($(row).find('.grid-row-options-default'), record);
                    //             }
                    //         }                            
                    //         $(row).find('.grid-row-options-default').slideDown(250);
                    //         me.currentOptionsRowId = $(row).attr('_id');
                    //     }                        
                    // });
                }
            });
        }
        me.getRecordById = function(id) {
            if (me.options.gridData && me.options.gridData.data && Array.isArray(me.options.gridData.data)) {
                for(var i=0;i<me.options.gridData.data.length;i++) {
                    if(me.options.gridData.data[i]._id === id) {
                        return me.options.gridData.data[i];
                    }
                }               
            }
            return {};
        }
        me.showLoading = function() {
            $('#' + me.options.gridId).html('<div style="font-size:24px;text-align:center;width:100%;margin-top: 100px;">Loading...</div>');//show loading image - TODO
        }
        me.hideLoading = function() {
            $('#' + me.options.gridId).html('');
        }
        me.redraw = function(response) {
        //    console.log(response);
            me.options.gridData = response;
            $('#' + me.options.gridId).html(me.dataTemplate(me.options));
            me.attachRowHooks();
        }
        me.reload = function(options){
            var me = this;
            me.showLoading();
            MENU_HELPER.reloadData({
               data: options
           }, function(response) {   
               me.hideLoading();                         
               me.redraw(response);
           });
        }
        
        me.draw();
        return me;
    }
   
    this.PAGER = function (elementSelector, options, callback) {
        var me = this;
        me.template = Handlebars.compile('{{> pager }}');
        me.options = {
            current: 0,
            total: 0,
            size: CONSTANTS.gridPageSize,
            displayStart: 1,
            displayEnd: 0
        };
        jQuery.extend(true, me.options, options);
        //set defaults
        if (!me.options.pagerId) {
            me.options.pagerId = 'pager_' + (new Date()).getTime();
        }
        if (!me.options.total) {
            me.options.pageCount = 0;
            me.options.current = 0;
        } else {
            me.options.pageCount = Math.ceil(parseInt(options.total) / me.options.size);            
        }
        if (!me.options.current) {
            me.options.current = 1;
        }        
        
        me.draw = function () {
            me.element = $(elementSelector);
            me.element.html(me.template(me.options));  

            me.prevButton = me.element.find('.pager-button-prev');
            me.prevButton.click(me.goToPrevious);
            if (!me.options.current || parseInt(me.options.current) === 1) {
                me.prevButton.attr('disabled', 'true');
            }

            me.nextButton = me.element.find('.pager-button-next');
            me.nextButton.click(me.goToNext);                    
            if (me.options.pageCount === null || parseInt(me.options.pageCount) === 1) {
                me.nextButton.attr('disabled', 'true');
            }
            
            me.changeControl = me.element.find('input');
            me.changeControl.bind('input', function () {
                this.value = this.value.replace(/[^0-9.]/g, '');
                this.value = this.value.replace(/(\..*)\./g, '$1');
                if (parseInt(this.value) > me.options.pageCount) {
                    this.value = me.options.pageCount;
                }
                if (parseInt(this.value) <= 0) {
                    this.value = 1;
                }
                clearTimeout(me.timer);
                var pagerField = this;
                me.timer = setTimeout(function () {
                    me.setCurrentPage(pagerField.value);
                }, 500);
            });
            me.changeControl.bind('focus', function () {
                this.value = '';
            });
            me.changeControl.bind('blur', function () {
                if (!this.value) {
                    this.value = me.options.current;
                }
            });
        }

        me.getCurrentPage = function () {
            return parseInt(me.options.current);
        }
        me.setCurrentPage = function (page, noRefresh) {
            if (page) {
                me.changeControl.val(page);
                me.options.current = page;
                if (page > 1) {
                    me.prevButton.removeAttr('disabled');
                } else {
                    me.prevButton.attr('disabled', 'true');
                }
                if (page < me.options.pageCount) {
                    me.nextButton.removeAttr('disabled');
                } else {
                    me.nextButton.attr('disabled', 'true');
                }
                if (!me.options.callback) {
                    me.options.callback = callback;
                }
                if ((noRefresh === null || noRefresh === undefined || noRefresh === false) && me.options.callback)
                    me.options.callback(page, me.options.size);
                me.setDisplayStartEnds();
            }
        }
        me.goToPrevious = function () {
            var currentPage = me.getCurrentPage();
            if (currentPage > 1) {
                currentPage = currentPage - 1;
                me.setCurrentPage(currentPage);
            }
            return currentPage;
        }
        me.goToNext = function () {
            var currentPage = me.getCurrentPage();
            if (currentPage < me.options.pageCount) {
                currentPage = currentPage + 1;
                me.setCurrentPage(currentPage);
            }
            return currentPage;
        }
        me.setTotal = function (total) {
            me.options.total = total;
            me.options.pageCount = Math.ceil(parseInt(options.total) / me.options.size);
            me.element.find('.pager-total').html(me.options.pageCount + ' pages');
            if (me.options.pageCount > 1) {
                me.nextButton.removeAttr('disabled');
            }
            me.setDisplayStartEnds();
        }
        me.setDisplayStartEnds = function() {
            me.options.displayStart = (me.options.size * (me.options.current - 1)) || 1;
            me.options.displayEnd = me.options.size * me.options.current;
            if (me.options.displayEnd > me.options.total) {
                me.options.displayEnd = me.options.total;
            }
        }
        me.show = function () {
            me.element.removeClass('hideEle');
        }
        me.hide = function () {
            me.element.addClass('hideEle');
        }

        me.setDisplayStartEnds();
        me.draw();
        return me;
    }

    this.SORTER = function (elementSelector, options, callback) {
        var me = this;
        me.template = Handlebars.compile('{{> gridsort }}');
        me.options = {
            multiple: true
        };
        jQuery.extend(true, me.options, options);
        //set defaults
        if (!me.options.sortId) {
            me.options.sortId = 'sorter_' + (new Date()).getTime();
        }        
        
        me.draw = function () {
            me.element = $(elementSelector);
            $(elementSelector).hide()
            me.element.html(me.template(me.options)); 
            $('#'+me.options.sortId).multiselect({
                buttonWidth: '250px',
                nonSelectedText: 'Sort By',
                onChange: function(option, checked, select) {
                    if (checked) {
                        var unselect = option.val().split('#')[1] === 'asc' ? (option.val().split('#')[0] + '#desc') : (option.val().split('#')[0] + '#asc');                        
                        $('#'+me.options.sortId).multiselect('deselect', unselect);                        
                    }
                    callback($('#'+me.options.sortId).val());
                },
                buttonText: function(options, select) {
                    if (options.length === 0) {
                        return 'Sort By'; 
                    } else if (options.length === 1) {
                        return $(select).find('optgroup[key="'+options.attr('key')+'"]').attr('label') + ' - ' + options.html();
                    } else {
                        return options.length + ' Sort options selected';
                    }       
                }
            });             
            me.element.find('optgroup[selected="true"]').each(function(index, ele) {
                var order = $(ele).attr('order') || 'asc';
                $(ele).find('option[value="' + $(ele).attr('key') + '#' + order+'"]').prop('selected', true);
            });
            $('#'+me.options.sortId).multiselect('rebuild');
            $(elementSelector).show();
        }

        me.draw();
        return me;
    }

    this.FILTERS = function (elementSelector, options, gridElement, callback) {
        var me = this;        
        me.options = {
            type: 'default',
            placeholder: 'Search'
        };
        jQuery.extend(true, me.options, options.filterConfig);
        //set defaults
        if (!me.options.filtersPanelId) {
            me.options.filtersPanelId = 'filters_' + (new Date()).getTime();
        }

        me.getFilterFields = function (schema, filterSchema, overrideConfig, keyPath) {
            if (!keyPath) {
                keyPath = '';
            }
             if(!schema){
                schema='';
            } 
            Object.keys(schema).forEach((key) => {
                var tKey = (keyPath ? (keyPath+'.'+key) : key);
                if (!schema[key].title && Array.isArray(schema[key])) {
                    me.getFilterFields(schema[key][0], filterSchema, overrideConfig, tKey);
                } else if (!schema[key].title && typeof schema[key] === 'object') {//object
                    me.getFilterFields(schema[key], filterSchema, overrideConfig, tKey);
                } else {
                    if (schema[key].filterConfig) {   
                        var fieldConfig = {};

                        fieldConfig = schema[key].filterConfig;
                        if (overrideConfig && overrideConfig[tKey]) {
                            $.extend(true, fieldConfig, overrideConfig[tKey]);
                        }
                        if (fieldConfig.rangeField) {                
                            filterSchema[tKey+'_start'] = {};
                            $.extend(true, filterSchema[tKey+'_start'], fieldConfig);
                            filterSchema[tKey+'_start'].title += ' Start';
                            filterSchema[tKey+'_start'].rangeStart = true;
                            filterSchema[tKey+'_end'] = {};   
                            $.extend(true, filterSchema[tKey+'_end'], fieldConfig);
                            filterSchema[tKey+'_end'].title += ' End';
                            filterSchema[tKey+'_end'].rangeEnd = true;   
                        } else {
                            filterSchema[tKey] = fieldConfig;   
                        }                                        
                    }                    
                }
            });
        }

        me.draw = function () {
            me.element = $(elementSelector);            
            me.previousQuery = '';
            me.filterSchema =  {};
            me.formOptions = {
                optionsOverride: {
                    focus: '',
                    form: {
                        buttons: {
                            submit: {
                                title: "Search",
                                click: function() {                                   
                                    var query = {};
                                    var values = this.getValue();
                                    var filters = {};
                                    //create filters by adjusting range filters etc
                                    Object.keys(values).forEach(function(field) {
                                        // console.log(field, values[field]);
                                        if (field.endsWith('_start') || field.endsWith('_end')) {//indicates range filter
                                            var fieldName = field.substring(0, field.length - (field.endsWith('_start') ? 6 : 4));
                                            if (!filters[fieldName])
                                                filters[fieldName] = {};                                            
                                            if (field.endsWith('_start')) {
                                                filters[fieldName]['$gte'] = values[field];
                                            } else if (field.endsWith('_end')) {
                                                filters[fieldName]['$lt'] = values[field];
                                            }                                            
                                        } else {
                                            filters[field] = values[field];
                                        }
                                    }); 
                                  //    console.log(filters);
                                      if (callback) {
                                        callback(filters);
                                    }
                                    return false;                                 
                                }
                            },
                            reset: {}
                        }
                    }
                }            
            }
            if (options.filterConfig.formOptions) {
                $.extend(true, me.formOptions, options.filterConfig.formOptions);
            }
            // me.formOptions = options.filterConfig.formOptions || {};

            me.getFilterFields(options.gridData.schema, me.filterSchema, (me.formOptions.schemaOverride && me.formOptions.schemaOverride.fields) ? me.formOptions.schemaOverride.fields : {});
            delete me.formOptions.schemaOverride;
      //      console.log(me.filterSchema);
            if (Object.keys(me.filterSchema).length > 0) {
                me.options.moreFilters = true;    
            }
            if (me.options.type === 'default') { //deal with default filters
                me.template = Handlebars.compile('{{> griddefaultfilters }}');
                me.element.html(me.template(me.options));

                //default search handler - so that we can call from multiple places
                me.defaultSearchHandler = function() {
                    me.currentQuery = me.element.find( ".search-control" ).val();
                    if (me.previousQuery !== me.currentQuery) {
                        if (callback) {
                            callback(me.currentQuery);
                        }
                        me.previousQuery = me.currentQuery;
                    }                    
                }

                //attach search events - input enter event
                me.element.find( ".search-control" ).keypress(function( event ) {
                    if ( event.which == 13 ) {
                        me.defaultSearchHandler();
                    }                    
                });

                //attach search events -- search icon click
                me.element.find( ".search-button" ).click(function() {
                    me.defaultSearchHandler();
                });

                //attach more filters click
                me.element.find( ".grid-more-filters-button" ).click(function() {
                    if ($(this).text().trim() === "More Filters") {
                        me.drawMoreFilters();
                    } else {
                        me.hideMoreFilters();
                    }
                });                                                
            }             
        }

        me.drawMoreFilters = function() {            
            if (me.options.moreFilters) {
                gridElement.find( ".grid-more-filters-container" ).show();
                if (!me.options.moreFiltersDrawn) {
                    FORM_HELPER.draw(gridElement.find( ".grid-more-filters-container" ), {
                        schema: me.filterSchema
                    }, me.formOptions);
                    me.options.moreFiltersDrawn = true;
                }                 
                me.element.find( ".grid-more-filters-button" ).html('Hide Filters');       
            }
        }

        me.hideMoreFilters = function() {  
            gridElement.find( ".grid-more-filters-container" ).hide();
            me.element.find( ".grid-more-filters-button" ).html('More Filters');  
        }

        me.draw();
        return me;
    }
}