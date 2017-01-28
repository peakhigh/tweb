UTILS = new function () {
    this.getCurrentTemplateData = function (){
        return STORAGE.getItem(CURRENT_PAGE+'-template-data');
    }
    this.getTemplateData = function (page){
        return STORAGE.getItem(page+'-template-data');
    }
};