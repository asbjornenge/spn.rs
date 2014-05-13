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

})
