require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var Details    = require('../modules/components/SpnrDetails')
var mockState  = require('./mock')

ReactTestUtils = React.addons.TestUtils

describe('SpnrDetails', function() {

    var _details;

    before(function(done) {
        _details = React.renderComponent(Details({state:mockState, emitter:emitter, spnr:mockState.current}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrDetails')
        assert(element.length === 1)
    })

    // it('Should emit a logout event on .logout click', function(done) {
    //     var handler = function() { assert(true); emitter.off('logout', this); done() }
    //     emitter.on('logout', handler)
    //     var _logout = ReactTestUtils.findRenderedDOMComponentWithClass(_details, 'logout')
    //     ReactTestUtils.Simulate.touchEnd(_logout)
    // })

    // it('Should emit a add_click event on .add click', function(done) {
    //     var handler = function() { assert(true); emitter.off('add_click', this); done() }
    //     emitter.on('add_click', handler)
    //     var _add = ReactTestUtils.findRenderedDOMComponentWithClass(_details, 'add')
    //     ReactTestUtils.Simulate.touchEnd(_add)
    // })

})
