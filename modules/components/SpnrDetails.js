var React               = require('react')
var SpnrDetailsTop      = require('./SpnrDetailsTop')
var SpnrDetailsComments = require('./SpnrDetailsComments')

var SpnrDetails = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                className : 'SpnrDetails'
            },[
                SpnrDetailsTop({ state : this.props.state, emitter : this.props.emitter, spnr : this.props.spnr }),
                SpnrDetailsComments({ state : this.props.state, emitter : this.props.emitter, spnr : this.props.spnr })
            ])
        )
    }
})

module.exports = SpnrDetails