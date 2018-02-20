console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.truck-requests-content', {
        gridData: moduleData,
        gridId: 'gridTruckRequests',
        rowConfig: {            
            template: 'grid-row-template-details',         
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {

                $(rowElement).find('.approve-trip').click(function() {
                    var options = {};
                  //  options.extraHref = record._id;
                    options.data = record;
                    MENU_HELPER.menuClick('acceptTripReq', 'manageTrucks', options);
                });

                $(rowElement).find('.reject-trip').click(function() {
                    MENU_HELPER.menuClick('rejectTripReq', 'manageTrucks', {extraHref: record._id});
                });        
            }
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



    statusChanged = function(newStatus){
        var options = {
            data : {
                status: newStatus
            }
        };
        MENU_HELPER.menuClick('truckRequests','manageTrucks',options);
    }

 Handlebars.registerHelper('getGridOptions', function(status,id) {
       var options = [];
       var loggedInUser = API_HELPER.getLoggedInUser();
        switch (status){
            case 'Pending':
            options = [{'option':'approveTrip','_id':id,'id':'approve-trip'},
                    {'option':'rejectTrip','_id':id,'id':'reject-trip'}];
            break;
            case 'Approved':
            options = [];
            break;
            case 'Rejected':
            options = [];
            break;
        }
       
        return options;
}); 
});