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
        let user = localStorage.getItem('loggedInUser');
        if(user) {
            return JSON.parse(user);
        }
        return null;
    }
    this.setToken = function(response) {
        if(response && response.token) {
            localStorage.setItem('auth-token', response.token);
            localStorage.setItem('loggedInUser', JSON.stringify(response.user));
        }
    }
    this.clearToken = function() {
        localStorage.removeItem('auth-token');
    }
    this.testToken = function() {
        //TODO - test from the backend
        return localStorage.getItem('auth-token') ? true : false;
    }
}