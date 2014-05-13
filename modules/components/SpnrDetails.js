var React          = require('react')
var SpnrDetailsTop = require('./SpnrDetailsTop')

var SpnrDetails = React.createClass({
    render : function() {
        return (
            React.DOM.div({
                className : 'SpnrDetails'
            },[
                SpnrDetailsTop({ state : this.props.state, emitter : this.props.emitter, spnr : this.props.spnr }),
            ])
        )
    }
})

module.exports = SpnrDetails