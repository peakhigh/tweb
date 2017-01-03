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
    this.setToken = function(response) {
        if(response && response.token) {
            sessionStorage.setItem('auth-token', response.token);
        }
    }
    this.clearToken = function() {
        sessionStorage.removeItem('auth-token');
    }
    this.testToken = function() {
        //TODO - test from the backend
        return sessionStorage.getItem('auth-token') ? true : false;
    }
}