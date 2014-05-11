var React      = require('react')
var SpnrAvatar = require('./SpnrAvatar')

var SpnrDetails = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                className : 'SpnrDetails'
            },[
                SpnrAvatar({ state : this.props.state, emitter : this.props.emitter, user_id : this.props.state.current.user }),
                React.DOM.h1({}, this.props.state.current.spnr)
            ])
        )
    }
})

module.exports = SpnrDetails