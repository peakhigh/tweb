// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data viewdetails', UTILS.getCurrentTemplateData());


$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();
     FORM_HELPER.draw(".view-trip-content", config, {
        schemaOverride: {
        },
        optionsOverride: {
            form: {
                buttons: {
                    submit: {
                        title: "Comments",
                        click: function(){
                            MENU_HELPER.menuClick('addComments', 'manageTrip', {extraHref: config.data._id});
                        }
                    },
                    documents: {
                        title: "Documents",
                        click: function(){
                            MENU_HELPER.menuClick('uploadDocs', 'manageTrip', {extraHref: config.data._id});
                        }
                    }
                }
            }
        },
        callbacks: {
        },
        view: {
            "globalTemplate": "#viewTripDetails"
        } 
    }); 
});