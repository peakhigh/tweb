// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

function setItemsToDrop() {
    var match = false;
    var newEntry = this.getValue().toUpperCase();
    $('.itemsToDropGroup select option').each(function (name, val) {
        if (val.text.toUpperCase() === newEntry) {
            match = true;
        }
    });
    if (!match) {
        var html = "";
        $('.materialNameGroup input').each(function () {
            if ($(this).val()) {
                html += '<option value="' + $(this).val().toUpperCase() + '">' + $(this).val().toUpperCase() + '</option>'
            }
        });
        $('.itemsToDropGroup select').each(function () {
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

function initializeItemsToDropInEditMode(config) {
    //set itemsToDrop                
    if (config.data && config.data.pickup && config.data.pickup.length > 0) {
        var itemsToDrop = [];
        config.data.pickup.forEach(function (entry) {
            if (entry.material && entry.material.length > 0) {
                entry.material.forEach(function (subEntry) {
                    if (subEntry.name && itemsToDrop.indexOf(subEntry.name) < 0) {
                        itemsToDrop.push(subEntry.name.toUpperCase());
                    }
                });
            }
        });
        if (itemsToDrop.length > 0) {
            var html = "";
            itemsToDrop.forEach(function (entry) {
                html += '<option value="' + entry + '">' + entry + '</option>'
            });
            $('.itemsToDropGroup select').each(function (index, element) {
                var selectedValues = $(element).val();
                $(element).html(html);
                $(element).multiselect('rebuild'); 
                if (config.data.drop && config.data.drop.length > index && config.data.drop[index].itemsToDrop) {
                    $(element).multiselect('select', config.data.drop[index].itemsToDrop);
                }                 
            });
        }
    }
}

function drawTripsForm(config,callback){
    FORM_HELPER.draw(".new-trips-content", config, {
        // type: config.data ? 'edit' : 'create',
         bindings: {
            pickup: "column-1",
            drop: "column-2",
            vehicleRequirements: "column-2",
        }, 
        schemaOverride: {
            fields: {
                pickup: {
                    title: "Pickup point",
                    fields: {
                        address: {
                            title: "",
                            fields: {
                                properties: {
                                    location: {
                                        required: false
                                    }
                                }
                            },
                            dependencies: {
                                'organisation': "loadFromPrevious",
                                'location': "loadFromPrevious",
                                'zip': "loadFromPrevious",
                            }
                        },
                        material: {
                            dependencies: {
                                'approximateCost' : "loadFromPrevious",
                                'description' : "loadFromPrevious",
                            } 
                        } 
                    },
                    dependencies: {
                        'contact' : "loadFromPrevious"
                    }  
                },
                drop: {
                    title: "Drop point",
                    fields: {
                        address: {
                            title: "",
                            fields: {
                                properties: {
                                    location: {
                                        required: false
                                    }
                                }
                             } ,
                            dependencies: {
                                'organisation': "loadFromPrevious",
                                'location': "loadFromPrevious",
                                'zip': "loadFromPrevious",
                            } 
                        }
                    } ,
                    dependencies: {
                        'contact' : "loadFromPrevious",
                        'itemsToDrop': "loadFromPrevious"
                    }    
                },
                vehicleRequirements: {
                    properties: {
                            vehicleCount: {
                                default: 1,
                                minimum: 1
                            }
                    },
                    dependencies: {
                        'minRating' : "loadFromPrevious",
                        'requiredCapacity': "loadFromPrevious",
                        'capacityUnit' : "loadFromPrevious"
                    }   
                }
            }
        },
        optionsOverride: {
            focus: 'pickup/date',
            fields: {
                pickup: {
                    order: 1,
                    fields:{
                        date: {
                            picker: {
                                "sideBySide": true,
                            },
                            dateFormat: "YYYY-MM-DD HH:mm:ss"
                        }
                     }
                },
                drop: {
                    order: 2,
                    fields:{
                        date: {
                            picker: {
                                "sideBySide": true,
                            },
                            dateFormat: "YYYY-MM-DD HH:mm:ss"
                        }
                     }
                },
                vehicleRequirements: {
                    order: 3
                }
            }
        },
        callbacks: {
            preRender: function (config) {//before drawing alpaca dom form - used to adjust the config 
            },
            beforeSubmit: function () { 
            },//here in all callbacks, this stands for alpaca object
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function (renderedField) {

                initializeItemsToDropInEditMode(config);
                 if(callback){
                    callback();
                } 

                var form = renderedField.form;
                form.validate(true);
                // draw the validation state (top control + all children)
                form.refreshValidationState(true);

                if (form) {
                    form.registerSubmitHandler(function(e, form) {
                        // validate the entire form (top control + all children)
                        form.validate(true);
                        // draw the validation state (top control + all children)
                        form.refreshValidationState(true);
                        // now display something
                        if (form.isFormValid()) {
                            var value = form.getValue();
                            alert("The form looks good!  Name: " + value.name + ", Birthday: " + value.birthday + ", Preference: " + value.preference);
                        } else {
                            alert("There are problems with the form.  Please make the any necessary corrections.");
                        }
                        e.stopPropagation();
                        return false;
                    });
                }

                //TODO: validate pickup.date < drop.date (multiple pickup points & drop points will be there)
                //all drop.date should be greater than the maximum of pickup.dates & vicevers

            }//custom design ur form accroding to the needs
        },
        postUrl: "trips/service/addTripMin",
    });

}


function drawTripsCompleteForm(config,callback){

    FORM_HELPER.draw(".new-trips-content-full", config, {
        // type: config.data ? 'edit' : 'create',
         bindings: {
            pickup: "column-1",
            drop: "column-2",
            vehicleRequirements: "column-2",
        }, 
        schemaOverride: {
            fields: {
                pickup: {
                    title: "Pickup point",
                    fields: {
                        address: {
                            title: "",
                            fields: {
                                properties: {
                                    location: {
                                        required: false
                                    }
                                }
                            }
                        }
                       
                    }
                },
                drop: {
                    title: "Drop point",
                    fields: {
                        address: {
                            title: "",
                            fields: {
                                properties: {
                                    location: {
                                        required: false
                                    }
                                }
                             }
                        }  
                    }
                },
                vehicleRequirements: {
                    properties: {
                            vehicleCount: {
                                default: 1,
                                minimum: 1
                            }
                    }
                }
            }
        },
        optionsOverride: {
            focus: 'pickup/date',
            fields: {
                pickup: {
                    order: 1,
                    fields:{
                        date: {
                            picker: {
                                "sideBySide": true,
                            },
                            dateFormat: "YYYY-MM-DD HH:mm:ss"
                        }
                     }
                },
                drop: {
                    order: 2,
                    fields:{
                        date: {
                            picker: {
                                "sideBySide": true,
                            },
                            dateFormat: "YYYY-MM-DD HH:mm:ss"
                        }
                     }
                },
                vehicleRequirements: {
                    order: 3
                }
            }
        },
        callbacks: {
            preRender: function (config) {//before drawing alpaca dom form - used to adjust the config 
            },
            beforeSubmit: function () { 
            },//here in all callbacks, this stands for alpaca object
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
                
                initializeItemsToDropInEditMode(config);
                if(callback){
                    callback();
                }
            
                //TODO: validate pickup.date < drop.date (multiple pickup points & drop points will be there)
                //all drop.date should be greater than the maximum of pickup.dates & vicevers

            }//custom design ur form accroding to the needs
        },
        postUrl: "trips/service/addTripMin",
    });

}

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    var original = jQuery.extend(true, {}, config);
    drawTripsForm(config);
    drawTripsCompleteForm(original);
    var previousTrips = [];
    var options={};
    options.uri = "trips/service/getPreviousTrips";
    options.extraHref = "limit=3";
    options.type = 'GET';
    
     API_HELPER.postData(options,function (error, response) {
        if (error) {
                   console.log('error', error);
                   return;
         }
         previousTrips = response.data;
      }); 


      $('input:checkbox').change(function(){
        if($(this).is(':checked')){
            $("#newtripscontainer").hide();
            $("#newtripscontainerfull").show();
            $('#newtripscontainerfull').alpaca('get').setValue(previousTrips[0]); 
        } else {
            $("#newtripscontainerfull").hide();
            $("#newtripscontainer").show();
            $('#newtripscontainer').alpaca('get').setValue(previousTrips[0]);      
        }
    });
    
});