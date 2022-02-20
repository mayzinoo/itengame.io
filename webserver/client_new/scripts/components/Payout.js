define([
    'react',
    'game-logic/clib',
    'game-logic/stateLib',
    'game-logic/engine'
], function(
    React,
    Clib,
    StateLib,
    Engine
) {

    var D = React.DOM;

    return React.createClass({
        displayName: 'payout',

        propTypes: {
            engine: React.PropTypes.object.isRequired
        },

        getInitialState: function() {
            return {
                payout: 0
            }
        },

        componentDidMount: function() {
            window.requestAnimationFrame(this.draw);
        },

        draw: function() {
            if (!this.isMounted())
                return;

            var po = Clib.calcGamePayout(Clib.getElapsedTimeWithLag(Engine));

            if (po)
                this.setState({ payout: po * StateLib.currentPlay(Engine).bet });
            else
                this.setState({ payout: null });

            window.requestAnimationFrame(this.draw);
        },

        render: function() {
            var decimals = StateLib.currentPlay(Engine).bet < 10000 ? 0 : 0;

            return D.span({ id: 'payout' }, Clib.formatSatoshis(this.state.payout*100, decimals));
        }
    });

});