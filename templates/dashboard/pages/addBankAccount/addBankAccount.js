// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data account', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    FORM_HELPER.draw(".add-account-content", moduleData, {
        schemaOverride: {
            fields: {
                ifscCode: {
                    title: "IFSC Code"
                }
            }
        },
        optionsOverride: {
            fields: {
            }
        }, 
        postUrl: "accounts/service/addBankAccount",        
        callbacks: {
            beforeSubmit: function (config) {
            },
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageBankAccounts', 'manageBankAccounts');
            }
        },
    });
});