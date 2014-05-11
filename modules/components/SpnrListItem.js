var React               = require('react')
var moment              = require('moment')
var Avatar              = require('./SpnrAvatar')
var SpnrListItemDetails = require('./SpnrListItemDetails')

var SpnrListItem = React.createClass({

    render : function() {

        var Details = this.state.details ? (
             SpnrListItemDetails({spnr : this.props.spnr})
        ) : undefined;

        return (
            React.DOM.div({
                className    : 'SpnrListItem scrollable',
                onTouchStart : this.handleTouchStart,
                onTouchMove  : this.handleTouchMove,
                onTouchEnd   : this.handleTouchEnd
            },[
                React.DOM.div({ className : 'SpnrListItemAvatarBox' }, [ Avatar({ state: this.props.state, emitter: this.props.emitter, user_id : this.props.spnr.user}) ]),
                React.DOM.div({ className : 'SpnrListItemSpnrBox' }, this.props.spnr.spnr),
                Details,
                React.DOM.div({ style : { clear : 'both' } })
            ])
        )
    },
    getInitialState: function() {
        return { 
            details   : false,
            returning : false
        }
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
    },
    handleTouchMove : function(e) {
        // console.log('MOVE',e.touches[0].pageY)
        this.touch_end.x = e.touches[0].pageX
        this.touch_end.y = e.touches[0].pageY
        var x_dist = this.touch_end.x - this.touch_start.x
        var y_dist = this.touch_end.y - this.touch_start.y
        if (Math.abs(y_dist) < 10 && Math.abs(x_dist) > 20 && Math.abs(x_dist) < 70) {
            this.getDOMNode().style['-webkit-transform'] = 'translateX('+x_dist+'px)'
            document.querySelectorAll('.SpnrList')[0].style.overflow = 'hidden'
        }
    },
    handleTouchEnd : function(e) {
        var time_diff = moment().diff(this.touch_start.t, 'milliseconds')
        var x_dist    = this.touch_end.x - this.touch_start.x
        var y_dist    = this.touch_end.y - this.touch_start.y
        var returning = false
        if (time_diff < 120 && Math.abs(y_dist) < 5) {
            // TAP
            this.setState({ details : !this.state.details })
        } else 
        if (Math.abs(x_dist) > 55) {
            // EDGE
            if (x_dist > 0) console.log('favorite')
            else {
                this.props.emitter.trigger('change_view','details')
                this.props.emitter.trigger('set_current',this.props.spnr)
            }
            returning = true
        }
        var reset = function() {
            this.classList.add('returning')
            this.style['-webkit-transform'] = ''
            setTimeout(function() {
                this.classList.remove('returning')
            }.bind(this),200)
        }.bind(this.getDOMNode())()
        document.querySelectorAll('.SpnrList')[0].style.overflow = 'scroll'
    }
});

module.exports = SpnrListItem
