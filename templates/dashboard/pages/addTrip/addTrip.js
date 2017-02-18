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
            vehicleRequirements: "column-2",            
            comments: "column-2",
            totalWeight: "column-2"
        },     
        schemaOverride: {
            fields: {
                pickup: {
                    title: "Pickup point(s)"                    
                },
                drop: {
                    title: "Drop point(s)",
                    items: {
                        properties: {
                            itemsToDrop: {
                                // minItems: 1,
                                // items: {
                                    required: true,
                                    type: 'string',
                                    items: null
                                // }                                
                            }
                        }
                    }                  
                }
            }            
        },   
        optionsOverride: {
            focus: 'pickup[0]/date',
            fields: {
                pickup: {
                    order: 1,
                    helper: "You can add multiple pickup points",
                    items: {
                        fields: {
                            material: {
                               items: {
                                   fields: {
                                       name: {
                                           fieldClass: 'materialNameGroup',
                                           events: {
                                                blur: function() {
                                                    var match = false;
                                                    var newEntry = this.getValue().toUpperCase();
                                                    $('.itemsToDropGroup select option').each(function(name, val) {
                                                        if (val.text.toUpperCase() === newEntry) {
                                                            match = true;
                                                        }
                                                    });
                                                    if (!match) {
                                                        var html = "";
                                                        $('.materialNameGroup input').each(function() {
                                                            if ($(this).val()) {
                                                                html += '<option value="'+$(this).val().toUpperCase()+'">'+$(this).val().toUpperCase()+'</option>'
                                                            }
                                                        });
                                                        $('.itemsToDropGroup select').each(function(){
                                                            var selectedValues = $(this).val();
                                                            $(this).html(html);
                                                            $(this).multiselect('rebuild');
                                                            if (selectedValues && selectedValues.length > 0) {
                                                                $(this).multiselect('select', selectedValues);
                                                            }
                                                            if (!$(this).val() || $(this).val().length === 0) {
                                                                $(this).multiselect('select', [newEntry]);
                                                            }
                                                        });
                                                    }
                                                }
                                           }
                                       }
                                   }
                               } 
                            }                            
                        }
                    }
                }, 
                drop: {
                    order: 2,
                    helper: "You can add multiple drop points",
                    items: {
                        fields: {
                            itemsToDrop :{
                                // items: {
                                    type: 'select',
                                    multiple: true,
                                    fieldClass: 'itemsToDropGroup'                             
                                // }
                            }
                        }
                    }
                },
                vehicleRequirements: {
                    order: 3
                },
                comments: {
                    order: 4,
                    items: {
                        type: 'textarea'
                    }
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



    // $(".new-trips-content").alpaca({
    //     "data": {
    //         "firstName": "Tre",
    //         "lastName": "Styles",
    //         "age": 30
    //     },
    //     "schema": {
    //         "title": "Your Information",
    //         "type": "object",
    //         "properties": {
    //             "firstName": {
    //                 "title": "First Name",
    //                 "type": "string"
    //             },
    //             "lastName": {
    //                 "title": "Last Name",
    //                 "type": "string"
    //             },
    //             "age": {
    //                 "title": "Age",
    //                 "type": "integer",
    //                 "minimum": 0,
    //                 "maximum": 100
    //             },
    //             "test": {
    //                 "type": "array",
    //                 "items": {
    //                     "type": "object",
    //                     "properties": {
    //                         sam: {
    //                             type: "string"
    //                         }
    //                     }
    //                 }
    //             },
    //             "test1": {
    //                 "type": "object",
    //                 "properties": {
    //                     kam: {
    //                         type: "string"
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     "options": {
    //         "form": {
    //             "attributes": {
    //                 "action": CONSTANTS.apiServer + "trips/service/addTrip",
    //                 "method": "post"
    //             },
    //             "buttons": {
    //                 "submit": {
    //                     "click": function () {
    //                         this.refreshValidationState(true);
    //                         if (!this.isValid(true)) {
    //                             this.focus();
    //                             return;
    //                         }
    //                         this.ajaxSubmit();
    //                     }
    //                 }
    //             }
    //         },
    //         "hideInitValidationError": true,
    //         "focus": "firstName"
    //     }
    // });
});