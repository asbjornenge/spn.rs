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

    function feedwrestler(feed) {
        if (feed == 'mine') feed = 'users/'+state.user.id+'/spnrs'
        this.feed    = feed
        this.startAt = null
    }

    feedwrestler.prototype.from    = function(last_seen) { this.startAt = last_seen; return this }
    feedwrestler.prototype.on      = function(event, fn) { !this[event] ? this[event] = [fn] : this[event].push(fn); return this }
    feedwrestler.prototype.take    = function(num) { /* 'value' + .limit(?) once */ return this }
    feedwrestler.prototype.ref     = function() {
        return conn.root.child(this.feed);
    }
    feedwrestler.prototype.add     = function(spnr) {
        return conn.root.child(this.feed).push(spnr);
    }
    feedwrestler.prototype.remove  = function(uuid, callback) {
        conn.root.child(this.feed).child(uuid).remove(callback);
        return this;
    }
    feedwrestler.prototype.listen = function() {
        var feed = conn.root.child(this.feed), added;
        if (this.startAt) feed = feed.startAt(null, this.startAt)

        feed.on('child_added', function(child) {
            if (this['child_added'] != undefined) this['child_added'].forEach(function(fn) { fn(child) })
        }.bind(this))

        feed.on('child_removed', function(child) {
            if (this['child_removed'] != undefined) this['child_removed'].forEach(function(fn) { fn(child) })
            this.removed.forEach(function(fn) { fn(child) })
        }.bind(this))
    }

    /** RETURN FUNC **/

    function remotedb(feed) {
        var f = new feedwrestler(feed);
        remotedb.feeds.push(f);
        return f
    }
    remotedb.listeners = {};
    remotedb.on = function(event, fn) {
        !this.listeners[event] ? this.listeners[event] = [fn] : this.listeners[event].push(fn);
        return this;
    }
    remotedb.dropFeeds = function() {
        remotedb.feeds = [];
    }
    remotedb.login = function(provider)
    {
        var options = {}
        switch(provider) {
            case 'github':
                options = { rememberMe : true, scope : 'user'}
                break;
            case 'facebook':
                options = { rememberMe: true, scope: 'email' }
                break;
        }
        conn.auth.login(provider, options);
    }
    remotedb.logout = function()
    {
        conn.auth.logout();
        if (!this.listeners.logout) return;
        this.listeners['logout'].forEach(function(fn) { fn() })
    }
    remotedb.connect = function() {
        conn.root = new Firebase(conn.host);
    }
    remotedb.listenLogin = function() {
        if (!this.listeners.login) return;
        conn.auth = new FirebaseSimpleLogin(conn.root, function(error, user) {
            this.listeners['login'].forEach(function(fn) { fn(user, error) })
        }.bind(this))
    }
    remotedb.listen = function() {
        this.feeds.forEach(function(f) { f.listen() })
    }
    remotedb.feeds = []

    return function(host) { conn.host = host; return remotedb}

})
