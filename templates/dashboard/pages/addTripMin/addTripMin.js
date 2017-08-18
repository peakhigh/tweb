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

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-trips-content", config, {
        // type: config.data ? 'edit' : 'create',
        bindings: {
            pickup: "column-1",
            drop: "column-2",
            vehicleRequirements: "column-2"
        },
        schemaOverride: {
            fields: {
                pickup: {
                    title: "Pickup point"
                },
                drop: {
                    title: "Drop point"
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
                    items: {
                        fields: {
                            material: {
                                items: {
                                    fields: {
                                        name: {
                                            fieldClass: 'materialNameGroup',
                                            events: {
                                                blur: function () {
                                                    setItemsToDrop.apply(this, []);
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
                    order: 2
                },
                vehicleRequirements: {
                    order: 3
                }
            }
        },
        callbacks: {
            preRender: function (config) {//before drawing alpaca dom form - used to adjust the config 
            },
            beforeSubmit: function () { },//here in all callbacks, this stands for alpaca object
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
                initializeItemsToDropInEditMode(config);
                //TODO: validate pickup.date < drop.date (multiple pickup points & drop points will be there)
                //all drop.date should be greater than the maximum of pickup.dates & vicevers

            }//custom design ur form accroding to the needs
        },
        postUrl: "trips/service/addTripMin"
    });
});