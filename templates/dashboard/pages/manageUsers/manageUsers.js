console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-users-content', {
        gridData: moduleData,
        gridId: 'gridManageUsers',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.edit-user').click(function() {
                    MENU_HELPER.menuClick('addUser', 'manageUsers', {extraHref: record._id});
                });
            }
         }
    });
});