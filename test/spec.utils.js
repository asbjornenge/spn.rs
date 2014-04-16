var assert = require('assert')
var utils  = require('../modules/utils')


describe('UTILS', function() {

    it('Can create uid for variable length', function() {
        var uid = utils.uid(20)
        assert(uid.length == 20)
    })

})
