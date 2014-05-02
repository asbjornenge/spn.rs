/** @jsx React.DOM */

var React       = require('react')
var moment      = require('moment')
var SpnrDetails = require('./spnrDetails.jsx')

var Spnr = React.createClass({

    render : function() {

        var state = this.props.state;
        var spnr  = this.props.spnr;

        var avatar = state.avatars[spnr.user] ? state.avatars[spnr.user].url : "/images/avatar.gif"
        this.props.emitter.trigger('check_avatar', spnr.user)

        var details = this.state.details ? (
             <SpnrDetails spnr={this.props.spnr} />
        ) : undefined;

        var avatarStyle = {
            'background-image' : 'url('+avatar+')'
        }

        return (
            <div className="listspnr scrollable">
                <div className="avatarBox">
                    <div className="avatar" style={avatarStyle}></div>
                </div>
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
        console.log('START', e.touches[0].pageY)
        this.touch_start = {
            t : moment(),
            x : e.touches[0].pageX,
            y : e.touches[0].pageY
        }
        this.touch_end = {
            x : e.touches[0].pageX,
            y : e.touches[0].pageY
        }
    },
    handleTouchMove : function(e) {
        console.log('MOVE',e.touches[0].pageY)
        this.touch_end.x = e.touches[0].pageX
        this.touch_end.y = e.touches[0].pageY
    },
    handleTouchEnd : function(e) {
        var time_diff = moment().diff(this.touch_start.t, 'milliseconds')
        var x_dist    = this.touch_end.x - this.touch_start.x
        var y_dist    = this.touch_end.y - this.touch_start.y
        if (time_diff < 120 && Math.abs(y_dist) < 5) {
            // TAP
            this.setState({ details : !this.state.details })
        }
    },
    handleRemoveClick : function() {
        // radio('ui.event.remove').broadcast(this.props.spnr)
    }
});

module.exports = Spnr
