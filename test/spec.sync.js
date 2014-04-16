var assert = require('assert')
var _      = require('lodash')
var sync   = require('../modules/sync')

var mine = [
    { spnr : 'en snakkende bok', synced : false, user : 123 },
    { spnr : 'bits of a tear',   synced : false, user : 123 },
    { spnr : 'the flower shore', synced : true,  user : 123 }
]

var fakeChildGood = {
    setWithPriority : function(spnr, pri, cb) {
        cb(null)
    }
}

var fakeChildBad = {
    setWithPriority : function(spnr, pri, cb) {
        cb(true)
    }
}

var fakeRoot = {}

describe('SYNC', function() {

    it('Should expose a way to sync the "mine" feed', function(done) {
        fakeRoot.child = function() { return fakeChildGood }
        var clones     = _.clone(mine, true)
        sync.mine(clones, fakeRoot, function(synced) {
            assert(synced.length == 2)
            synced.forEach(function(s,i) {
                assert(s === clones[i])
                assert(s.synced)
                assert(s.uuid)
            })
            done()
        })
    })

    it('Should not modify the local copies if sync fails', function(done) {
        fakeRoot.child = function() { return fakeChildBad }
        var clones     = _.clone(mine, true)
        sync.mine(clones, fakeRoot, function(synced) {
            assert(synced.length == 0)
            clones.forEach(function(s,i) {
                assert(s.synced == mine[i].synced)
                if (i < 2) assert(s.uuid)
            })
            done()
        })
    })

})
