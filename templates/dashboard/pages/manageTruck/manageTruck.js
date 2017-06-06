console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-trucks-content', {
        gridData: moduleData,
        gridId: 'gridManageTrucks',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                console.log(record);
                $(rowElement).find('.edit-truck').click(function() {
                    MENU_HELPER.menuClick('addTruck', 'manageTruck', {extraHref: record._id});
                });
            }
         }
    });
});