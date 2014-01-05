/**
 * @jsx React.DOM
 */

define([
    'react',
    'radio',
    'db'
],
function(
    React,
    radio,
    db
) {

    var Spnrs = React.createClass({
        render : function() {
            var addinput, spnrs;
            if (this.props.state.adding) addinput = <input type="text" ref="addInput" onKeyPress={this.handleAddInput} />
            spnrs = this.props.state[this.props.state.view].map(function(spnr) {
                return <p>{spnr.spnr}</p>
            })
            return (
                <div id="spnrsWrapper">
                    <ul class="top">
                        <li onClick={this.handleLogout}>Logout</li>
                        <li onClick={this.handleAddClick}>Add</li>
                    </ul>
                    <div class="spnrscroll">
                        {addinput}
                        {spnrs}
                    </div>
                    <ul class="bottom">
                        <li>Global</li>
                        <li>Favotites</li>
                        <li>Me</li>
                    </ul>
                </div>
            )
        },
        componentDidUpdate : function(prevProps, prevState) {

            /* ADDING */

            if (!prevProps.state.adding && this.props.state.adding) {
                setTimeout(function() {
                    this.refs.addInput.getDOMNode().focus();
                }.bind(this),100)
            }

        },
        handleLogout : function() {
            radio('user.logout').broadcast()
        },
        handleAddClick : function() {
            this.props.state.adding = !this.props.state.adding;
            radio('state.change').broadcast()
        },
        handleAddInput : function(e) {
            if (e.which == 13) {
                var node = this.refs.addInput.getDOMNode();
                radio('spnrs.add').broadcast(node.value);
                node.value = "";
            }
        }
    });
    Spnrs.attach = function(mountNode, state, callback) {
        React.renderComponent(<Spnrs state={state} />, mountNode, callback)
    };

    return Spnrs

})
