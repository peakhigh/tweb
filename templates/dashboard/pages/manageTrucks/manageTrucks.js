console.log('template data', UTILS.getCurrentTemplateData());
$(document).ready(function () {
    var moduleData = UTILS.getCurrentTemplateData();
    var grid = new GRID_HELPER.GRID('.manage-trucks-content', {
        gridData: moduleData,
        drawSort: false,
        gridId: 'gridManageTrucks',
        rowConfig: {            
            template: 'grid-row-template-details',
            optionsTemplate: 'grid-row-options-template',
         	optionsPostRender: function(rowElement, record) {
                console.log(record);
                $(rowElement).find('.edit-truck').click(function() {
                    MENU_HELPER.menuClick('addTruck', 'manageTrucks', {extraHref: record._id});
                });

                $(rowElement).find('.docs-truck').click(function() {
                    MENU_HELPER.menuClick('uploadDocs', 'manageTrucks', {extraHref: record._id});
                });

                 $(rowElement).find('.mark-running').click(function() {
                    //MENU_HELPER.menuClick('setDriver', 'manageTruck', {extraHref: record._id});
                });

                $(rowElement).find('.mark-free').click(function() {
                    changeTruckStatus(record,"Free");
                });

                $(rowElement).find('.activate-truck').click(function() {
                    changeTruckStatus(record,"Free");
                });

                $(rowElement).find('.deactivate-truck').click(function() {
                    changeTruckStatus(record,"Deactivated");
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
        MENU_HELPER.menuClick('manageTrucks','manageTrucks',options);
    }

    changeTruckStatus =  function (record,status){
          console.log(status);
          var source = $('#truckmodal').html(); 
           var template1 = Handlebars.compile(source);
          $('body').append(template1());    
           $('#truckmodalid').modal({show: true, background: true});      
  
           $("#yes").click(function(){
              var options = {};
              options.formData = JSON.stringify({ tripDetails : record});
              options.uri = "trucks/service/setStatus";
              options.extraHref = "id="+record._id+"&status="+status;
              options.type = 'POST';
              
                  API_HELPER.postData(options, function (error, response) {
                      if (error) {
                                  console.log('error', error);
                                  return;
                      }
                      MENU_HELPER.menuClick('manageTrucks', 'manageTrucks', {extraHref: record._id});
                  }); 
  
                  $('#truckmodalid').modal('hide');   
          });
     }
});

Handlebars.registerHelper('getTruckGridOptions', function(status,id) {
    switch (status){
        case 'Free':
        return [{'option':'Edit','_id':id,'id':'edit-truck'},
                {'option':'Docs','_id':id,'id':'docs-truck'},
                {'option':'Mark Running','_id':id,'id':'mark-running'},
                {'option':'Deactivate','_id':id,'id':'deactivate-truck'}];
        break;
        case 'Running':
        return [{'option':'Edit','_id':id,'id':'edit-truck'},
                {'option':'Docs','_id':id,'id':'docs-truck'},
                {'option':'Mark Free','_id':id,'id':'mark-free'}];
        break;
        case 'Deactivated':
        return [{'option':'Edit','_id':id,'id':'edit-truck'},
                {'option':'Activate','_id':id,'id':'activate-truck'}];
        break;
    }
});