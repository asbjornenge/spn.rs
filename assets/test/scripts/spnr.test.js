define(['chai','scripts/spnr'], function(chai, Spnr) {

    describe('REMOTEDB', function() {

        var assert  = chai.assert;

        it('Should be JSON serializable', function() {
            var s = new Spnr('Bits of a tear'),
                j = JSON.stringify(s),
                p = JSON.parse(j);

            assert.equal(p.spnr, 'Bits of a tear')
        })

    })

})
