require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var DetailsTop = require('../modules/components/SpnrDetailsTop')
var mockState  = require('./mock')

ReactTestUtils = React.addons.TestUtils

describe('SpnrDetailsTop', function() {

    var _details;

    before(function(done) {
        _details = React.renderComponent(DetailsTop({state:mockState, emitter:emitter, spnr:mockState.global[1]}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrDetailsTop')
        assert(element.length === 1)
    })

    it('Should render max 30 chars of the spnr', function() {
        var element = document.querySelectorAll('h1')[0]
        assert(element.innerHTML.toString().length == 35)
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
