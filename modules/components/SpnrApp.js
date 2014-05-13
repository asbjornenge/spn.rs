var React             = require('react')
var _                 = require('lodash')
var Top               = require('./SpnrAppTop')
var Bottom            = require('./SpnrAppBottom')
var SpnrDetails       = require('./SpnrDetails')
var SpnrListContainer = require('./SpnrListContainer')

var SpnrApp = React.createClass({
    render : function() {
        var MainView, view = this.props.state.view;

        if (view === 'details') MainView = SpnrDetails({ state : this.props.state, emitter : this.props.emitter, spnr : this.props.state.current })
        else                    MainView = SpnrListContainer({ state : this.props.state, emitter : this.props.emitter })

        return (
            React.DOM.div({
                id : 'SpnrApp'
            }, [
                Top({ state : this.props.state, emitter : this.props.emitter }),
                MainView,
                Bottom({ state : this.props.state, emitter : this.props.emitter })
            ])
        )
    }
})

module.exports = SpnrApp