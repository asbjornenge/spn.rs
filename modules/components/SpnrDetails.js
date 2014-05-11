var React = require('react')

var SpnrDetails = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                className : 'SpnrDetails'
            },[
                React.DOM.h1({}, this.props.state.current.spnr)
            ])
        )
    }
})

module.exports = SpnrDetails