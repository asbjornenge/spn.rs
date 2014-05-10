var React    = require('react')
var SpnrList = require('./SpnrList')

var SpnrListContainer = React.createClass({
    render : function() {
        var AddInput;
        if (this.state.adding) AddInput = React.DOM.input({
            type        : 'text',
            ref         : 'addInput',
            placeholder : 'Whats up?',
            onKeyPress  : this.handleAddInput
        })
        return (
            React.DOM.div({
                className : 'SpnrListContainer'
            },[
                AddInput,
                SpnrList({ state : this.props.state, emitter : this.props.emitter })
            ])
        )
    },
    getInitialState : function() {
        return { adding : false }
    },
    handleAddInput : function(e) {
        if (e.which == 13) {
            var node = this.refs.addInput.getDOMNode();
            if (node.value.length > 0) this.props.emitter.trigger('add', node.value);
            node.value = "";
        }
    }
});

module.exports = SpnrListContainer

