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
                    <p>To use spn.rs you need to creat an account using one of the following:</p>
                    <div onClick={this.loginGithub}>Github</div>
                    <div onClick={this.loginFacebook}>Facebook</div>
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
        React.renderComponent(<Login settings={settings} />, mountNode, callback)
    };

    return Login

})
