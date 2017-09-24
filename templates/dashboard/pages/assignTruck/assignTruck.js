console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.assign-trucks-content', {
        gridData: moduleData,
        drawSort: false,
        gridId: 'gridAssignTrucks',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                $(rowElement).find('.sendrequest').click(function() {
                    sendRequest(record);
                 //   MENU_HELPER.menuClick('sendTruckRequest', 'manageTrip', {extraHref: record._id});
                });
            }
         }
    });


    sendRequest =  function (record){
        
          var source = $('#sendrequestmodal').html(); 
           var template1 = Handlebars.compile(source);
          $('body').append(template1());    
           $('#sendrequestmodalid').modal({show: true, background: true});      


           $('.myModalclass').alpaca({
            "schema": {
                "type": "object",
                "properties": {
                    "advance": {
                        "title": "Adavance",
                        "type": "number",
                    },
                    "balance": {
                        "title": "Balance",
                        "type": "number",
                        "required": true,
                    },
                    "comment": {
                        "title": "Comment",
                        "type": "string",
                        "required": false
                    }
                },
            },
            "options": {
                "fields": {
                    "comment": {
                        "type": "textarea"
                  },
                },
                "form": {
                  /*   "attributes": {
                        "method": "POST",
                        "action": CONSTANTS.apiServer + "requests/service/fileupload?id="+moduleData.id+"&type=123"    
                     }, */
                    "buttons": {
                        "submit": {
                            "title": "Submit",
                            "click": function() {
                                var value = this.getValue();
                                value.tripid = moduleData._id;
                                value.truckid = record._id;
                                value.toUser  = record.createdBy;
     
                               var options = {};
                              options.formData = JSON.stringify(value);
                              options.uri = "requests/service/addRequest";
                              options.type = 'POST';
                              
                                  API_HELPER.postData(options, function (error, response) {
                                      if (error) {
                                                  console.log('error', error);
                                                  return;
                                      }
                                      MENU_HELPER.menuClick('manageTrip', 'manageTrip');
                                  }); 
                                  $('#sendrequestmodalid').modal('hide');   
                            }
                        }
                    }
                },  
            }
        });  

     }
});
