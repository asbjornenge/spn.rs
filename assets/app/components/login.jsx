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
                </div>
            )
        },
        loginGithub : function() {
            radio('user.login').broadcast('github');
        }
    });
    Login.attach = function(mountNode, settings, callback) {
        React.renderComponent(<Login settings={settings} />, mountNode, callback)
    };

    return Login

})
