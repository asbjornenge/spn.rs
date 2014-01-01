define([], function() {

    function localdb(backend) {
        this.backend = backend;
        // read local data
        this.user     = this.get('spn.rs.user')
        var gf = this.get('spn.rs.feed.global')
        var uf = this.get('spn.rs.feed.user')
        this.feeds    = {
            global : gf ? gf : [],
            user   : uf ? uf : []
        }
        this.unsynced = this.get('spn.rs.unsynced')
        this.listeners = {}
    }

    localdb.prototype.init = function() {
        this.backend.connect();
        var gf = this.feeds.global;
        var last_global = gf.length > 0 ? gf[gf.length-1] : null;
        this.backend('global').from(last_global).on('added', function(spnr) {
            this.added('global', spnr)
        }.bind(this))
        // backend.on('feed.user.'+user.id+'.new', function(spnr) {
        // }.bind(this))

        // intervall localStorage writes ?
        return this
    }

    localdb.prototype.on = function(feed, fn) {
        this.listeners.feed != undefined ? this.listeners[feed].push(fn) : this.listeners[feed] = [fn];
        return this;
    }

    localdb.prototype.added = function(feed, spnr) {
        this.feeds[feed].unshift(spnr);
        if (this.listeners['feed.'+feed+'.added'] != undefined)
            this.listeners['feed.'+feed+'.added'].map(function(fn) { fn(spnr) })
    }

    // Add from the outside
    localdb.prototype.add = function(spnr) {
        this.feeds.global.unshift(spnr);
        // this.feeds.user.unshift(spnr)
        // add to unsynced
    }

    /** QUERY **/


    /** AUTH **/

    localdb.prototype.login = function(provider) {
        this.backend.login(provider);
        return this
    }
    localdb.prototype.logout = function() {
        this.backend.logout();
        return this
    }

    /** BASIC LOCALSTORAGE **/

    localdb.prototype.set = function(key, value) {
        localStorage.setItem(key, value);
        return this
    }
    localdb.prototype.get = function(key) {
        return localStorage.getItem(key);
    }

    return localdb;

})
