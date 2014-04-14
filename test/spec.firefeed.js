var assert    = require('assert')
var fireposer = require('../modules/fireposer')
var firefeed  = require('../modules/firefeed')

var fakestate = {
    latest : {
        global : {},
        mine   : {}
    },
    user : {
        uid : 1234
    }
}

var fakeroot = {
    push    : function()      { return fakeref },
    remove  : function(id,cb) { cb() },
    once    : function(e,cb)  { cb(fakeref) },
    on      : function(e,fn)  { this.fns ? this.fns.push(fn) : this.fns = [fn] },
    trigger : function(e,d)   { this.fns.forEach(function(fn) { fn(d) }) }
}

describe('FEED', function() {

    it('Should remember its feed', function() {
        var ff = firefeed(fakeroot,fakestate).feed('global')
        assert(ff._feed == 'global')
        assert(ff.poser._path == 'global')
    })

    it('Should bind listeners with .on', function() {
        var ff = firefeed(fakeroot,fakestate)
                    .feed('global')
                    .on('child_added', function(child) {})
        assert(ff.poser.listeners.child_added.length === 1)
    })

    it('Should transform the mine feed', function() {
        var ff = firefeed(fakeroot,fakestate).feed('mine')
        assert(ff.poser._path == 'users/'+fakestate.user.uid+'/spnrs')
    })

})
