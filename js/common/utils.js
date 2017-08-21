UTILS = new function () {
    this.getCurrentTemplateData = function (page){
        return UTILS.getTemplateData(page || CURRENT_PAGE);
    }
    this.getTemplateData = function (page){
        let data = STORAGE.getItem(page+'-template-data');
        if (data) {
            return JSON.parse(data);
        } else {
            return {};
        }
    }
    this.overrideObject = function(source, destination) {
        if (!destination) {
            destination = {};
        }
        if (source && Object.keys(source).length > 0) {
             Object.keys(source).forEach(function (key) {
                destination[key] = source[key];
            });
        }       
        return destination;
    }

};