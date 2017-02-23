// var pageName = 'manageTrip';
console.log("Manage Trips");
console.log('template data', UTILS.getCurrentTemplateData());
// console.log(UTILS.getCurrentTemplateData());
// console.log(UTILS.getTemplateData(pageName));
$(document).ready(function () {
    // API_HELPER.test();

    var moduleData = UTILS.getCurrentTemplateData();
    // var headerTemplate = Handlebars.compile($("#grid-header-template").html());
    // var rowTemplate = Handlebars.compile($("#grid-row-template").html());
    var gridTemplate = Handlebars.compile('{{> grid }}');

    // var context = {title: "My New Post", body: "This is my first post!"};
    // var html = template(context);
    // console.log(html);

    $('.manage-trips-content').html(gridTemplate({
        gridData: moduleData.data,
        headerTemplateId: 'grid-header-template',
        gridId: 'gridManageTrips',
        postRender: function(){
            console.log(arguments);
        },
        rowConfig: {
            template: 'grid-row-template',
            rowId: 'row{{_id}}',//send as row identifier when row-post-render is called, so that we can change the html element of the row, need to use the same identifier for each row while creating the row template
            preRender: function(rowData) {
                //change rowData
                return rowData;
            }, 
            postRender: function(rowData, rowElement) {
                console.log(' hu ha ', rowData, rowElement);
                //if anything returned will be appended, or u can modify the data
                return '';
            }
        }
    }));
});
//get total from backend
//grid plugin with header-template, data-template, data, paging options
//may be grid rendering should be handle bars templates
//should be like a grid plugin, not like a handle bars template