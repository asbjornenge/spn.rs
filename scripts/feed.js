define(['radio'], function(radio) {

    function Feed(feed) {
        this.feed = feed;
        this.newfns = [];

        // LISTENERS
        radio('feed.'+feed+'.new').subscribe(function(spnr) {
            this.newfns.map(function(fn) { fn(spnr) })
        }.bind(this))
    }

    Feed.prototype.on = function(event, fn) {
        this[event+'fns'].push(fn);
        return this
    };

    Feed.prototype.off = function(event, fn) {
        var index;
        this[event+'fns'].map(function(f,i) {
            if (fn === f) index = i;
        });
        if (index != undefined) this[event+'fns'].splice(index,1)
        return this
    }

    Feed.prototype.all = function(fn) {
        fn([]);
        return this
    }

    Feed.prototype.take = function(num, fn) {
        fn([].slice(0,num));
        return this
    }

    return function(feed) { return new Feed(feed) }
})
