console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-drivers-content', {
        gridData: moduleData,
        drawSort: false,
        gridId: 'gridManageDrivers',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
            optionsEvent: 'mouseover',
            optionsPostRender: function(rowElement, record) {

            	$(rowElement).find('.edit-driver').click(function() {
                    MENU_HELPER.menuClick('addDriver', 'manageDrivers', {extraHref: record._id});
                });

                $(rowElement).find('.docs-driver').click(function() {
                    MENU_HELPER.menuClick('uploadDocs', 'manageDrivers', {extraHref: record._id});
                });

                $(rowElement).find('.activate-driver').click(function() {
                    changeDriverStatus(record,"Free");
                });

                $(rowElement).find('.deactivate-driver').click(function() {
                    changeDriverStatus(record,"Deactivated");
                });
            }
         }
    });

    statusChanged = function(newStatus){
        var options = {
            data : {
                status: newStatus
            }
        };
        if(newStatus === 'All'){
            options.data = {};   
        }
        MENU_HELPER.menuClick('manageDrivers','manageDrivers',options);
    }

    changeDriverStatus =  function (record,status){
        
          var source = $('#drivermodal').html(); 
           var template1 = Handlebars.compile(source);
          $('body').append(template1());    
           $('#drivermodalid').modal({show: true, background: true});      
  
           $("#yes").click(function(){
              var options = {};
              options.formData = JSON.stringify({ driverDetails : record});
              options.uri = "drivers/service/setStatus";
              options.extraHref = "id="+record._id+"&status="+status;
              options.type = 'POST';
              
                  API_HELPER.postData(options, function (error, response) {
                      if (error) {
                                  console.log('error', error);
                                  return;
                      }
                      MENU_HELPER.menuClick('manageDrivers', 'manageDrivers', {extraHref: record._id});
                  }); 
  
                  $('#drivermodalid').modal('hide');   
          });
     }

});

Handlebars.registerHelper('getDriverGridOptions', function(status,id) {
    switch (status){
        case 'Free':
        return [{'option':'Edit','_id':id,'id':'edit-driver'},
                {'option':'Docs','_id':id,'id':'docs-driver'},
                {'option':'Deactivate','_id':id,'id':'deactivate-driver'}];
        break;
        case 'Assigned':
        return [{'option':'Edit','_id':id,'id':'edit-driver'},
                {'option':'Docs','_id':id,'id':'docs-driver'}];
        break;
        case 'Deactivated':
        return [{'option':'Edit','_id':id,'id':'edit-driver'},
                {'option':'Activate','_id':id,'id':'activate-driver'}];
        break;
    }
});
