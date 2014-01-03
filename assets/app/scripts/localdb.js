define([], function() {

    function localdb(backend) {
        // read local data
        this.user = this.get('spn.rs.user')
        var gf    = this.get('spn.rs.feed.global')
        var uf    = this.get('spn.rs.feed.user')
        this.feeds    = {
            global : gf ? gf : [],
            user   : uf ? uf : []
        }
        this.unsynced = this.get('spn.rs.unsynced')
        this.listeners = {}
    }

    /** COMPOSEABLES **/

    localdb.prototype.on = function(feed, fn) {
        this.listeners.feed != undefined ? this.listeners[feed].push(fn) : this.listeners[feed] = [fn];
        return this;
    }

    localdb.prototype.trigger = function(feed, spnr) {
        this.cache(feed, spnr)
        if (this.listeners[feed] != undefined)
            this.listeners[feed].map(function(fn) { fn(spnr) })
        return this;
    }

    /** CACHE **/

    localdb.prototype.cache = function(feed, item) {
        switch(feed) {
            case 'feed.global.added':
                this.feeds.global.unshift(item);
                break;
            case 'login':
                if (navigator.onLine) this.user = item;
                else item = this.user;
                break;
        }
    }

    /** QUERY **/

    localdb.prototype.last_seen = function(feed) {
        var f = this.feeds[feed];
        return f.length > 0 ? f[f.length-1] : null;
    }

    /** AUTH **/

    // localdb.prototype.login = function(provider) {
    //     this.backend.login(provider);
    //     return this
    // }
    // localdb.prototype.logout = function() {
    //     this.backend.logout();
    //     return this
    // }

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
