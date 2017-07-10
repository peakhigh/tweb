// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('truck template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-trucks-content", config, {
        bindings: {
            plateNumber: "column-1",
            model: "column-2",
            truckType: "column-1",
            description: "column-2",
            capacity: "column-1",
            capacityUnits: "column-2",
            insurance:"column-1",
            material:"column-2",
            currentPoint: "column-1",
            status:"column-2",
            currentPoint:"column-1",
            nextAvailableAt:"column-2",
            nextFreeDate:"column-1"
        },
        schemaOverride: {
             dependencies: {
                currentPoint: ["status"],
                nextAvailableAt: ["status"],
                nextFreeDate: ["status"],
            }
        },
        optionsOverride: {
            fields: {
                currentPoint :{
                    dependencies: {
                        status: "busy"
                    }
                },
                nextAvailableAt :{
                    dependencies: {
                        status: "busy"
                    }
                },
                nextFreeDate :{
                    dependencies: {
                        status: "busy"
                    }
                },
            }
        },
        callbacks: {
            preRender: function (config) {//before drawing alpaca dom form - used to adjust the config 
            },
            beforeSubmit: function () { },//here in all callbacks, this stands for alpaca object
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTruck', 'manageTruck');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
              

            }//custom design ur form accroding to the needs
        },
        postUrl: "trucks/service/addTruck"
    });
});