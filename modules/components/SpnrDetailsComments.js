var React       = require('react')
var settings    = require('../settings')
var firecracker = require('firecracker')

var SpnrDetailsComments = React.createClass({
    render : function() {
        var Comments = this.state.comments.map(function(comment) {
            console.log(comment)
            return React.DOM.div({}, comment.comment)
        })
        return (
            React.DOM.div({
                className : 'SpnrDetailsComments'
            },[
                React.DOM.input({ type : 'text', placeholder : 'Comment?', ref : 'commentInput', onKeyPress  : this.handleCommentInput }),
                Comments
            ])
        )
    },
    getInitialState : function() {
        return {
            comments : []
        }
    },
    componentWillMount : function() {
        if (typeof Firebase === 'undefined') return
        var spnr         = this.props.spnr
        var comments_url = settings.firebase.root+'users/'+spnr.user+'/spnrs/'+spnr.uuid+'/comments'
        this.comments_firebase = new Firebase(comments_url)
        firecracker(this.comments_firebase)
            .take(30)
            .on('child_added', function(child) {
                this.setState({ comments : [child].concat(this.state.comments)})
            }.bind(this))
            .listen()
    },
    handleCommentInput : function(e) {
        if (e.which == 13) {
            var node = this.refs.commentInput.getDOMNode();
            this.comments_firebase.push({ user : this.props.state.user.uid, comment : node.value })
            node.value = "";
        }
    },
})

module.exports = SpnrDetailsComments