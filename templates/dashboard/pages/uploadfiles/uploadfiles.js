// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());


//listener for the form
$(function () {
    $("#myform").on("submit", function (e) {
      e.preventDefault();
      var moduleData = UTILS.getCurrentTemplateData();
      var formData = new FormData(this);
      formData.append('photo',formData);
      var options = {};
      options.formData = formData;
      options.uri = "files/service/fileupload";
      options.extraHref = "id="+moduleData.id;
      options.type = 'POST';

       API_HELPER.uploadFiles(options, function (error, response) {
             if (error) {
                        console.log('error', error);
                        return;
              }
              location.reload();  // need to change, reload only template
              //console.log(response);
       });
    });
});


$(document).ready(function () {

    var moduleData = UTILS.getCurrentTemplateData();
    
    var grid = new GRID_HELPER.GRID('.upload-files-content', {
        gridData: moduleData,
        gridId: 'gridUploadFiles',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsPostRender: function(rowElement, record) {
               
            },
            click: function() {
                  console.log(arguments);
                if(arguments[0].target.id == 'actiondelete'){
                  console.log(arguments[1]);
                    var options = {};
                    
                    options.formData = JSON.stringify({ name : "AA" });
                    options.uri = "files/service/fileupload";
                    options.extraHref = "id="+arguments[1]._id;
                    options.type = 'DELETE';
                    
                     API_HELPER.uploadFiles(options, function (error, response) {
                           if (error) {
                                      console.log('error', error);
                                      return;
                            }
                            location.reload(); // need to change, reload only template
                            //console.log(response);
                     });


                }else if(arguments[0].target.id == 'actiondownload'){
                  console.log(arguments[1]);
                }
            }, 
         },
         
    });

   /* FORM_HELPER.draw(".upload-files-content", config, {
        postUrl: "files/service/fileupload",
        callbacks: {
            afterSubmit: function () {
                
            }
        },
    });*/


/*$(".upload-files-content").alpaca({
  "options": {
    "form": {
      "attributes": {
       // "action": "http://localhost:5000/api/uploadfiles/service/uploadfiles",
        "action": "http://localhost:5000/api/fileupload",
        "method": "post"
      },
      "buttons": {
        "submit": {
          "title": "seeend",
          "fieldClass": "sss"
        }
      }
    },
    "fields": {
      "fieldFile": {
        "type": "file",
        "label": "Ice Cream Photo:",
        "helper": "Pick your favorite ice cream picture."
      }
    }
  },
  "schema": {
    "type": "object",
    "properties": {
      "fieldFile": {
        "type": "string",
        "format": "uri"
      }
    }
  }
 
});*/


});