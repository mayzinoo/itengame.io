define([
    'react',
    'game-logic/clib',
    'game-logic/engine'
], function(
    React,
    Clib,
    Engine
){

    /** Constants **/
    var MAX_GAMES_SHOWED = 50;

    var D = React.DOM;

    function getState(){
        return {
            engine: Engine
        }
    }

    function copyHash(gameId, hash) {
        return function() {
            prompt('Game ' + gameId + ' Hash: ', hash);
        }
    }

    return React.createClass({
        displayName: 'gamesLog',

        getInitialState: function () {
            return getState();
        },

        componentDidMount: function() {
            Engine.on({
                game_crash: this._onChange
            });
        },

        componentWillUnmount: function() {
            Engine.off({
                game_crash: this._onChange
            });
        },

        _onChange: function() {
            //Check if its mounted because when Game view receives the disconnect event from EngineVirtualStore unmounts all views
            //and the views unregister their events before the event dispatcher dispatch them with the disconnect event
            if(this.isMounted())
                this.setState(getState());
        },

        render: function () {
            var self = this;

            console.log('History Hostory', self.state.engine.tableHistory);

            var rows = self.state.engine.tableHistory.slice(0, MAX_GAMES_SHOWED).map(function (game, i) {
                var cashed_at, bet, profit, bonus;
                var player = game.player_info[self.state.engine.username];

        
                  var usersLostPlaying = self.state.engine.joined.map(function(player) {
                    var bet; // can be undefined

                    if (player === self.state.engine.username)
                        bet = self.state.engine.nextBetAmount;
                    console.log('useruseruser:', self.state.engine.username);

                    return { username: player, bet: bet };
                });



                if (player) {
                    bonus = player.bonus;
                    bet = player.bet;

                    //If the player won
                    if (player.stopped_at) {
                        profit = ((player.stopped_at / 100) * player.bet) - player.bet;
                        cashed_at = Clib.formatSatoshis(player.stopped_at);

                        //If the player lost
                    } else {
                        profit = -bet;
                        cashed_at = '-';
                    }

                    //If we got a bonus
                    if (bonus) {
                        profit = profit + bonus;
                        bonus = Clib.formatDecimals(bonus*100/bet, 2)+'%';
                    } else {
                        bonus = '0%';
                    }

                    profit = Clib.formatSatoshis(profit);
                    bet = Clib.formatSatoshis(bet);

                    //If we didn't play
                } else {
                    cashed_at = '-';
                    bet = '-';
                    profit = '-';
                    bonus = '-';
                }

                var className;
                if (game.game_crash >= 198)
                    className = 'games-log-goodcrash';
                else if (game.game_crash <= 196)
                    className = 'games-log-badcrash';
                else
                    className = '';

                return D.tr({ key: 'game_' + i },

                    D.td(null,
                        D.a({ href: '/game/' + game.game_id, target: '_blank',
                            className: className
                        },
                            Clib.formatSatoshis(game.game_crash), D.i(null, 'x'))
                        ),
                   
                    D.td(null, player),
                    D.td(null, bonus),
                    D.td(null, profit)
                    

                );
            });

            return D.div({ id: 'games-log-container' },
                D.div({ className: 'responsive-table' }),                
                    D.table({ className: 'table table-dark' },
                        D.thead(null,
                            D.tr(null,
                                D.th(null,  D.div({ className: 'actlog'}, 'Player')),
                                D.th(null,  D.div({ className: 'actlog'}, 'Bet')),
                                D.th(null,  D.div({ className: 'actlog'}, 'Profit')),
                                D.th(null,  D.div({ className: 'actlog'}, 'Payout'))
                            )
                        ),
                        D.tbody(null,
                            rows
                        )
                    ) 
               );
        }

    });

});