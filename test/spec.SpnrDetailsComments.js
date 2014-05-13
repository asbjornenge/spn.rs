require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var DetailsComments = require('../modules/components/SpnrDetailsComments')
var mockState  = require('./mock')

ReactTestUtils = React.addons.TestUtils

describe('SpnrDetailsComments', function() {

    var _details;

    before(function(done) {
        _details = React.renderComponent(DetailsComments({state:mockState, emitter:emitter, spnr:mockState.global[1]}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrDetailsComments')
        assert(element.length === 1)
        var element = document.querySelectorAll('input')
        assert(element.length === 1)
    })

})
