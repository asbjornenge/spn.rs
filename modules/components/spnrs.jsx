/** @jsx React.DOM */

var React = require('react')
var Spnr  = require('./spnr.jsx')

var Spnrs = React.createClass({
    render : function() {
        var addinput, spnrs;
        if (this.state.adding) addinput = <input type="text" ref="addInput" onKeyPress={this.handleAddInput} />
        spnrs = this.props.state[this.props.state.view].map(function(spnr) {
            return <Spnr spnr={spnr} state={this.props.state} emitter={this.props.emitter} />
        }.bind(this))
        return (
            <div id="spnrsWrapper">
                <ul className="top">
                    <li onClick={this.handleLogout}>Logout</li>
                    <li className="logo">LOGO</li>
                    <li onClick={this.handleAddClick}>Add</li>
                </ul>
                <div className="spnrscroll">
                    {addinput}
                    {spnrs}
                </div>
                <ul className="bottom">
                    <li onClick={this.handleChangeViewClick} className={this.props.state.view == 'global'    ? 'global selected'    : 'global'}>Global</li>
                    <li onClick={this.handleChangeViewClick} className={this.props.state.view == 'favorites' ? 'favorites selected' : 'favorites'}>Favorites</li>
                    <li onClick={this.handleChangeViewClick} className={this.props.state.view == 'mine'      ? 'mine selected'      : 'mine'}>Mine</li>
                </ul>
            </div>
        )
    },
    getInitialState : function() {
        return { adding : false }
    },
    componentDidUpdate : function(prevProps, prevState) {
        if (this.props.state.adding) {
        }
    },
    handleLogout : function() {
        this.props.emitter.trigger('logout')
    },
    handleAddClick : function() {
        this.setState({adding:!this.state.adding})
        if (this.state.adding) return
        setTimeout(function() {
            this.refs.addInput.getDOMNode().focus();
        }.bind(this),100)
    },
    handleAddInput : function(e) {
        if (e.which == 13) {
            var node = this.refs.addInput.getDOMNode();
            if (node.value.length > 0) this.props.emitter.trigger('add', node.value);
            node.value = "";
        }
    },
    handleChangeViewClick : function(e) {
        if (e.target.className.indexOf(this.props.state.view) >= 0) return
        this.props.state.view = e.target.className
        this.props.emitter.trigger('render')
    }
});

module.exports = Spnrs

