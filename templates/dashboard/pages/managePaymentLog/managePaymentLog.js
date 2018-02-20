console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    console.log(CURRENT_PAGE_CONFIG);
    var grid = new GRID_HELPER.GRID('.manage-paymentlog-content', {
        gridData: moduleData,
        gridId: 'gridManagePaymentLog',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.mark-received').click(function() {
                    markReceived(record);
                 });

                 $(rowElement).find('.decline').click(function() {
                    // MENU_HELPER.menuClick('addUser', 'manageUsers', {extraHref: record._id});
                 });
            }
         }
    });

    markReceived = function (record){
        var tripInfo = CURRENT_PAGE_CONFIG.extraOptions.tripDetails;
        if(record.transferType === 'InComing') {
                tripInfo.tripAdmin.balanceAmount = tripInfo.tripAdmin.totalAmount - record.amount;
        }else {
            tripInfo.truckAdmin.balanceAmount = tripInfo.truckAdmin.totalAmount - record.amount;
        }
        var options = {};
        options.formData = JSON.stringify(tripInfo);
        options.uri = "payments/service/markReceived";
        options.extraHref = "id="+record._id;
        options.type = 'POST';
        
            API_HELPER.postData(options, function (error, response) {
                if (error) {
                            console.log('error', error);
                            return;
                }
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            });
        } 
});


Handlebars.registerHelper('getGridOptions', function(status,id) {

    console.log(status);
    if(status === 'Pending'){
    return [{'option':'Mark Received','_id':id,'id':'mark-received'},
    {'option':'Decline','_id':id,'id':'decline'}]
    }
    return [];
});