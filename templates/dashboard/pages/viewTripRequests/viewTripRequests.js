console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();

    var grid = new GRID_HELPER.GRID('.trip-requests-content', {
        gridData: moduleData,
        gridId: 'gridTripRequests',
        rowConfig: {            
            template: 'grid-row-template-details',
            // detailsTemplate: 'grid-row-template-details', 
            //detailsEvent: 'mouseover',           
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {
                
                $(rowElement).find('.approve-bid').click(function() {
                    console.log(record);
                      var options = {};
                        options.formData = JSON.stringify({ truckDetails : record});
                        options.uri = "requests/service/setStatus";
                        options.extraHref = "id="+record._id+"&status=Approved";
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
});
