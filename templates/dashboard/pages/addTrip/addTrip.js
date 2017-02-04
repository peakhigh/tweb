console.log(JSON.stringify(UTILS.getCurrentTemplateData()));

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    config.options = {
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
    };
    // console.log(UTILS.getCurrentTemplateData());
    FORM_HELPER.draw(".new-trips-content", config, {
        bindings: {            
            "pickup": "column-1",
            "drop": "column-2",
            "vehicleRequirements": "column-1",            
            "comments": "column-2",
            "totalWeight": "column-1"
        }
    });
});