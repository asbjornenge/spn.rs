var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var Top        = require('../modules/components/SpnrAppTop')

ReactTestUtils = React.addons.TestUtils

describe('SpnrAppTop', function() {

    var _top;

    before(function(done) {
        _top = React.renderComponent(Top({state:{}, emitter:emitter}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrAppTop')
        assert(element.length === 1)
    })

    it('Should emit a logout event on .logout click', function(done) {
        var handler = function() { assert(true); emitter.off('logout', this); done() }
        emitter.on('logout', handler)
        var _logout = ReactTestUtils.findRenderedDOMComponentWithClass(_top, 'logout')
        ReactTestUtils.Simulate.touchEnd(_logout)
    })


})
