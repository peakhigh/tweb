console.log('trippayment template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    $(".trip-payment-content").alpaca({
        "view": "bootstrap-create-horizontal",
        "schema": {
            "title": "",
            "type": "object",
            "properties": {
                "amount": {
                    "type": "number",
                    "title": "Amount (Rs) :",
                    "required": true
                },
                "modeOfPayment": {
                    "type": "string",
                    "title": "Mode :",
                    "enum": ['Online', 'BankDeposit', 'Cash'],
                    "required": true
                },
                "dateOfPayment": {
                    "type": "string",
                    "format": "date",
                    "title": "Date :",
                    "required": true
                },
                "transactionid": {
                    "type": "string",
                    "title": "Transaction-Id :"
                },
                "referenceDoc": {
                    "type": "string",
                    "title": "Reference Doc :"
                },
            }
        },
        "options":{
             "hideInitValidationError": true,
            "focus": "amount", 
            "fields":{
                "referenceDoc":{
                    "type":"file"
                }
            },
             "form": {
                "buttons": {
                    "submit": {
                        "click": function() {
                            this.refreshValidationState(true);
                            if (!this.isValid(true)) {
                                this.focus();
                                return;
                            }
                            var data = this.getValue();
                            data.tripid = config.data._id;
                            postPaymentInfo(data);
                        }
                    }
                }
            }, 
        }
    });


    postPaymentInfo =  function (record){
        
        var options = {};
        options.formData = JSON.stringify(record);
        options.uri = "payments/service/addTripPayment";
        options.extraHref = "totalcost="+config.data.cost+"&currentstatus="+config.data.status;
        options.type = 'POST';
        
        API_HELPER.postData(options, function (error, response) {
                if (error) {
                            console.log('error', error);
                            return;
                }
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
         }); 
     }
});
