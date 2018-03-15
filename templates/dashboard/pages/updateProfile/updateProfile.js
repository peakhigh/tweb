console.log('123template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();

    console.log(config);
    config.data.profilePic = "";

    var uploader = new qq.FineUploaderBasic({
        request: {
           endpoint: CONSTANTS.apiServer + "files/service/profilePics",
           customHeaders: {
               "Authorization": 'Bearer ' + API_HELPER.getToken()
           },
           params: {
               userid : config.data._id
            },
            paramsInBody:false
       }, 
         validation: {
           allowedExtensions: ['jpeg', 'jpg', 'png'],
           itemLimit: 1,
           sizeLimit: 5000000 // 5MB
       },  
       callbacks: {
        onComplete: function(id,filename,responseJSON){
         //   location.reload();
            MENU_HELPER.menuClick('viewProfile', 'updateProfile');
        }
       },
       autoUpload: false,
       multiple: false,
        debug:true 
   }); 
   
    FORM_HELPER.draw(".update-profile-content", config, {
        bindings: {
            firstName: "column-1",
            lastName: "column-2",
            gender: "column-1",
            email: "column-1",
            mobile: "column-1",
            alternativePhone: "column-2",
            organisationAddress:"column-2",
            profilePic:"column-2",
            security: "column-1",
        },
        schemaOverride: {
            fields: {
                security:{
                    fields:{
                        confirmPassword: {
                            default: config.data.security.password
                        }
                    }
                }
            }
        },
        optionsOverride: {
            fields: {
                profilePic: {
                    id: "upload",
                    type: "file",
                    "selectionHandler": function(files, data) {
                        // files for multiple or use files[0] to get only one file
                        // and if you want to use base64 data you could use data 
                     //   this.data = files;
                        console.log(files[0]);
                        uploader.addFiles(files);
                     }
                }
            },
            form: {
                buttons: {
                    cancel: {
                        title: "Cancel",
                        click: function(){
                            MENU_HELPER.menuClick('viewProfile', 'updateProfile');
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
                uploader.uploadStoredFiles();
               // MENU_HELPER.menuClick('viewProfile', 'updateProfile');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
              
            }//custom design ur form accroding to the needs
        },
        postUrl: "users/service/updateProfile"
    });
    
  

});