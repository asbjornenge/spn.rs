require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var Bottom     = require('../modules/components/SpnrAppBottom')

ReactTestUtils = React.addons.TestUtils

describe('SpnrAppBottom', function() {

    var _bottom;

    before(function(done) {
        _bottom = React.renderComponent(Bottom({state:{}, emitter:emitter}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrAppBottom')
        assert(element.length === 1)
    })

    it('Should emit a change_view events on view link click', function(done) {
        var mine_handler = function(view) { assert(view === 'mine'); emitter.off('change_view', mine_handler) }
        emitter.on('change_view', mine_handler)
        var _mine = ReactTestUtils.findRenderedDOMComponentWithClass(_bottom, 'mine')
        ReactTestUtils.Simulate.touchEnd(_mine)

        var favorites_handler = function(view) { assert(view === 'favorites'); emitter.off('change_view', favorites_handler) }
        emitter.on('change_view', favorites_handler)
        var _favorites = ReactTestUtils.findRenderedDOMComponentWithClass(_bottom, 'favorites')
        ReactTestUtils.Simulate.touchEnd(_favorites)

        var global_handler = function(view) { assert(view === 'global'); emitter.off('change_view', global_handler); done() }
        emitter.on('change_view', global_handler)
        var _global = ReactTestUtils.findRenderedDOMComponentWithClass(_bottom, 'global')
        ReactTestUtils.Simulate.touchEnd(_global)
    })

})
