console.log('123template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
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
                    type: "file"
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
                MENU_HELPER.menuClick('viewProfile', 'updateProfile');
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
              
            }//custom design ur form accroding to the needs
        },
        postUrl: "users/service/updateProfile"
    });
});