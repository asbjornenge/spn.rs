var React = require('react')

var SpnrAvatar = React.createClass({

    render : function() {

        var avatar = this.props.state.avatars[this.props.user_id] ? this.props.state.avatars[this.props.user_id].url : '/images/avatar.gif'
        this.props.emitter.trigger('check_avatar', this.props.user_id)

        return (
            React.DOM.div({
                className : 'SpnrAvatar',
                style     : {
                    'background-image' : 'url('+avatar+')'
                }
            })
        )
    }
});

module.exports = SpnrAvatar
