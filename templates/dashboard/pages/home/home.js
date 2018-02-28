$(document).ready(function () {
    navigateToPage = function(page){
        var extras;
        console.log(page);
        switch(page){
            case 'manageRequests':
            case 'payments':
            MENU_HELPER.menuClick(page);
            break;
            case 'Quoted':
            case 'Paymentpending':
            case 'Running':
            case 'Assigned':
           extras ={ data : {
                status: page
            }};
            case 'manageTrip':
            page = 'manageTrip';
            MENU_HELPER.menuClick(page, page, extras);   
            break; 
            case 'manageTrucks':
            case 'manageUsers':
            MENU_HELPER.menuClick(page, page, extras);   
            break;   
        }
        
    }

});