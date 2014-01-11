define([
    'fb/firebase',
    'fb/firebase-simple-login'
], function() {

    var conn = {
        host : null,
        root : null,
        auth : null,
        user : null
    }

    /** REMOTE DB **/

    function remotedb(feed) {
        this.feed    = feed
        this.added   = []
        this.removed = []
        this.login   = []
        this.startAt = null
    }

    remotedb.prototype.from    = function(last_seen) { this.startAt = last_seen; return this }
    remotedb.prototype.on      = function(event, fn) { this[event].push(fn); return this }
    remotedb.prototype.take    = function(num) { /* 'value' + .limit(?) */ return this }
    remotedb.prototype.add     = function(spnr) {
        return conn.root.child(this.feed).push(spnr);
    }
    remotedb.prototype.remove  = function(uuid, callback) {
        conn.root.child(this.feed).child(uuid).remove(callback);
        return this;
    }
    remotedb.prototype.start   = function() {
        var feed = conn.root.child(this.feed), added;
        if (this.startAt) feed = feed.startAt(null, this.startAt)

        feed.on('child_added', function(child) {
            this.added.forEach(function(fn) { fn(child) })
        }.bind(this))

        feed.on('child_removed', function(child) {
            this.removed.forEach(function(fn) { fn(child) })
        }.bind(this))

        if (this.login.length == 0) return;
        conn.auth = new FirebaseSimpleLogin(conn.root, function(error, user) {
            this.login.forEach(function(fn) { fn(user, error) })
        }.bind(this))
    }

    /** RETURN FUNC **/

    function rfunc(feed) {
        var f = new remotedb(feed);
        rfunc.feeds.push(f);
        return f
    }
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
    rfunc.start = function() {
        this.feeds.forEach(function(f) { f.start() })
    }
    rfunc.feeds = []

    return function(host) { conn.host = host; return rfunc}

})
