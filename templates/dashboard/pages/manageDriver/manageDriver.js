console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-drivers-content', {
        gridData: moduleData,
        gridId: 'gridManageDrivers',
        rowConfig: {            
            template: 'grid-row-template-details'
         }
    });
});
