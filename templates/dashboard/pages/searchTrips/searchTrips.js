console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.search-trips-content', {
        gridData: moduleData,
        gridId: 'gridSearchTrips',
        rowConfig: {            
            template: 'grid-row-template-details',
            // detailsTemplate: 'grid-row-template-details', 
            //detailsEvent: 'mouseover',           
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
            //    console.log(record);
               
                $(rowElement).find('.quote-trip').click(function() {  
                    MENU_HELPER.menuClick('setQuote', 'manageTruck', {extraHref: record._id});
                });

                $(rowElement).find('.comments-trip').click(function() {
                    MENU_HELPER.menuClick('addComments', 'manageTruck', {extraHref: record._id});
                });
            }
            // click: function() {
            //     console.log(arguments);
            // }, 
            // hover: function() {
            //     console.log(arguments);
            // }   
        }, 
        sortConfig: {
            multiple: false,
            options: [
                {
                    title: 'Pickup Date',
                    key: 'pickup.date',
                    selected: true,
                    order: 'desc'                 
                },
                {
                    title: 'Drop Date',
                    key: 'drop.date'             
                },
                {
                    title: 'Material Value',
                    key: 'pickup.material.approximateCost'                  
                }
            ]
        },
        filterConfig: {
             defaultFilters: true,
             advancedfilters: true        
         }
    });
});
