console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();

    var grid = new GRID_HELPER.GRID('.trip-quotes-content', {
        gridData: moduleData,
        gridId: 'gridTripQuotes',
        rowConfig: {            
            template: 'grid-row-template-details',
            // detailsTemplate: 'grid-row-template-details', 
            //detailsEvent: 'mouseover',           
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                
                $(rowElement).find('.docs-trip').click(function() {
                    MENU_HELPER.menuClick('uploadDocs', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.cancel-trip').click(function() {
                    MENU_HELPER.menuClick('cancelTrip', 'manageTrip', {extraHref: record._id});
                });

                $(rowElement).find('.approve-quote').click(function() {
                    console.log(record);

                    openModal(record);
                });

                  $(rowElement).find('.reject-bid').click(function() {
                    console.log(record);
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
        }
    });


    openModal =  function (record){
        console.log('openModal...');
        var moduleData = UTILS.getCurrentTemplateData('manageTruck');
        var source = $('#myModal').html(); 
         var template1 = Handlebars.compile(source);
        $('body').append(template1());    
         $('#myModalid').modal({show: true, background: true});      

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

                $('#myModalid').modal('hide');   
        });
   }
});
