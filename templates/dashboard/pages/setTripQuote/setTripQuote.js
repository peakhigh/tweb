// console.log(JSON.stringify(UTILS.getCurrentTemplateData()));
console.log('template data quote', UTILS.getCurrentTemplateData());

$(document).ready(function () {
    var config = UTILS.getCurrentTemplateData();

   // var defaultPeriodcheck = {"defaultForPeriod":{type:"boolean",title:"Default for period?"}};
 //   $.extend(config.schema.quotes,defaultPeriodcheck);

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
                        unloadingPerTon: {
                            dependencies: "quotetype",
                            required: true
                        }, 
                        defaultQuoteForPeriod:
                        {
                            type:"boolean",
                            title:"Default for period?",
                            default: false
                        },
                        payAllLater:{
                            type:"boolean",
                            title:"Can pay later?",
                            default: false
                        },
                        startDate: {
                            dependencies: "defaultQuoteForPeriod",
                        }, 
                        endDate: {
                            dependencies: "defaultQuoteForPeriod",
                        }      
                    },   
                }
             }
        },
        optionsOverride: {
            hideInitValidationError:true,
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
                        unloadingPerTon :{
                            dependencies: {
                                quotetype: "Tons"
                            }
                        },
                        payAllLater:{
                            helper:"Trust user, pay all at once",
                            order:8,
                        },
                        startDate :{
                            order:6,
                            dependencies: {
                                defaultQuoteForPeriod: true
                            }
                        },             
                        endDate :{
                            order:7,
                            dependencies: {
                                defaultQuoteForPeriod: true
                            }
                        },
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