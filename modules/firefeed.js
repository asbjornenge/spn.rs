var firecracker = require('firecracker')

function firefeed(root, state) {
    this.root      = root
    this.state     = state
    this.cracker   = firecracker(root)
    this.listeners = {}
}
firefeed.prototype.feed = function(feed) {
    var path = feed
    if (feed == 'mine') path = 'users/'+this.state.user.uid+'/spnrs'
    this._feed = feed
    this.cracker
        .path(path)
        .from(this.state.latest[feed].loaded)
    return this
}
firefeed.prototype.on = function(event, fn) {
    this.cracker.on(event, eventWrapper(event, fn, this))
    return this
}
firefeed.prototype.pause = function() {
    this.cracker.root.off()
}
firefeed.prototype.listen = function() {
    this.cracker.listen()
    return this
}

function eventWrapper(event, fn, ff) {
    if (event == 'child_added') {
        return function(child) {
            var filtered = ff.state[ff._feed].filter(function(s) { return s.uuid == child.uuid })
            if (filtered.length > 0) return
            ff.state.latest[ff._feed].loaded = child.fid
            fn(child)
        }
    }
    return fn
}

module.exports = function(root, state) {
    return new firefeed(root, state)
}
