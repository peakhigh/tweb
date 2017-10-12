console.log('trippayment template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".trip-payment-content", config, {
        schemaOverride: {
            fields: {
                quotes: {
                    title:"",
                    cost: {

                    }   
                },
                paymentInfo: {
                    title:'',
                    paymentlog:{   
                    maxItems: 1,
                    minItems:1,
                    title: "Payment",
                    items: {
                        properties: {
                        }
                    }
                 }
                }
            }
        },
        optionsOverride: {
            fields: {

                paymentInfo: {
                    fields: {
                     paymentlog:{   
                    toolbarSticky: false,
                    items:{
                        fields: {
                    referenceDoc: {
                        type: "file"
                    },
                    modeOfPayment: {
                        hideNone: true
                    }
                        }
                    }
                }
                  }
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
            }//custom design ur form accroding to the needs
        },
        postUrl: "trips/service/tripPayment",
        view: {
            "parent": "bootstrap-edit-horizontal",
            "fields": {
                "/quotes/cost": {
                    "templates": {
                        "control": "#cost",
                    }
                },
            }
         //"globalTemplate": "#tripPayment"
        } 
    });
});