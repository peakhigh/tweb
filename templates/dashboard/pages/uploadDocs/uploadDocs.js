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
               allowedExtensions: ['jpeg', 'jpg', 'txt', 'png', 'pdf', 'doc', 'docx', 'xls'],
               itemLimit: 1,
               sizeLimit: 5000000 // 5MB
           },  
           callbacks: {
            onProgress: function(id, fileName, loaded, total){
                var progressPercent = (loaded / total)*100;
                $('#myProgress').show();
                $('#myBar').attr('style', 'width: '+progressPercent+'%');
            },               
            onError: function(id,filename,onError){
                //failed
                console.log("Error..",onError);
            },
            onComplete: function(id,filename,responseJSON){
               // location.reload();
                MENU_HELPER.reloadData({
                    data: {
                        skip: 0,
                        limit: 5
                    }
                }, function(response) {   
                    showUploadedFiles();
                    $('#myProgress').hide();
                    $('#myForm').find('input').val('');
                });
            }
           },
         //  button: document.getElementById('uploadform'),
           autoUpload: false,
           multiple: false,
           debug:false 
       });

    $('.image-preview-clear').click(function(){
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
        $(".image-preview-input-title").text("Browse"); 
        $('.image-preview-input').show();
        $('.image-preview-upload').hide();
        uploader.clearStoredFiles();
    }); 

    $('.image-preview-upload').click(function(){
        var doctype =  $('#typeofdocument').val();

        if(!$.trim(doctype).length) {
            $('.alert').show();
           // $('.alert').html('file type or name is empty');
            return false;
        }
        uploader.setParams({id:moduleData.id,type:doctype});
        uploader.uploadStoredFiles();
    });

    $(".image-preview-input input:file").change(function (e){      
        var file = this.files[0];
        $(".image-preview-input-title").text("Upload");
        $(".image-preview-clear").show();
        $(".image-preview-upload").show();
        $('.image-preview-input').hide();
        $(".image-preview-filename").val(file.name);
        uploader.addFiles(file);
    });

    showUploadedFiles = function(){
        $("#upload_link_button").hide();
        var source   = $("#grid-row-template-details").html();
        var template = Handlebars.compile(source);
        $(".datarea").html('');
        $(".datarea").html(template(moduleData)); 

        if ($(".upload-files-content").find('.pager-container')) {

            var pagerConfig = {};
            pagerConfig.total = moduleData.total;
            pagerConfig.size = 5;
            var pager = new GRID_HELPER.PAGER($(".upload-files-content").find('.pager-container'),
                                         pagerConfig, function(page, size) {
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
                var options={};
                options.formData = JSON.stringify({ name : "AA" });
                options.uri = "files/service/fileDownload";
                options.extraHref = "id="+$(evt.target).attr("_id");
                options.type = 'GET';
                                
                 API_HELPER.downloadFile(options, function (error, response) {
                       if (error) {
                                  console.log('error', error);
                                  return;
                        }
                        console.log(response);
                        window.location= response.url;
                 });

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

});

