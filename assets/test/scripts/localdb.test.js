define(['chai','scripts/localdb','scripts/remotedb','radio'], function(chai, localdb, remotedb, radio) {

    describe('LOCALDB', function() {

        var assert  = chai.assert;
        var rdb     = new remotedb();
        var ldb     = new localdb(rdb);

        // it('Should call the backend login function for login', function(done) {
        //     rdb.auth = {login:function(provider) { assert.equal(provider,'github'); done() }}
        //     ldb.login('github')
        // })

        // it('Should call the backend logout function for logout', function(done) {
        //     rdb.auth = {logout:function(provider) { assert.ok(true); done() }}
        //     ldb.logout()
        // })

        it('Should register .on calls with listeners', function() {
            ldb.on('some.channel', function() {})
            assert.equal(ldb.listeners['some.channel'].length, 1)
        })

        it('Should trigger registered listeners when calling .added', function(done) {
            ldb.on('feed.global.added', function() { assert.ok(true); done() })
            ldb.added('global', {})
        })

    })

})
