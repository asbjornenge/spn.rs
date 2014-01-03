define([
    'fb/firebase',
    'fb/firebase-simple-login'
], function() {

    // backend.prototype.setuser = function(user) {
    //     this.user = user;
    //     return this;
    // }
    // backend.prototype.listen = function() {
    //     /* BACKEND */
    //     var global_last_read = localstore.get('feeds.global.lastread');
    //     var global_bulk_ref  = this.root.child('spnrs').endAt(global_last_read).limit(10);

    //     global_bulk_ref.once('value', function(data) {
    //         // TODO: What about having that bulk data in localStorage?
    //         var bulk = [];
    //         data.forEach(function(snap) { bulk.push(new spnr.Spnr(snap)) })
    //         var last = bulk.pop()
    //         radio('feeds.global.bulk').broadcast(bulk.reverse());
    //         this.root.child('spnrs').startAt(null, last.uuid).on('child_added', function(child) {
    //             radio('feeds.global.new').broadcast(new spnr.Spnr(child))
    //         })
    //     }.bind(this))
    //     /* FRONTEND */
    //     radio('spnrs.add').subscribe(function(spnr) {
    //         this.root.child('spnrs').push({user:this.user.id, spnr:spnr})
    //     }.bind(this))
    // }

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
        this.login   = []
        this.startAt = null
    }

    remotedb.prototype.from    = function(last_seen) { this.startAt = last_seen; return this }
    remotedb.prototype.on      = function(event, fn) { this[event].push(fn); return this }
    remotedb.prototype.take    = function(num) { /* 'value' + .limit(?) */ return this }
    remotedb.prototype.start   = function() {
        var feed = conn.root.child(this.feed), added;
        if (this.startAt) feed = feed.startAt(null, this.startAt)

        console.log(this.startAt)

        feed.on('child_added', function(child) {
            this.added.forEach(function(fn) { fn(child) })
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
