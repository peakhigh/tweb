console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-trips-content', {
        gridData: moduleData,
        gridId: 'gridManageTrips',
        rowConfig: {
            template: 'grid-row-template'            
        }
    });
});
