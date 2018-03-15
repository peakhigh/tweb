// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    console.log(config);
    var isProfilePicAdded = false;

    var uploader = new qq.FineUploaderBasic({
        request: {
           endpoint: CONSTANTS.apiServer + "files/service/profilePics",
           customHeaders: {
               "Authorization": 'Bearer ' + API_HELPER.getToken()
           },
           params: {
             //  userid : config.data._id
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
            MENU_HELPER.menuClick('manageDrivers', 'manageDrivers');
        }
       },
       autoUpload: false,
       multiple: false,
       /*  debug:true  */
   }); 

    FORM_HELPER.draw(".new-driver-content", config, {
        bindings: {
            name: "column-1",
            mobile: "column-2",
            licenseNumber: "column-1",
            licenseExpiryDate: "column-2",
            experience: "column-1",
            email: "column-2",
            alternativePhone:"column-1",
            profilePic:"column-2"
        },
        schemaOverride: {
            fields: {
                experience: {
                    title: "Experience (in years)"
                },
                licenseExpiryDate: {
                    title: "License Expiry"
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
                        uploader.addFiles(files);
                        isProfilePicAdded = true;
                     }
                }
            }
        },
        postUrl: "drivers/service/addDriver",
        callbacks: {
            afterSubmit: function (data) {
                console.log(data._id);
                if(isProfilePicAdded == true){
                    uploader.setParams({userid:data._id,type:"Drivers"});
                     uploader.uploadStoredFiles();
                }else {
                 MENU_HELPER.menuClick('manageDrivers', 'manageDrivers');
                }
            }
        },
    });
});