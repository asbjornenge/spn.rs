/**
 * @jsx React.DOM
 */

define([
    'react',
    'radio',
    'comp/spnr'
],
function(
    React,
    radio,
    Spnr
) {

    var Spnrs = React.createClass({
        render : function() {
            var addinput, spnrs;
            if (this.props.state.adding) addinput = <input type="text" ref="addInput" onKeyPress={this.handleAddInput} />
            spnrs = this.props.state[this.props.state.view].map(function(spnr) {
                return <Spnr spnr={spnr} state={this.props.state} />
            }.bind(this))
            return (
                <div id="spnrsWrapper">
                    <ul class="top">
                        <li onClick={this.handleLogout}>Logout</li>
                        <li class="logo">LOGO</li>
                        <li onClick={this.handleAddClick}>Add</li>
                    </ul>
                    <div class="spnrscroll">
                        {addinput}
                        {spnrs}
                    </div>
                    <ul class="bottom">
                        <li onClick={this.handleChangeViewClick} class={this.props.state.view == 'global'    ? 'global selected'    : 'global'}>Global</li>
                        <li onClick={this.handleChangeViewClick} class={this.props.state.view == 'favorites' ? 'favorites selected' : 'favorites'}>Favorites</li>
                        <li onClick={this.handleChangeViewClick} class={this.props.state.view == 'mine'      ? 'mine selected'      : 'mine'}>Mine</li>
                    </ul>
                </div>
            )
        },
        componentDidUpdate : function(prevProps, prevState) {

            if (this.props.state.adding) {
                setTimeout(function() {
                    this.refs.addInput.getDOMNode().focus();
                }.bind(this),100)
            }

        },
        handleLogout : function() {
            radio('ui.event.logout').broadcast()
        },
        handleAddClick : function() {
            radio('state.change').broadcast({adding:!this.props.state.adding})
        },
        handleAddInput : function(e) {
            if (e.which == 13) {
                var node = this.refs.addInput.getDOMNode();
                if (node.value.length > 0) radio('ui.event.add').broadcast(node.value);
                node.value = "";
            }
        },
        handleChangeViewClick : function(e) {
            radio('state.change').broadcast({view:e.target.className})
        }
    });
    Spnrs.attach = function(mountNode, state, callback) {
        React.renderComponent(<Spnrs state={state} />, mountNode, callback)
    };

    return Spnrs

})
