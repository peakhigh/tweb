API_HELPER = new function() {
    this.login = function(uname, pass) {
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
            },
            error: function (e) {
                console.log(e);
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
            STORAGE.setItem('loggedInUser', JSON.stringify(response.user));
        }
    }
    this.getToken = function() {
        return STORAGE.getItem('auth-token') || '';
    }
    this.clearToken = function() {
        STORAGE.removeItem('auth-token');
    }
    this.testToken = function() {
        //TODO - test from the backend
        return STORAGE.getItem('auth-token') ? true : false;
    }
    this.loadService = function(options, callback) {
        $.ajax({
            type: 'GET', 
            dataType: 'json',
            url: CONSTANTS.apiServer + options.service,
            headers: {'Authorization': 'Bearer ' + API_HELPER.getToken()},                                   
            success: function (response) {  
                callback(null, response);
            },
            error: function (e) {
                callback(e, null);
            }
        });
    }
}