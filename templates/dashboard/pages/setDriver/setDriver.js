// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());


$(function () {
    $("#btnsubmit").click(function (e) {
      e.preventDefault();
      var moduleData = UTILS.getCurrentTemplateData();

      var options = {};
                    
        var data = $('#driverid').val();
		options.formData = JSON.stringify({ driverid : data});
		options.uri = "trucks/service/setDriver";
		options.extraHref = "id="+moduleData._id;
		options.type = 'POST';
		
		 API_HELPER.postData(options, function (error, response) {
		       if (error) {
		                  console.log('error', error);
		                  return;
		        }
		        location.reload(); // need to change, reload only template
		 });


  });
});
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
	for (var i in config.data) {
    	$('#driverid').append(new Option(config.data[i].firstname+' '+config.data[i].lastname,
    	 config.data[i]._id));
	}
    /*console.log("before FORM_HELPER");
    console.log(config);
    FORM_HELPER.draw(".assign-driver-content", config, {

    	schemaOverride: {
            fields: {
                driverId: {
			        "enum": config.data
                }
            }
        }, 
        optionsOverride: {
            fields: {
            	 driverId: {
			        "options": {
			        	
			        		"label": "Int List",
                			"type": "select"
			        	
			        }
                }
            }
        },     
        postUrl: "trucks/service/setDriver",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTruck', 'manageTruck');
            }
        },
    });*/
});