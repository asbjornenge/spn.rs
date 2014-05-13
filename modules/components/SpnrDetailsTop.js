var React      = require('react')
var SpnrAvatar = require('./SpnrAvatar')

var SpnrDetails = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                className : 'SpnrDetailsTop'
            },[
                SpnrAvatar({ state : this.props.state, emitter : this.props.emitter, user_id : this.props.spnr.user }),
                React.DOM.h1({}, this.props.spnr.spnr.slice(0,35))
            ])
        )
    }
})

module.exports = SpnrDetails