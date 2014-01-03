define([], function() {

    function localdb(backend) {
        this.user   = JSON.parse(this.get('spn.rs.user'))
        var gf      = JSON.parse(this.get('spn.rs.feed.global'))
        var uf      = this.get('spn.rs.feed.user')
        this.feeds  = {
            global : gf ? gf : [],
            user   : uf ? uf : []
        }
        var gll     = this.get('spn.rs.latest.global.loaded');
        var gls     = this.get('spn.rs.latest.global.seen');
        this.latest = {
            global : {
                loaded : gll ? gll : null,
                seen   : gls ? gls : null
            }
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
                break;
        }
    }

    /** QUERY **/

    localdb.prototype.all = function(feed) {
        return this.feeds[feed];
    }

    localdb.prototype.last = function(feed, state) {
        return this.latest[feed][state];
    }

    /** LOCALSTORAGE **/

    localdb.prototype.set = function(key, value) {
        localStorage.setItem(key, value);
        return this
    }
    localdb.prototype.get = function(key) {
        return localStorage.getItem(key);
    }
    var localStorageUpdateInterval;
    localdb.prototype.sync = function(interval) {
        if (localStorageUpdateInterval != undefined) return;
        if (interval < 3000) interval = 3000;
        localStorageUpdateInterval = setInterval(function() {
            console.log(this.feeds.global)
            console.log(this.latest.global.loaded)
            this
              .set('spn.rs.user',        JSON.stringify(this.user))
              .set('spn.rs.feed.global', JSON.stringify(this.feeds.global))
              .set('spn.rs.latest.global.loaded', this.latest.global.loaded)
              .set('spn.rs.latest.global.seen', this.latest.global.seen)
            // .set('spn.rs.feed.user',   JSON.stringify(localdb.feeds.user))
            // .set('spn.rs.unsynced',    JSON.stringify(localdb.unsynced))
        }.bind(this),interval)
    }
    localdb.prototype.reset = function() {
        this.feeds.global = []
        this.latest.global.loaded = null
    }

    return localdb;

})
