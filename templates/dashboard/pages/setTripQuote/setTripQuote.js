// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data quote', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();

    
    FORM_HELPER.draw(".quote-trips-content", config, {
         schemaOverride: {
             fields: {
                quotes: {
                    title:"",
                    properties: {
                        quotetype: {
                            title: "Quote Type",
                            default: "Flat"
                        },
                        cost: {
                            dependencies: "quotetype",
                            required: true
                        },
                        costPerTon: {
                            dependencies: "quotetype",
                            required: true
                        },
                        loadingPerTon: {
                            dependencies: "quotetype",
                            required: true
                        },
                        unLoadingPerTon: {
                            dependencies: "quotetype",
                            required: true
                        }
                    }
                }
             }
        },
        optionsOverride: {
            fields: {
                quotes: {
                    fields: {
                        quotetype: {
                            hideNone: true
                        },
                        cost :{
                            dependencies: {
                                quotetype: "Flat"
                            }
                        },
                        costPerTon :{
                            dependencies: {
                                quotetype: "Tons"
                            }
                        },
                        loadingPerTon :{
                            dependencies: {
                                quotetype: "Tons"
                            }
                        },
                        unLoadingPerTon :{
                            dependencies: {
                                quotetype: "Tons"
                            }
                        }
                    }
                }
            }
        }, 
        postUrl: "trips/service/setQuote",
        callbacks: {
            afterSubmit: function () {
                MENU_HELPER.menuClick('manageTrip', 'manageTrip');
            }
        },
    });
});