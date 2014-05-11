var React        = require('react')
var SpnrListItem = require('./SpnrListItem')

var SpnrList = React.createClass({
    render : function() {
        SpnrListItems = this.props.state[this.props.state.view].map(function(spnr) {
            return SpnrListItem({spnr : spnr, state : this.props.state, emitter : this.props.emitter})
        }.bind(this))
        return (
            React.DOM.div({
                className : 'SpnrList'
            },[
                SpnrListItems
            ])
        )
    }
});

module.exports = SpnrList
