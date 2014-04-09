/**
 * @jsx React.DOM
 */

define([
    'react',
    'radio'
],
function(
    React,
    radio
) {

    var Login = React.createClass({
        render : function() {
            return (
                <div id="loginWrapper">
                    <img class="logo" src="/images/logo.png" />
                    <p>Select login service</p>
                    <div class="loginbutton github" onClick={this.loginGithub}></div>
                    <div class="loginbutton facebook" onClick={this.loginFacebook}></div>
                </div>
            )
        },
        loginGithub : function() {
            radio('ui.event.login').broadcast('github');
        },
        loginFacebook : function() {
            radio('ui.event.login').broadcast('facebook');
        }
    });
    Login.attach = function(mountNode, settings, callback) {
        React.initializeTouchEvents(true)
        React.renderComponent(<Login settings={settings} />, mountNode, callback)
    };

    return Login

})
