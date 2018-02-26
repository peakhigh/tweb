console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.payments-content', {
        gridData: moduleData,
        gridId: 'gridPayments',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.log-payment').click(function() {
                    MENU_HELPER.menuClick('logPaymentDetails', 'manageTrip', {extraHref: record._id});
                });
                $(rowElement).find('.managePaymentLog').click(function() {
                    var options = {
                         tripDetails: record,
                        extraHref: record._id
                    };

                     MENU_HELPER.menuClick('managePaymentLog', 'manageTrip',options);
                 });

                 $(rowElement).find('.mark-received').click(function() {
                    // MENU_HELPER.menuClick('addUser', 'manageUsers', {extraHref: record._id});
                 });
            }
         }
    });

    statusChanged = function(newStatus){
        var options = {
            data : {
                status: newStatus
            }
        };
        MENU_HELPER.menuClick('payments','payments',options);
    }
});


Handlebars.registerHelper('getPaymentGridOptions', function(status,id) {
    return [{'option':'Payment logs','_id':id,'id':'managePaymentLog'},
    {'option':'Cancel','_id':id,'id':'cancel'}];
    if(loggedInUser.role != 'TRUCK_ADMIN'){
        options.push({'option':'Notify Payment','_id':id,'id':'log-payment'});       
    }
   /*  switch (status){
        case 'Paid':
        return [{'option':'Log Payment','_id':id,'id':'LogPaymentDetails'},
                {'option':'Detailed logs','_id':id,'id':'managePaymentLog'},
                {'option':'Cancel','_id':id,'id':'cancel'}]
        break;
        case 'PendingPayments':
        return [{'option':'Log Payment','_id':id,'id':'LogPaymentDetails'},
        {'option':'Detailed logs','_id':id,'id':'managePaymentLog'},
        {'option':'Cancel','_id':id,'id':'cancel'}]
        break;
        case 'PendingReceivable':
        return [{'option':'Comments','_id':id,'id':'comments'},
                {'option':'Mark Received','_id':id,'id':'mark-received'},
                {'option':'Cancel','_id':id,'id':'cancel'}];
        break;
        case 'Received':
        return [];
        break;
    } */
});