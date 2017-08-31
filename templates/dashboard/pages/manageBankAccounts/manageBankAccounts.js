// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    

    var grid = new GRID_HELPER.GRID('.manage-accounts-content', {
        gridData: moduleData,
        gridId: 'gridAccounts',
        drawSort: false,
        drawFilters: false,
        drawPager: true,
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
            optionsPostRender: function(rowElement, record) {
               console.log(record);
               $(rowElement).find('.edit-account').click(function() {
                   MENU_HELPER.menuClick('addBankAccount', 'manageBankAccounts', {extraHref: record._id});
               });
            }
        }
    });
  
});