define(['chai','scripts/remotedb'], function(chai, remotedb) {

    describe('REMOTEDB', function() {

        var assert  = chai.assert;
        var rdb     = remotedb('http://dead.spn.rs');
        var global;

        it('Should return a function', function() {
            assert.ok(typeof rdb === 'function')
        })

        it('Should throw an error when unable to connect', function() {
            rdb.connect()
            global = rdb('global')
            assert.ok(typeof global === 'object')
        })

        it('Should register .on calls', function() {
            global.on('added', function() {})
            assert.equal(global.added.length, 1)
        })

        it('Should start all feeds for rdb.start', function(done) {
            global.start = function() { assert.ok(true); done() }
            rdb.start()
        })

    })

})
