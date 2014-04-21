/** @jsx React.DOM */

var React  = require('react')
var moment = require('moment')

var touches = {}

var Spnr = React.createClass({

    render : function() {

        var state = this.props.state;
        var spnr  = this.props.spnr;

        var avatar = state.avatars[spnr.user] ? state.avatars[spnr.user].url : "/images/avatar.gif"
        this.props.emitter.trigger('check_avatar', spnr.user)

        var remove  = this.props.state.user.uid == this.props.spnr.user ? (
            <li onTouchEnd={this.handleRemoveClick}>Remove</li>
        ) : undefined

        var details = this.state.details ? (
             <div className="details">
                <ul>
                    {remove}
                </ul>
            </div>
        ) : undefined;

        return (
            <div className="listspnr">
                <img src={avatar} />
                <div className   = "spnr"
                    onTouchStart = {this.handleTouchStart}
                    onTouchMove  = {this.handleTouchMove}
                    onTouchEnd   = {this.handleTouchEnd}>
                        {this.props.spnr.spnr}
                </div>
                {details}
            </div>
        )
    },
    getInitialState: function() {
        return { details : false }
    },
    handleTouchStart : function(e) {
        console.log(e.touches[0].pageY)
        touches.touch_start = {
            time    : moment(),
            touches : e.touches
        }
        touches.touch_end = {
            touches : e.touches
        }
    },
    handleTouchMove : function(e) {
        console.log('Y',e.touches[0].pageY)
        touches.touch_end.touches = e.touches
    },
    handleTouchEnd : function(e) {
        var time_diff = moment().diff(touches.touch_start.time, 'milliseconds')
        var x_dist    = touches.touch_end.touches[0].pageX - touches.touch_start.touches[0].pageX
        var y_dist    = touches.touch_end.touches[0].pageY - touches.touch_start.touches[0].pageY
        console.log(touches)
        if (time_diff < 120 && Math.abs(y_dist) < 5) {
            // TAP
            // TODO - also measure distance
            this.setState({ details : !this.state.details })
        }
    },
    handleRemoveClick : function() {
        // radio('ui.event.remove').broadcast(this.props.spnr)
    }
});

module.exports = Spnr
// Spnr.attach = function(mountNode, spnr, callback) {
//     React.renderComponent(<Spnr spnr={spnr} />, mountNode, callback)
// };

