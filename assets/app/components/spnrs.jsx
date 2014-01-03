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
            if (this.state.adding) addinput = <input type="text" ref="addInput" onKeyPress={this.handleAddInput} />
            spnrs = this.state[this.state.view].map(function(spnr) {
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
                        <li>User</li>
                    </ul>
                </div>
            )
        },
        getInitialState : function() {
            // radio('feeds.global.bulk').subscribe(function(spnrs) {
            //     radio('feeds.global.new').subscribe(function(spnr) {
            //         var g = this.state.global;
            //         g.unshift(spnr)
            //         this.setState({global:g})
            //     }.bind(this))
            //     this.setState({global:spnrs})
            // }.bind(this))

            /* INITIAL STATE */

            return {
                adding : false,
                view   : 'global',
                global : db.local.all('global')
            }
        },
        componentDidUpdate : function(prevProps, prevState) {

            /* ADDING */

            if (!prevState.adding && this.state.adding) {
                setTimeout(function() {
                    this.refs.addInput.getDOMNode().focus();
                }.bind(this),100)
            }

        },
        handleLogout : function() {
            radio('user.logout').broadcast()
        },
        handleAddClick : function() {
            this.setState({adding:!this.state.adding})
        },
        handleAddInput : function(e) {
            if (e.which == 13) {
                var node = this.refs.addInput.getDOMNode();
                radio('spnrs.add').broadcast(node.value);
                node.value = "";
            }
        }
    });
    Spnrs.attach = function(mountNode, settings, callback) {
        React.renderComponent(<Spnrs settings={settings} />, mountNode, callback)
    };

    return Spnrs

})
