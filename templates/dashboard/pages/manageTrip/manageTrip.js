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
                    MENU_HELPER.menuClick('logPaymentDetails', 'manageTrip', {extraHref: record._id});
                });


                $(rowElement).find('.cancel-trip').click(function() {
                    MENU_HELPER.menuClick('cancelTrip', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.approve-quote').click(function() {
                    approveQuote(record);
                });


                $(rowElement).find('.quote-trip').click(function() {
                    MENU_HELPER.menuClick('setTripQuote', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.status-trip').click(function() {
                    MENU_HELPER.menuClick('setTripStatus', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.setlocation').click(function() {
                    MENU_HELPER.menuClick('setLocation', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.assigntruck').click(function() {
                    MENU_HELPER.menuClick('assignTruck', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.approvepayment').click(function() {
                    approveTrip(record);
                });

                  $(rowElement).find('.reject-quote').click(function() {
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
                            MENU_HELPER.menuClick('manageTrip', 'manageTrip');
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

   approveTrip = function (record){
    var options = {};
    options.formData = JSON.stringify({ truckDetails : record});
    options.uri = "trips/service/setStatus";
    options.extraHref = "id="+record._id+"&status=Approved";
    options.type = 'POST';
    
        API_HELPER.postData(options, function (error, response) {
            if (error) {
                        console.log('error', error);
                        return;
            }
            MENU_HELPER.menuClick('manageTrip', 'manageTrip');
        });
    } 

    /**
     * callback from the HTML
     */
    statusChanged = function(newStatus){
        
        var options = {
            data : {
                status: newStatus
            }
        };
        if(newStatus === 'All'){
            options.data = {};   
        }
        MENU_HELPER.menuClick('manageTrip','manageTrip',options);
    }



    approveQuote =  function (record){
      
        var source = $('#viewquotesmodal').html(); 
         var template1 = Handlebars.compile(source);
        $('body').append(template1());    
         $('#viewquotesmodalid').modal({show: true, background: true});      

         $("#yes").click(function(){
            var options = {};
            options.formData = JSON.stringify(record);
            options.uri = "trips/service/approveTripQuote";
            options.extraHref = "id="+record._id+"&status=PaymentPending";
            options.type = 'POST';
            
            setDefaultQuote(record);
            
            API_HELPER.postData(options, function (error, response) {
                    if (error) {
                                console.log('error', error);
                                return;
                    }
                    MENU_HELPER.menuClick('manageTrip', 'manageTrip', {extraHref: record._id});
                }); 
             $('#viewquotesmodalid').modal('hide');   
        });
   }

   setDefaultQuote = function(record){
    var options = {};
    options.formData = JSON.stringify({ tripDetails : record});
    options.uri = "trips/service/setDefaultQuote";
    options.type = 'POST';
    
        API_HELPER.postData(options, function (error, response) {
            if (error) {
                        console.log('error', error);
                        return;
            }
        }); 
   }
});


 Handlebars.registerHelper('getGridOptions', function(status,id) {
       var options = [];
       var loggedInUser = API_HELPER.getLoggedInUser();
        switch (status){
            case 'New':
            options = [{'option':'Edit','_id':id,'id':'edit-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Cancel Trip','_id':id,'id':'cancel-trip'}];
            if(loggedInUser.role === 'CALL_CENTER_USER'){
                options.push({'option':'Quote','_id':id,'id':'quote-trip'});       
            }
            break;
            case 'Quoted':
            options = [{'option':'Edit','_id':id,'id':'edit-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Approve Quote','_id':id,'id':'approve-quote'},
                    {'option':'Reject Quote','_id':id,'id':'reject-quote'},
                    {'option':'Cancel Trip','_id':id,'id':'cancel-trip'}];
            break;
            case 'PaymentPending':
            options = [{'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Details','_id':id,'id':'viewdetails'},
                    {'option':'Payment','_id':id,'id':'payment'}];
            break;
             case 'PaymentMade':
            options = [{'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Details','_id':id,'id':'viewdetails'}];
                    if(loggedInUser.role === 'CALL_CENTER_USER'){
                        options.push({'option':'Approve','_id':id,'id':'approvepayment'});       
                    }         
            break; 
            case 'Approved':
            options = [{'option':'Docs','_id':id,'id':'docs-trip'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Details','_id':id,'id':'viewdetails'}];

                    if(loggedInUser.role === 'CALL_CENTER_USER'){
                        options.push({'option':'Assign Truck','_id':id,'id':'assigntruck'});       
                    }            
                    
            break;
            case 'Running':
            options = [{'option':'Details','_id':id,'id':'viewdetails'},
            {'option':'Comments','_id':id,'id':'comments-trip'},
            {'option':'Docs','_id':id,'id':'docs-trip'}];
            if(loggedInUser.role === 'CALL_CENTER_USER'){
                options.push({'option':'Location','_id':id,'id':'setlocation'});       
            }
            break;
            case 'Assigned':
            case 'Successful':
            options = [{'option':'Details','_id':id,'id':'viewdetails'},
                    {'option':'Comments','_id':id,'id':'comments-trip'},
                    {'option':'Docs','_id':id,'id':'docs-trip'}];

            if(loggedInUser.role === 'CALL_CENTER_USER'){
                        options.push({'option':'Status','_id':id,'id':'status-trip'});       
            }
            break;
            case 'Cancelled':
            options = [{'option':'Details','_id':id,'id':'viewdetails'}];
            break;
        }
       
        return options;
}); 
