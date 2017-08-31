console.log('template data', UTILS.getCurrentTemplateData());



$(document).ready(function () {

        var moduleData = UTILS.getCurrentTemplateData();

        var uploader = new qq.FineUploaderBasic({
            request: {
               endpoint: CONSTANTS.apiServer + "files/service/fileupload",
               customHeaders: {
                   "Authorization": 'Bearer ' + API_HELPER.getToken()
               },
               params: {
                   id : moduleData.id,
                   type: "unknown"
                },
                paramsInBody:false
           }, 
             validation: {
               allowedExtensions: ['jpeg', 'jpg', 'txt', 'png', 'pdf'],
               itemLimit: 1,
               sizeLimit: 5000000 // 5MB
           },  
           callbacks: {
            onComplete: function(id,filename,responseJSON){
                location.reload();
            }
           },
           button: document.getElementById('uploadform'),
           autoUpload: false,
           multiple: false,
          /*  debug:true */
       });


       /*  var uploader = new qq.FineUploaderBasic({
             element: document.getElementById("uploadform"), 
             template: 'qq-template-gallery',  
            request: {
                endpoint: CONSTANTS.apiServer + "files/service/fileupload?id="+moduleData.id+"&type=123",
                customHeaders: {
                    "Authorization": 'Bearer ' + API_HELPER.getToken()
                }
            },
             validation: {
                allowedExtensions: ['jpeg', 'jpg', 'txt', 'png', 'pdf'],
                itemLimit: 1,
                sizeLimit: 5000000 // 5MB
            }, 
             extraButtons: [
                {
                    element: document.getElementById("keyName"),
                }], 
            autoUpload: false,
            multiple: false,
            debug:true
        }); */


         $('#typeofdocument').on('change', function() {
            if(this.value === "Other"){
                $("#otherinputdiv").removeClass('hidden');
            }else{
                $("#otherinputdiv").addClass('hidden');
            }
        });

        $("#myform").on("submit", function (e) {
            e.preventDefault();
            var moduleData = UTILS.getCurrentTemplateData();
            var formData = new FormData(this);
            formData.append('photo',formData);
            var doctype = $('#typeofdocument').val() === "Other" ? 
                                $('#otherinput').val() : $('#typeofdocument').val();
            
            uploader.setParams({id:moduleData.id,type:doctype});
            uploader.uploadStoredFiles();
        });  

    showUploadedFiles = function(){
        var source   = $("#grid-row-template-details").html();
        var template = Handlebars.compile(source);
        $(".datarea").html('');
        $(".datarea").html(template(moduleData)); 

        if ($(".upload-files-content").find('.pager-container')) {

            var pagerConfig = {};
            pagerConfig.total = moduleData.total;
            pagerConfig.size = 5;
            var pager = new GRID_HELPER.PAGER($(".upload-files-content").find('.pager-container'), pagerConfig, function(page, size) {
                // me.showLoading();
                 MENU_HELPER.reloadData({
                    data: {
                        skip: (page - 1) * size,
                        limit: size
                    }
                }, function(response) {   
                    console.log(response);
                    $(".datarea").html('');
                    $(".datarea").html(template(response));
                });
            });
        }

        $('.actions').on('click','button', function (evt) {
            if(evt.target.id === 'download'){
                    console.log("download not implemented");
            }else if (evt.target.id === 'delete'){
                var options={};
                options.formData = JSON.stringify({ name : "AA" });
                options.uri = "files/service/fileupload";
                options.extraHref = "id="+$(evt.target).attr("_id");
                options.type = 'DELETE';
                
                 API_HELPER.uploadFiles(options, function (error, response) {
                       if (error) {
                                  console.log('error', error);
                                  return;
                        }
                        location.reload(); // need to change, reload only template
                        //console.log(response);
                 });


            }
         });

}


     /* $('.uploadform').alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "doctype": {
                "type": "string",
                "enum": ["License", "LoadDoc", "UnloadDoc", "Photo", "Insurance", "Other"],
                "required": false
            },
            "other": {
                "type": "string",
                "required": true,
                "pattern": {}
            },
            "file": {
                "type": "string",
                "required": false
            }
        },
        "dependencies": {  
          "other":"doctype"
        },
        "required": false
    },
    "options": {
        "fields": {
            "doctype": {
                "type": "select",
                "label": "File Type:",
                 "helpers": [],
            },
            "other": {
                "label": "Other:",
                 "helpers": [],
                 "dependencies": {
                    "doctype":"Other"
                 }
            },
            "file": {
                "type": "file",
                "name": "files"
            }
        },
        "form": {
            "attributes": {
                "method": "POST",
                "action": CONSTANTS.apiServer + "files/service/fileupload?id="+moduleData.id+"&type=123"    
             },
            "buttons": {
                "submit": {
                    "title": "Upload",
                    "click": function() {
                      //  console.log(this);
                        this.ajaxSubmit();
                    //  var formData = new FormData(this);
                   //   console.log(this.getValue());
                      //  alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        },  
        "view": "bootstrap-create-horizontal"
    }
});  */


 

});