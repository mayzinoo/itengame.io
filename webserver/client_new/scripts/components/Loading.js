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
        displayName: 'Loading',

        render: function() {

            return D.div({ className: 'loader' });
        }
    });

});

