console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.running-trucks-content', {
        gridData: moduleData,
        gridId: 'gridRunningTrucks',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                console.log(record);
                $(rowElement).find('.edit-truck').click(function() {
                    MENU_HELPER.menuClick('addTruck', 'manageTruck', {extraHref: record._id});
                });

                $(rowElement).find('.upload-doc-truck').click(function() {
                    MENU_HELPER.menuClick('uploadfiles', 'manageTruck', {extraHref: record._id});
                });
            }
         }
    });
});