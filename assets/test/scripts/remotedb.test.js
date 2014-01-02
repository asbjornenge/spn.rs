define(['chai','scripts/remotedb','radio'], function(chai, remotedb, radio) {

    describe('REMOTEDB', function() {

        var assert  = chai.assert;
        var rdb     = remotedb();

        it('Should get some proper tests soon', function() {
            assert.ok(rdb != undefined)
        })

    })

})
