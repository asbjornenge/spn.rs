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

            var details = this.state.details ? (
                 <div class="listspnr-details">
                    <ul>
                        <li>Remove</li>
                    </ul>
                </div>
            ) : undefined;

            return (
                <div class="listspnr">
                    <div class="listspnr-spnr" onClick={this.handleListSpnrClick}>{this.props.spnr.spnr}</div>
                    {details}
                </div>
            )
        },
        getInitialState: function() {
            return { details : false }
        },
        handleListSpnrClick : function() {
            this.setState({ details : !this.state.details })
        }
    });
    Spnr.attach = function(mountNode, spnr, callback) {
        React.renderComponent(<Spnr spnr={spnr} />, mountNode, callback)
    };

    return Spnr

})
