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

})
