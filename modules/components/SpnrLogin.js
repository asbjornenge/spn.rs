var React = require('react')

var SpnrLogin = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                id : 'SpnrLogin'
            },[
                React.DOM.img({ className : 'logo', src : '/images/logo.png' }),
                React.DOM.p({}, 'Select login service'),
                React.DOM.div({ className : 'loginbutton github',   onTouchEnd : this.loginGithub }),
                React.DOM.div({ className : 'loginbutton facebook', onTouchEnd : this.loginFacebook })
            ])
        )
    },
    loginGithub : function() {
        this.props.emitter.trigger('login','github')
    },
    loginFacebook : function() {
        this.props.emitter.trigger('login','facebook')
    }
})

module.exports = SpnrLogin
