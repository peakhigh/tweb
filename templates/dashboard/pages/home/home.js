$(document).ready(function () {

    navigateToPage = function(page){
        var extras;
        switch(page){
            case 'Quoted':
            case 'Paymentpending':
            case 'Running':
            case 'Assigned':
           extras ={ data : {
                status: page
            }};
            page = 'manageTrip';
            break;
        }
        MENU_HELPER.menuClick(page, page, extras);
    }
});