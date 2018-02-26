console.log('template data acceptTripReq', UTILS.getCurrentTemplateData());

var selectedTruckId, selectedDriverId;
$(document).ready(function () {
    //var tripInfo = CURRENT_PAGE_CONFIG.extraOptions.tripDetails;
    var tripInfo = UTILS.getCurrentTemplateData().tripDetails;
    var config = UTILS.getCurrentTemplateData();
    var source   = $("#viewTripDetails").html();
    var template = Handlebars.compile(source);
    $(".accept-trip-content").html(template(tripInfo));
    
 
 getFreeTrucks = function() {
    
    var trucksData = new Bloodhound({ 
        datumTokenizer: function(d) {
        var test = Bloodhound.tokenizers.whitespace(d.value);
            $.each(test,function(k,v){
                i = 0;
                for (; i < v.length; i++) {
                    test.push(v.substr(i,v.length));
                    i++;
                }
            })
            return test;
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
          remote: {
            url: CONSTANTS.apiServer + "trucks/service/manageTrucks?status=Free",
            identify: function(obj) { 
                return obj.id; },
            ajax : {
                 type: "GET"
             },
             filter: function(data) {
                 return $.map(data.data, function(item) {  
                     return {
                       id:item._id,value: item.plateNumber+" "+item.truckType
                     };
                 });
             }
        }
    });
    // If prefetch is used, clear cache
    trucksData.clearPrefetchCache();
    trucksData.initialize();


    var typeahead_elem = $('#truckid');
    typeahead_elem.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'value',
        displayKey: 'value',
        source: trucksData.ttAdapter(),
        templates: {
            empty: [
                '<div class="noitems">',
                'No Items Found',
                '</div>'
            ].join('\n')
        }
    });


    $('#truckid').on([
        'typeahead:selected'
    ].join(' '), function(x,datum) {
        selectedTruckId = datum.id; 
    });
    
}



getFreeDrivers = function() {
    
    var driversData = new Bloodhound({ 
        datumTokenizer: function(d) {
        var test = Bloodhound.tokenizers.whitespace(d.value);
            $.each(test,function(k,v){
                i = 0;
                for (; i < v.length; i++) {
                    test.push(v.substr(i,v.length));
                    i++;
                }
            })
            return test;
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
          remote: {
            url: CONSTANTS.apiServer + "drivers/service/manageDrivers?status=Free",
            identify: function(obj) { 
                return obj.id; },
            ajax : {
                 type: "GET"
             },
             filter: function(data) {
                 return $.map(data.data, function(item) {  
                     return {
                       id:item._id,value: item.plateNumber+" "+item.truckType
                     }; 
                 });
             }
        }
    });
    // If prefetch is used, clear cache
    driversData.clearPrefetchCache();
    driversData.initialize();


    var typeahead_elem = $('#driverid');
    typeahead_elem.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'value',
        displayKey: 'value',
        source: driversData.ttAdapter(),
        templates: {
            empty: [
                '<div class="noitems">',
                'No Items Found',
                '</div>'
            ].join('\n')
        }
    });


    $('#driverid').on([
        'typeahead:selected'
    ].join(' '), function(x,datum) {
        selectedDriverId = datum.id;
    });
    
}

    getFreeTrucks();

    getFreeDrivers();
});



$(function () {
    $("#btnsubmit").click(function (e) {
      e.preventDefault();
      var moduleData = UTILS.getCurrentTemplateData();

        moduleData.data.status = 'Accepted';
        if(selectedDriverId){
         moduleData.data.driverDetails = selectedDriverId;
        }
        if(selectedTruckId){
            moduleData.data.truckDetails = selectedTruckId;
        }

        var options = {};
		 options.formData = JSON.stringify(moduleData.data);
		options.uri = "requests/service/addRequest";
		options.extraHref = "id="+moduleData.data._id;
		options.type = 'POST';
		
		 API_HELPER.postData(options, function (error, response) {
		       if (error) {
		                  console.log('error', error);
		                  return;
		        }
		        MENU_HELPER.menuClick('manageRequests', 'manageRequests');
		 }); 


  });
});