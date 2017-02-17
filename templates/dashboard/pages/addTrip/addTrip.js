// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log(UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();   
    // console.log(UTILS.getCurrentTemplateData());
    // for validations
    // field.validator = function(callback){returncallback({"status": false, "message": "You are too young to drink alcohol!" }); /  callback({"status": true}); }
                            
                           
                       
    FORM_HELPER.draw(".new-trips-content", config, {
        bindings: {            
            pickup: "column-1",
            drop: "column-2",
            vehicleRequirements: "column-1",            
            comments: "column-2",
            totalWeight: "column-2"
        },
        optionsOverride: {
            focus: 'pickup[0]/date',
            fields: {
                pickup: {
                    order: 1            
                }, 
                drop: {
                    order: 2
                },
                vehicleRequirements: {
                    order: 3
                },
                comments: {
                    order: 4
                },
                totalWeight: {
                    order: 5
                }
            }
        },
       callbacks: {
           beforeSubmit: function() {},//here in all callbacks, this stands for alpaca object
           afterSubmit: function() {},
           onSubmitError: function() {},//on submission if error occurs
           postRender: function() {}//custom design ur form accroding to the needs
       },
       postUrl: "trips/service/addTrip"
    });
});