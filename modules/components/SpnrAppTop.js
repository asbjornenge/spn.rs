var React = require('react')

var SpnrAppTop = React.createClass({
    render : function() {
        return (
            React.DOM.ul({
                className : 'SpnrAppTop'
            },[
                React.DOM.li({ className : 'logout', onTouchEnd : this.handleLogout }, 'Logout'),
                React.DOM.li({ className : 'logo' }),
                React.DOM.li({ className : 'add', onTouchEnd : this.handleAddClick }, 'Add')
            ])
        )
    },
    handleLogout : function() {
        this.props.emitter.trigger('logout')
    },
    handleAddClick : function() {
        this.props.emitter.trigger('add_click')
    },
})

module.exports = SpnrAppTop