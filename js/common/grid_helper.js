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
        me.template = Handlebars.compile('{{> grid }}');
        me.dataTemplate = Handlebars.compile('{{> griddata }}');
        me.options = {
            drawPager: true
        };
        jQuery.extend(true, me.options, options);
        if (!me.options.gridId) {
            me.options.gridId = 'grid_' + (new Date()).getTime();
        }
        me.draw = function () {
            //draw grid
            $(elementSelector).html(me.template(me.options));
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
                         MENU_HELPER.reloadData({
                            data: {
                                skip: (page - 1) * size
                            }
                        }, function(response) {                            
                            me.redraw(response);
                        });
                    });
                }
            }
        }
        me.redraw = function(response) {
            console.log(response);
            me.options.gridData = response;
            $('#' + me.options.gridId).html(me.dataTemplate(me.options));
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
            size: CONSTANTS.gridPageSize
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
        }
        me.show = function () {
            me.element.removeClass('hideEle');
        }
        me.hide = function () {
            me.element.addClass('hideEle');
        }

        me.draw();
        return me;
    }
}