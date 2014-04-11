var fireposer = require('./fireposer')

function firefeed(root, state) {
    this.root      = root
    this.state     = state
    this.poser     = fireposer(root).from()
    this.listeners = {}
}
firefeed.prototype.feed = function(feed) {
    var path = feed
    if (feed == 'mine') path = 'users/'+this.state.user.uid+'/spnrs'
    this._feed = feed
    this.poser
        .path(path)
        .from(this.state.latest[feed].loaded)
    return this
}
firefeed.prototype.on = function(event, fn) {
    this.poser.on(event, eventWrapper(event, fn, this))
    return this
}
firefeed.prototype.listen = function() {
    this.poser.listen()
}

function eventWrapper(event, fn, ff) {
    if (event == 'child_added') {
        return function(child) {
            ff.state.latest[ff._feed].loaded = child.fid
            fn(child)
        }
    }
    return fn
}

module.exports = function(root, state) {
    return new firefeed(root, state)
}
