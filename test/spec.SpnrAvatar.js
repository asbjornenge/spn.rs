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
        _avatar = React.renderComponent(Avatar({state:{avatars:{}}, emitter:emitter, user_id:1}), document.body, function() {
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
        _avatar = React.renderComponent(Avatar({state:state, emitter:emitter, user_id:1}), document.body, function() {
            var element = document.querySelectorAll('.SpnrAvatar')
            assert(element[0]._style['background-image'] === 'url(/some/url.png)')
            done()
        })        
    })

    it('Should trigger a check_avatar event upon render', function(done) {
        var state = {avatars:{}}
        var handler = function(user_id) { assert(user_id == 1); emitter.off('check_avatar', handler); done() }
        emitter.on('check_avatar', handler)
        _avatar = React.renderComponent(Avatar({state:state, emitter:emitter, user_id:1}), document.body)        
    })

})
