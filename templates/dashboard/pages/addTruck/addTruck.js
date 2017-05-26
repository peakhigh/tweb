// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('truck template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".new-trucks-content", config, {
        bindings: {
            plateNumber: "column-1",
            licenseNumber: "column-2",
            model: "column-1",
            engineNumber: "column-2",
            truckType: "column-1",
            description: "column-2",
            capacity: "column-1",
            capacityUnits: "column-2",
            insurance:"column-1",
            material:"column-2"
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