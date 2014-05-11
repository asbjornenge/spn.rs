require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var ListItem   = require('../modules/components/SpnrListItem')

ReactTestUtils = React.addons.TestUtils

var state = {
    avatars : {}
}
var spnr  = {
    spnr : 'Rene pumper',
    user : 1
}

describe('SpnrListItem', function() {

    var _listeItem;

    before(function(done) {
        _listeItem = React.renderComponent(ListItem({state:state, emitter:emitter, spnr:spnr}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrListItem')
        assert(element.length === 1)
    })

    it('Should render the spnr.spnr', function() {
        var element = document.querySelectorAll('.SpnrListItemSpnrBox')[0]
        assert(element.innerHTML === 'Rene pumper')
    })

})
