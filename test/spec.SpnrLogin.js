require('./dom')()
var assert     = require('assert')
var React      = require('react')
var ReactUtils = require('react/addons')
var emitter    = require('nanoemitter')()
var Login      = require('../modules/components/SpnrLogin')

ReactTestUtils = React.addons.TestUtils

describe('SpnrListItem', function() {

    var _login;

    before(function(done) {
        _login = React.renderComponent(Login({state:{}, emitter:emitter}), document.body, function() {
            done()
        })
    })

    it('Should render some markup', function() {
        var element = document.querySelectorAll('.SpnrLogin')
        assert(element.length === 1)
    })

    it('Should trigger a login event if a login service is clicked', function(done) {
        var github_handler   = function(service) { assert(service === 'github'); emitter.off('login', github_handler); }
        var facebook_handler = function(service) { assert(service === 'facebook'); emitter.off('login', facebook_handler); done() }
        var _github   = ReactTestUtils.findRenderedDOMComponentWithClass(_login, 'github')
        var _facebook = ReactTestUtils.findRenderedDOMComponentWithClass(_login, 'facebook')
        emitter.on('login', github_handler)
        ReactTestUtils.Simulate.touchEnd(_github)
        emitter.on('login', facebook_handler)
        ReactTestUtils.Simulate.touchEnd(_facebook)
    })

})
