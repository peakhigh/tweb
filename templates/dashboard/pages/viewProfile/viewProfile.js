console.log('123template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".view-profile-content", config, {
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
        },
        optionsOverride: {
            form: {
                buttons: {
                    submit: {
                        title: "Edit",
                        click: function(){
                            MENU_HELPER.menuClick('updateProfile', 'viewProfile');            
                        }
                    },
                    logout: {
                        title: "Log out",
                        click: function(){
                            API_HELPER.logout();
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
            },
            onSubmitError: function () { },//on submission if error occurs
            postRender: function () {
            }//custom design ur form accroding to the needs
        },
        view: {
         "globalTemplate": "#viewprofile"
        }
    });
});