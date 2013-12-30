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
            var addinput;
            if (this.state.adding) addinput = <input type="text" ref="addInput" onKeyPress={this.handleAddInput} />
            return (
                <div id="spnrsWrapper">
                    <ul class="top">
                        <li onClick={this.handleLogout}>Logout</li>
                        <li onClick={this.handleAddClick}>Add</li>
                    </ul>
                    <div class="spnrscroll">
                        {addinput}
                    </div>
                    <ul class="bottom">
                        <li>Global</li>
                        <li>Feed</li>
                        <li>User</li>
                    </ul>
                </div>
            )
        },
        getInitialState : function() {
            return {
                adding : false
            }
        },
        handleLogout : function() {
            radio('user.logout').broadcast()
        },
        handleAddClick : function() {
            this.setState({adding:true})
        },
        handleAddInput : function(e) {
            if (e.which == 13) {
                radio('spnrs.add').broadcast(this.refs.addInput.getDOMNode().value);
            }
        }
    });
    Spnrs.attach = function(mountNode, settings, callback) {
        React.renderComponent(<Spnrs settings={settings} />, mountNode, callback)
    };

    return Spnrs

})
