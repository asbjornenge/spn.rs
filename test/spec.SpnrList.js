require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var List       = require('../modules/components/SpnrList')

ReactTestUtils = React.addons.TestUtils

var state = {
    view    : 'global',
    global  : [{user:1},{user:2}],
    avatars : []
}

describe('SpnrAppList', function() {

    var _list;

    before(function(done) {
        _list = React.renderComponent(List({state:state, emitter:emitter}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var list      = document.querySelectorAll('.SpnrList')
        var listitems = document.querySelectorAll('.SpnrListItem')
        assert(list.length === 1)
        assert(listitems.length === 2)
    })

})
