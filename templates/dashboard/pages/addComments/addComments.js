// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var config = moduleData;
    config.data.comments = [{}];
    FORM_HELPER.draw(".add-comments-content", config, {
        schemaOverride: {
            fields: {
                comments: {   
                    maxItems: 1,
                    minItems:1,
                    title: "Comment",
                    items: {
                        properties: {
                            comment: {
                                title: ""
                            }
                        }
                    }
                }
            }
        },
        optionsOverride: {
            fields: {
                comments: {
                    toolbarSticky: false,
                     items:{
                         fields: {
                             comment: {
                                type: "textarea"
                             },
                             date: {
                                 hidden: true
                             },
                             commentedby: {
                                 hidden: true
                             }
                         }
                     }
                },
            },
              form: {
                buttons: {
                    submit: {
                        title: "Post"
                    }
                }
            }
        }, 
        postUrl: "trips/service/addComments",        
        callbacks: {
            beforeSubmit: function (config) {
            },
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });

    var moduleData = UTILS.getCurrentTemplateData();
    var test = {"data":moduleData.data.comments,"total":moduleData.data.comments.length};
    var grid = new GRID_HELPER.GRID('.list-comments-content', {
        gridData: test,
        gridId: 'gridComments',
        drawSort: false,
        drawFilters: false,
        drawPager: true,
        rowConfig: {            
            template: 'grid-row-template-details',
        }
    });
});