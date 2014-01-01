define([
    'fb/firebase',
    'fb/firebase-simple-login'
], function() {

    var conn = {
        host : null,
        root : null,
        auth : null
    }

    /** REMOTE DB **/

    function remotedb(feed) {
        this.feed = feed;
    }

    remotedb.prototype.from    = function(last_seen) { return this }
    remotedb.prototype.on      = function(event, fn)
    {
        switch(event) {
            case 'login':
                this.auth = new FirebaseSimpleLogin(this.root, function(error, user) {
                    fn(user);
                    // radio('user.logged_in').broadcast(error ? error : user ? user : null)
                });
                break;
        }
        return this
    }
    remotedb.login  = function(provider)
    {
        var options = {}
        switch(provider) {
            case 'github':
                options = { rememberMe : true, scope : 'user'}
                break;
        }
        this.auth.login(provider, options);
        return this
    }
    remotedb.logout = function()
    {
        this.auth.logout();
        return this
    }
    remotedb.prototype.take   = function(num) { return this }

    /** RETURN FUNC **/

    function rfunc(feed) { return new remotedb(feed) }
    rfunc.login = function(provider)
    {
        var options = {}
        switch(provider) {
            case 'github':
                options = { rememberMe : true, scope : 'user'}
                break;
        }
        conn.auth.login(provider, options);
    }
    rfunc.logout = function()
    {
        conn.auth.logout();
    }
    rfunc.connect = function() {
        conn.root = new Firebase(conn.host);
    }

    return function(host) { conn.host = host; return rfunc}

})
