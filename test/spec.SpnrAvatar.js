require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var Avatar     = require('../modules/components/SpnrAvatar')

ReactTestUtils = React.addons.TestUtils

describe('SpnrAvatar', function() {

    var _avatar;

    before(function(done) {
        _avatar = React.renderComponent(Avatar({state:{avatars:{}}, emitter:emitter, user:{}}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrAvatar')
        assert(element.length === 1)
    })

    it('Should set a temporary avatar if no url exists on user', function() {
        var element = document.querySelectorAll('.SpnrAvatar')
        assert(element[0]._style.indexOf('/images/avatar.gif') > 0)
    })

    it('Should set the appropriate url if it exists on user', function(done) {
        var state = {avatars:{1:{url:'/some/url.png'}}}
        var user  = {id:1}
        _avatar = React.renderComponent(Avatar({state:state, emitter:emitter, user:user}), document.body, function() {
            var element = document.querySelectorAll('.SpnrAvatar')
            assert(element[0]._style['background-image'] === 'url(/some/url.png)')
            done()
        })        
    })

})
