console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-trips-content', {
        gridData: moduleData,
        gridId: 'gridManageTrips',
        rowConfig: {            
            template: 'grid-row-template-details',
            // detailsTemplate: 'grid-row-template-details', 
            //detailsEvent: 'mouseover',           
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.edit-trip').click(function() {
                    MENU_HELPER.menuClick('addTripMin', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.set-status-trip').click(function() {
                    MENU_HELPER.menuClick('setStatus', 'manageTrip', {extraHref: record._id});
                });
                $(rowElement).find('.comments-trip').click(function() {
                    MENU_HELPER.menuClick('addComments', 'manageTrip', {extraHref: record._id});
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
                },
                onSubmit: function(filters){
                    var pageName = 'manageTrip';
                    switch(filters.status){
                        case 'New':
                            pageName = 'newTrips';
                        break;
                        case 'Quoted':
                            pageName = 'viewQuotes';
                        break;
                        case 'Paymentpending':
                            pageName = 'pendingTrips';
                        break;
                        case 'Paymentmade':
                            pageName = 'pendingTrips';
                        break;
                        case 'Waitingforassignment':
                            pageName = 'pendingTrips';
                        break;
                         case 'Running':
                            pageName = 'runningTrips';
                        break;
                         case 'Cancelled':
                            pageName = 'pendingTrips';
                        break;
                         case 'Successful':
                            pageName = 'pendingTrips';
                        break;
                         case 'Assigned':
                            pageName = 'assignedTrips';
                        break;
                    }
                    MENU_HELPER.menuClick(pageName, 'manageTrip');
                }               
            }            
        }        
    });
});
