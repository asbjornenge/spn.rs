var assert    = require('assert')
var firefeed  = require('../modules/firefeed')

var fakeuid   = 'abc12345'
var fakestate = {
    global : [],
    mine   : [{ uuid : fakeuid }],
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
        assert(ff.cracker._path == 'global')
    })

    it('Should bind listeners with .on', function() {
        var ff = firefeed(fakeroot,fakestate)
                    .feed('global')
                    .on('child_added', function(child) {})
        assert(ff.cracker.listeners.child_added.length === 1)
    })

    it('Should transform the mine feed', function() {
        var ff = firefeed(fakeroot,fakestate).feed('mine')
        assert(ff.cracker._path == 'users/'+fakestate.user.uid+'/spnrs')
    })

    it('Should NOT call the child_added callback if child exists for the feed', function(done) {
        var cb = function(child) { assert(child.uuid != fakeuid); done() }

        var ff = firefeed(fakeroot,fakestate)
                    .feed('mine')
                    .on('child_added', cb)

        ff.cracker.listeners.child_added[0]({ uuid : fakeuid })
        ff.cracker.listeners.child_added[0]({ uuid : 'anotheruid' })
    })

})
