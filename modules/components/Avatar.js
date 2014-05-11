var React = require('react')

var Avatar = React.createClass({

    render : function() {

        var avatar = this.props.state.avatars[this.props.user] ? this.props.state.avatars[this.props.user].url : '/images/avatar.gif'
        this.props.emitter.trigger('check_avatar', this.props.user)

        return (
            React.DOM.div({
                className : 'Avatar',
                style     : {
                    'background-image' : 'url('+avatar+')'
                }
            })
        )
    }
});

module.exports = Avatar
