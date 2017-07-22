console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.pending-trips-content', {
        gridData: moduleData,
        gridId: 'gridPendingTrips',
        rowConfig: {            
            template: 'grid-row-template-details',
            // detailsTemplate: 'grid-row-template-details', 
            //detailsEvent: 'mouseover',           
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                
                $(rowElement).find('.edit-trip').click(function() {
                    MENU_HELPER.menuClick('addTrip', 'manageTrip', {extraHref: record._id});
                });
                $(rowElement).find('.quote-trip').click(function() {
                    MENU_HELPER.menuClick('setQuote', 'manageTrip', {extraHref: record._id});
                });
                $(rowElement).find('.comments-trip').click(function() {
                    MENU_HELPER.menuClick('addComments', 'manageTrip', {extraHref: record._id});
                });
                $(rowElement).find('.assign-truck').click(function() {
                    openModal(record);
                   // MENU_HELPER.menuClick('setTruck', 'manageTrip', {extraHref: record._id});
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
        }
    });

   openModal =  function (params){
        console.log('openModal...');
        var moduleData = UTILS.getCurrentTemplateData('manageTruck');
        var source = $('#myModal').html(); 
         var template1 = Handlebars.compile(source);
        $('body').append(template1());    
         $('#myModalid').modal({show: true, background: true}); 

       var grid = new GRID_HELPER.GRID('.myModalclass', {
        gridData: moduleData,
        gridId: 'gridManageTrucks',
        rowConfig: {            
            template: 'grid-trucks-template',
            optionsTemplate: 'grid-choosetruck-options',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                
                $(rowElement).find('.select-truck').click(function() {
                     console.log('select-truck ');
                     console.log(params);
                     console.log(record);
                     $('#myModalid').modal('hide');
                    //MENU_HELPER.menuClick('addTrip', 'manageTrip', {extraHref: record._id});

                            var options = {};
                            options.formData = JSON.stringify({ truckDetails : record});
                            options.uri = "trips/service/assignTruck";
                            options.extraHref = "id="+params._id;
                            options.type = 'POST';
                            
                             API_HELPER.postData(options, function (error, response) {
                                   if (error) {
                                              console.log('error', error);
                                              return;
                                    }
                             });
                });
               
            }
        }
    });

   }
});
