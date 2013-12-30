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

    var Spnrs = React.createClass({
        render : function() {
            return (
                <div id="spnrsWrapper">
                    <ul class="top">
                        <li onClick={this.logout}>Logout</li>
                    </ul>
                    <div class="spnrscroll"></div>
                    <ul class="bottom">
                        <li>Global</li>
                        <li>Feed</li>
                        <li>User</li>
                    </ul>
                </div>
            )
        },
        logout : function() {
            radio('user.logout').broadcast()
        }
    });
    Spnrs.attach = function(mountNode, settings, callback) {
        React.renderComponent(<Spnrs settings={settings} />, mountNode, callback)
    };

    return Spnrs

})
