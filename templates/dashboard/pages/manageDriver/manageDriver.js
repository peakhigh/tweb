console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-drivers-content', {
        gridData: moduleData,
        gridId: 'gridManageDrivers',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {

            	$(rowElement).find('.edit-driver').click(function() {
                    MENU_HELPER.menuClick('addDriver', 'manageDriver', {extraHref: record._id});
                });

                $(rowElement).find('.upload-doc-driver').click(function() {
                    MENU_HELPER.menuClick('uploadfiles', 'manageDriver', {extraHref: record._id});
                });
            }
         }
    });
});
