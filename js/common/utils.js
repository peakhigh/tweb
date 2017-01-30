UTILS = new function () {
    this.getCurrentTemplateData = function (page){
        return UTILS.getTemplateData(CURRENT_PAGE);
    }
    this.getTemplateData = function (page){
        let data = STORAGE.getItem(page+'-template-data');
        if (data) {
            return JSON.parse(data);
        } else {
            return {};
        }
    }
};