console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-trips-content', {
        gridData: moduleData,
        gridId: 'gridManageTrips',
        rowConfig: {            
            template: 'grid-row-template-details',         
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.edit-trip').click(function() {
                    MENU_HELPER.menuClick('addTripMin', 'manageTrip', {extraHref: record._id});
                });

              /*   $(rowElement).find('.set-status-trip').click(function() {
                    MENU_HELPER.menuClick('setStatus', 'manageTrip', {extraHref: record._id});
                }); */
                $(rowElement).find('.edit-trip').click(function() {
                    MENU_HELPER.menuClick('addTripMin', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.comments-trip').click(function() {
                    MENU_HELPER.menuClick('addComments', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.docs-trip').click(function() {
                    MENU_HELPER.menuClick('uploadDocs', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.viewdetails').click(function() {
                    MENU_HELPER.menuClick('viewTripDetails', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.payment').click(function() {
                    MENU_HELPER.menuClick('tripPayment', 'manageTrip', {extraHref: record._id});
                });


                $(rowElement).find('.cancel-trip').click(function() {
                    MENU_HELPER.menuClick('cancelTrip', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.approve-quote').click(function() {
                    approveQuote(record);
                });

                  $(rowElement).find('.reject-bid').click(function() {
                      var options = {};
                        options.formData = JSON.stringify({ truckDetails : record});
                        options.uri = "requests/service/setStatus";
                        options.extraHref = "id="+record._id+"&status=Rejected";
                        options.type = 'POST';
                        
                            API_HELPER.postData(options, function (error, response) {
                                if (error) {
                                            console.log('error', error);
                                            return;
                                }
                            });
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
        //drawFilters: true,
        filterConfig: {
            type: 'default',//hybrid/
            order: [],
            formOptions: {
                bindings: {
                    'pickup.date_start': "column-1",
                    'pickup.date_end': "column-2",
                    'drop.date_start': "column-1",
                    'drop.date_end': "column-2",
                    status: "column-1"
                },
                schemaOverride: {
                    fields: {
                        'pickup.date': {
                            title: 'Pickup Date',
                            format: 'date',
                            rangeField: true
                        },
                        'drop.date': {
                            title: 'Drop Date',
                            format: 'date',
                            rangeField: true
                        },
                        'status': {
                            default: 'Running'
                            // default: 'None'                            
                        }
                    }                    
                },
                optionsOverride: {
                    fields: {
                        'pickup.date_start': {
                            order: 1
                        },
                        'pickup.date_end': {
                            order: 2
                        },
                        'drop.date_start': {
                            order: 3
                        },
                        'drop.date_end': {
                            order: 4
                        },
                        status: {
                            order: 5
                        }
                    }                               
                }           
            }            
        }        
    });

//    $(".dropdown").find(".btn BtnCaption").text(moduleData.status);
    statusChanged = function(newStatus){
        var options = {
            data : {
                status: newStatus
            }
        };
        currentStatus = newStatus;
//        $(".dropdown").find(".btn BtnCaption").text(newStatus);
        MENU_HELPER.menuClick('manageTrip','manageTrip',options);
    }



    approveQuote =  function (record){
      
        var source = $('#viewquotesmodal').html(); 
         var template1 = Handlebars.compile(source);
        $('body').append(template1());    
         $('#viewquotesmodalid').modal({show: true, background: true});      

         $("#yes").click(function(){
            var options = {};
            options.formData = JSON.stringify({ tripDetails : record});
            options.uri = "trips/service/setStatus";
            options.extraHref = "id="+record._id+"&status=Paymentpending";
            options.type = 'POST';
            
                API_HELPER.postData(options, function (error, response) {
                    if (error) {
                                console.log('error', error);
                                return;
                    }
                    MENU_HELPER.menuClick('paymentPending', 'manageTrip', {extraHref: record._id});
                }); 

                $('#viewquotesmodalid').modal('hide');   
        });
   }
});

 Handlebars.registerHelper('getGridOptions', function(status,id) {
        switch (status){
            case 'New':
            return [{'option':'Edit','_id':id,'id':'edit-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Cancel Trip','_id':id,'id':'cancel-trip'}];
            break;
            case 'Quoted':
            return [{'option':'Edit','_id':id,'id':'edit-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Approve','_id':id,'id':'approve-quote'},
                    {'option':'Reject Trip','_id':id,'id':'reject-quote'},
                    {'option':'Cancel Trip','_id':id,'id':'cancel-trip'}];
            break;
            case 'Paymentpending':
            return [{'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'ViewDetails','_id':id,'id':'viewdetails'},
                    {'option':'Payment','_id':id,'id':'payment'}];
            break;
            case 'Running':
            case 'Assigned':
            case 'Successful':
            return [{'option':'ViewDetails','_id':id,'id':'viewdetails'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Documents','_id':id,'id':'docs-trip'}];
            break;
            case 'Cancelled':
            return [{'option':'ViewDetails','_id':id,'id':'viewdetails'}];
            break;
        }
}); 
