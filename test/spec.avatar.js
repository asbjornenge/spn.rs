var assert = require('assert')
var avatar = require('../modules/avatar')

var twentydaysago = new Date(); twentydaysago.setDate(twentydaysago.getDate() - 20)
var fakeuserid    = 1234
var fakestate     = {
    avatars : {
        'github:241600' : { url : 'base64Img', updated : new Date().getTime() },
        'github:241601' : { url : 'base64Img', updated : twentydaysago }
    }
}

describe('AVATAR', function() {

    // COMMENTED OUT TESTS THAT REQUIRE NETWORK - TEST ARE VALID

    // it('Should callback a true if user does not exist', function(done) {
    //     avatar.check('github:241602',fakestate, 10, function(render) {
    //         assert(render)
    //         done()
    //     })
    // })

    it('Should callback a false if user exist and has been recently updated', function(done) {
        avatar.check('github:241600',fakestate, 10, function(render) {
            assert(!render)
            done()
        })
    })

    // it('Should callback a true if user exist but has bot been updated for X days', function(done) {
    //     avatar.check('github:241601',fakestate, 10, function(render) {
    //         assert(render)
    //         done()
    //     })
    // })

})
