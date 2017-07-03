// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());



$(function () {
    $("#myform").on("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(this);
      formData.append('photo',formData);
      var options = {};
      options.formData = formData;
      options.uri = "files/service/fileupload";
      options.extraHref = "id=dsfsdfdsfdsfdds";

       API_HELPER.uploadFiles(options, function (error, response) {
             if (error) {
                        console.log('error', error);
                        return;
              }
              console.log(response);
       });
    });
});



$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();


  /*  console.log(config);
    FORM_HELPER.draw(".upload-files-content", config, {
        postUrl: "uploadfiles/service/uploadfiles",
        callbacks: {
            afterSubmit: function () {
                
            }
        },
    });
*/

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