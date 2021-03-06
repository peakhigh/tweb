STORAGE = new function() {
    this.getItem = function(key) {
        return localStorage.getItem(key) || '';
    }
    this.setItem = function(key, value) {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, value ? JSON.stringify(value): '');
        }
    }
    this.removeItem = function(key) {
        localStorage.removeItem(key);
    }
}