var React = require('react')

var SpnrAppBottom = React.createClass({
    render : function() {
        return (
            React.DOM.ul({
                className : 'SpnrAppBottom'
            },[
                React.DOM.li({ 
                    className  : this.props.state.view == 'global' ? 'global selected' : 'global',
                    onTouchEnd : this.handleChangeViewClick
                }, 'Global'),
                React.DOM.li({ 
                    className  : this.props.state.view == 'favorites' ? 'favorites selected' : 'favorites',
                    onTouchEnd : this.handleChangeViewClick 
                }, 'Favorites'),
                React.DOM.li({ 
                    className  : this.props.state.view == 'mine' ? 'mine selected' : 'mine',
                    onTouchEnd : this.handleChangeViewClick 
                }, 'Mine')
            ])
        )
    },
    handleChangeViewClick : function(e) {
        if (e.target.className.indexOf(this.props.state.view) >= 0) return
        this.props.emitter.trigger('change_view', e.target.className)
    }
})

module.exports = SpnrAppBottom