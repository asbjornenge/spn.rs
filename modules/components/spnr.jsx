/**
 * @jsx React.DOM
 */

define([
    'react',
    'radio'
],
function(
    React,
    radio
) {

    var Spnr = React.createClass({

        render : function() {

            var state = this.props.state;
            var spnr  = this.props.spnr;

            var avatar = state.avatars[spnr.user] ? state.avatars[spnr.user].url : "/images/avatar.gif"
            radio('ui.avatar.check').broadcast(spnr.user)

            var remove  = this.props.state.user.uid == this.props.spnr.user ? (
                <li onClick={this.handleRemoveClick}>Remove</li>
            ) : undefined

            var details = this.state.details ? (
                 <div class="details">
                    <ul>
                        {remove}
                    </ul>
                </div>
            ) : undefined;

            return (
                <div class="listspnr">
                    <img src={avatar} />
                    <div class="spnr" onClick={this.handleListSpnrClick}>{this.props.spnr.spnr}</div>
                    {details}
                </div>
            )
        },
        getInitialState: function() {
            return { details : false }
        },
        handleListSpnrClick : function() {
            this.setState({ details : !this.state.details })
        },
        handleRemoveClick : function() {
            radio('ui.event.remove').broadcast(this.props.spnr)
        }
    });
    Spnr.attach = function(mountNode, spnr, callback) {
        React.renderComponent(<Spnr spnr={spnr} />, mountNode, callback)
    };

    return Spnr

})
