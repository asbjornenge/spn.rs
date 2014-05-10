/** @jsx React.DOM */

var React               = require('react')
var moment              = require('moment')
var SpnrListItemDetails = require('./SpnrListItemDetails.jsx')

var SpnrListItem = React.createClass({

    render : function() {

        var state = this.props.state;
        var spnr  = this.props.spnr;

        var avatar = state.avatars[spnr.user] ? state.avatars[spnr.user].url : "/images/avatar.gif"
        this.props.emitter.trigger('check_avatar', spnr.user)

        var details = this.state.details ? (
             <SpnrListItemDetails spnr={this.props.spnr} />
        ) : undefined;

        var avatarStyle = {
            'background-image' : 'url('+avatar+')'
        }

        return (
            <div className="SpnrListItem scrollable">
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
                <div style={{clear:'both'}}></div>
            </div>
        )
    },
    getInitialState: function() {
        return { details : false }
    },
    handleTouchStart : function(e) {
        // console.log('START', e.touches[0].pageY)
        this.touch_start = {
            t : moment(),
            x : e.touches[0].pageX,
            y : e.touches[0].pageY
        }
        this.touch_end = {
            x : e.touches[0].pageX,
            y : e.touches[0].pageY
        }
        // this.scrolling = document.querySelectorAll('.spnrscroll')[0].classList
        // console.log(this.scrolling)
    },
    handleTouchMove : function(e) {
        // console.log('MOVE',e.touches[0].pageY)
        this.touch_end.x = e.touches[0].pageX
        this.touch_end.y = e.touches[0].pageY
        var x_dist = this.touch_end.x - this.touch_start.x
        var y_dist    = this.touch_end.y - this.touch_start.y
        if (Math.abs(y_dist) < 10 && Math.abs(x_dist) > 20 && Math.abs(x_dist) < 70) {
            this.getDOMNode().style['-webkit-transform'] = 'translateX('+x_dist+'px)'
            document.querySelectorAll('.spnrscroll')[0].style.overflow = 'hidden'
        }
    },
    handleTouchEnd : function(e) {
        var time_diff = moment().diff(this.touch_start.t, 'milliseconds')
        var x_dist    = this.touch_end.x - this.touch_start.x
        var y_dist    = this.touch_end.y - this.touch_start.y
        if (time_diff < 120 && Math.abs(y_dist) < 5) {
            // TAP
            this.setState({ details : !this.state.details })
        } else 
        if (Math.abs(x_dist) > 55) {
            // EDGE
            if (x_dist > 0) console.log('favorite')
            else console.log('details')
        }
        this.getDOMNode().style['-webkit-transform'] = ''
        document.querySelectorAll('.spnrscroll')[0].style.overflow = 'scroll'
    },
    handleRemoveClick : function() {
        // radio('ui.event.remove').broadcast(this.props.spnr)
    }
});

module.exports = SpnrListItem
