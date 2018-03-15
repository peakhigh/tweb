API_HELPER = new function() {
    this.login = function(uname, pass,callback) {
        $.ajax({
            url: CONSTANTS.apiServer + 'auth/login',
            data: {
                 username: uname,
                 password: pass
            },
            dataType: 'json',
            type: 'POST',            
            success: function (response) {  
                API_HELPER.setToken(response);   
                window.location = '/dashboard.html';                             
                callback(null,response);
            },
            error: function (e) {
                console.log(e);
                callback(e,null);
            }
        });
    }
    this.logout = function() {
        API_HELPER.clearToken();    
        window.location = '/';
    }   
    this.getLoggedInUser = function() {
        let user = STORAGE.getItem('loggedInUser');
        if(user) {
            return JSON.parse(user);
        }
        return null;
    }
    this.setToken = function(response) {
        if(response && response.token) {
            STORAGE.setItem('auth-token', response.token);
            STORAGE.setItem('loggedInUser', response.user);
        }
    }
    this.getToken = function() {
        return STORAGE.getItem('auth-token') || '';
    }
    this.clearToken = function() {
        STORAGE.removeItem('auth-token');
        STORAGE.removeItem('viewAsUser');
    }
    this.testToken = function() {
        //TODO - test from the backend
        return STORAGE.getItem('auth-token') ? true : false;
    }
    this.loadService = function(options, callback) {

        $.ajax({
            type: 'GET', 
            dataType: 'json',
            url: CONSTANTS.apiServer + options.service + ((options.extraOptions && options.extraOptions.extraHref) ? '/' + options.extraOptions.extraHref : ''),
            // headers: {'Authorization': 'Bearer ' + API_HELPER.getToken()},                                   
            data: options.data || {},
            success: function (response) {  
                callback(null, response);
            },
            error: function (e) {
                callback(e, null);
            }
        });
    }
    this.uploadFiles = function(options,callback){

        $.ajax({
            url: CONSTANTS.apiServer + options.uri + "?"+ options.extraHref,
            data: options.formData,
            type: options.type,       
            cache: false,
            contentType: false,
            processData: false,     
            success: function (response) {  
                callback(null, response);                  
            },
            error: function (e) {
                callback(e, null);
            }
        });
    }
    this.downloadFile = function(options, callback){
        $.ajax({
            url: CONSTANTS.apiServer + options.uri + "?"+ options.extraHref,
            data: options.formData,
            type: options.type,       
            cache: false,
            contentType: false,
            processData: false,     
            success: function (response) {  
                callback(null, response);                  
            },
            error: function (e) {
                callback(e, null);
            }
        });
    }
    this.postData = function(options,callback){
        var uri = CONSTANTS.apiServer + options.uri;
        if(options.extraHref){
            uri = uri + "?" + options.extraHref;
        }
        $.ajax({
            url: uri,
            data: options.formData,
            type: options.type,    
            dataType: 'json',  
            cache: false,
            contentType: 'application/json',
            processData: false,     
            success: function (response) {  
                callback(null, response);                  
            },
            error: function (e) {
                callback(e, null);
            }
        });
    }

    this.setViewAsUser = function(response) {
        console.log("setViewAsUser",response);
        if(response) {
            STORAGE.setItem('viewAsUser', response);
        }else {
            STORAGE.removeItem('viewAsUser');
        }
    }


    this.getViewAsUser = function(response) {
        let user = STORAGE.getItem('viewAsUser');
        if(user) {
            return JSON.parse(user);
        }
        return null;
    }

    this.attachPreFiltersToAllAjaxRequests = function() {
        $.ajaxPrefilter( function(options) {
            // set tokens for all the api requests
            if (options.url.indexOf(CONSTANTS.apiServer) === 0) {
                options.headers = {'Authorization': 'Bearer ' + API_HELPER.getToken()};        
            } 
            
            let loggedInUser = API_HELPER.getLoggedInUser();
             if(loggedInUser.role === 'CALL_CENTER_USER' && API_HELPER.getViewAsUser()){
                  options.headers = $.extend(options.headers, {'owner': JSON.stringify(API_HELPER.getViewAsUser())}); 
            } else{
                var user = {
                    _id : loggedInUser._id,
                    role : loggedInUser.role
                };
                options.headers = $.extend(options.headers, {'owner': JSON.stringify(user)}); 
            }
        });
    }
}