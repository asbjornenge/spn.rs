define(['chai','feed','radio'], function(chai, feed, radio) {

    describe('FEED', function() {

        var assert = chai.assert;

        it('Should call registered .on functions', function(done) {
            feed('global').on('new', function() {assert.ok(true); done()})
            radio('feed.global.new').broadcast('new spnr');
        })

        it('Should remove registered functions on .off', function() {
            var callback = sinon.spy();
            feed('global').on('new', callback).off('new', callback)
            radio('feed.global.new').broadcast('new spnr');
            assert.ok(!callback.calledOnce)
        })

        it('Should return an array for .all calls', function(done) {
            feed('global').all(function(data) { assert.ok(data instanceof Array); done() })
        })

        it('Should return an array for .take calls', function(done) {
            feed('global').take(5,function(data) { assert.ok(data instanceof Array); done() })
        })

    })

})
