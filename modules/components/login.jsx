/** @jsx React.DOM */

var React = require('react')

var Login = React.createClass({
    render : function() {
        return (
            <div id="loginWrapper">
                <img className="logo" src="/images/logo.png" />
                <p>Select login service</p>
                <div className="loginbutton github"   onTouchEnd={this.loginGithub}></div>
                <div className="loginbutton facebook" onTouchEnd={this.loginFacebook}></div>
            </div>
        )
    },
    loginGithub : function() {
        this.props.emitter.trigger('login','github')
    },
    loginFacebook : function() {
        this.props.emitter.trigger('login','facebook')
    }
})

module.exports = Login
