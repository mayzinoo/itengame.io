define([
    'react',
    'game-logic/clib',
    'game-logic/stateLib',
    'constants/AppConstants',
    'components/Payout',
    'game-logic/engine'
], function(
    React,
    Clib,
    StateLib,
    AppConstants,
    PayoutClass,
    Engine
){

    var D = React.DOM;
    var Payout = React.createFactory(PayoutClass);

    return React.createClass({
        displayName: 'BetButtonAuto',

        propTypes: {
            engine: React.PropTypes.object.isRequired,
            placeBet: React.PropTypes.func.isRequired,
            cancelBet: React.PropTypes.func.isRequired,
            cashOut: React.PropTypes.func.isRequired,
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            betSize: React.PropTypes.string.isRequired,
            betInvalid: React.PropTypes.any.isRequired,
            cashOutInvalid: React.PropTypes.any.isRequired,
            controlsSize: React.PropTypes.string.isRequired,
            isAuto: React.PropTypes.bool.isRequired,
        },

        getInitialState: function() {
            return {
                initialDisable: false
            }
        },

        componentDidMount: function() {
            this._initialDisableTimeout();
            this.props.engine.on({
                game_crash: this._onGameCrash
            });
        },

        componentWillUnmount: function() {
            this.props.engine.off({
                game_crash: this._onGameCrash
            });
        },

        _onGameCrash: function() {
            this.setState({ initialDisable: true });
            this._initialDisableTimeout();
        },

        _initialDisableTimeout: function() {
            var self = this;
            setTimeout(function() {
                if(self.isMounted())
                    self.setState({ initialDisable: false });
            }, AppConstants.BetButton.INITIAL_DISABLE_TIME);
        },

        _cancelBet: function(){
            localStorage.setItem('isAuto',"false");
            this.props.isAuto = false;
            this.props.cancelBet();
        },
        _placebet: function(){
            localStorage.setItem('isAuto',"true");
            this.props.isAuto = true;
            this.props.placeBet();
        },

        _cashOut: function () {
            this.props.cashOut();
            this.setState({ initialDisable: true });
            this.iscashedOut = true;
            this._initialDisableTimeout();
        },

        render: function() {
            var self = this;
            var iscashedOut = false;
            var chashedAmount = null;
            var smallButton = this.props.isMobileOrSmall || this.props.controlsSize === 'small';

            var notPlaying = StateLib.notPlaying(this.props.engine);
            var isBetting = StateLib.isBetting(this.props.engine);

            // Able to bet, or is already betting
            var notPlayingOrBetting = notPlaying || isBetting;

            var canUserBet = StateLib.canUserBet(this.props.engine.balance, this.props.betSize, this.props.betInvalid, this.props.cashOutInvalid);
            var invalidBet = canUserBet instanceof Error; 

            var btnClasses, btnContent = [], onClickFun = null, onMouseDownFun = null, onMouseUpFun = null;
            btnClasses = 'bet-button';

            if(notPlayingOrBetting) {
                //Betting
                if(isBetting) {
                    //Can cancel
                    if (this.props.engine.gameState !== 'STARTING') {
                        btnContent.push(D.span({ key: 'bc-0'}, smallButton? '' : 'Auto Betting...'), D.a({ className: 'cancel', key: 'bc-1' }, ' (Cancel)'));
                        onClickFun = this._cancelBet;
                        
                        btnClasses += ' cancel';
                    } else {
                        btnContent.push(D.span({ key: 'bc-0'}, 'Auto Betting...'));
                                               
                        
                    }

                    //Initial disable
                } else if(this.state.initialDisable) {
                    var btnText =   (canUserBet.message === 'Not enough bits')? (smallButton? 'Auto Bet' : 'Bet too big') : (smallButton? 'Auto Bet' : 'Auto Place bet (cancel)');
                    btnContent.push(D.span({ key: 'bc-2' }, btnText));
                    onClickFun = this._cancelBet;
                    btnClasses += ' disable unselect cancel';

                    //Able to betting
                }else if(this.iscashedOut && this.props.engine.gameState == 'IN_PROGRESS'){
                    if(this.chashedAmount == null){
                        var game= Engine
                        var currentUser = game.playerInfo[StateLib.currentPlay(Engine).username];
                        this.chashedAmount = Clib.formatSatoshis((currentUser.bet*currentUser.stopped_at), 0);
                    }
                   
                    btnContent.push(
                        D.div({ className: 'btn-content', key: 'bc-6' },
                            D.span({ className: 'cashout-cont' }, 'Cashed out'),
                            D.span({ className: 'cashout-amount-cont' },
                                D.span(null, '@ '),
                                this.chashedAmount,
                                D.span(null, 'wow')
                            )
                        )
                        
                    );
                    
                    btnClasses += ' disable';
                } else if(notPlaying) {
                    this.iscashedOut = false;
                    this.chashedAmount = null;
                    //Invalid bet
                    if(invalidBet) {

                        var btnText =   (canUserBet.message === 'Not enough bits')? (smallButton? 'Auto Bet' : 'Auto Bet too big') : (smallButton? 'Bet' : 'Auto Place bet');
                        //btnContent.push(D.span({ key: 'bc-3' }, invalidBet));
                        btnContent.push(D.span({ key: 'bc-3' }, btnText));
                        btnClasses += ' invalid-bet unselect';

                    //Placing bet
                    } else if(this.props.engine.placingBet) {
                        btnContent.push(D.span({ key: 'bc-4' }, smallButton? 'Bet' : 'Auto Place bet (cancel now)'));
                        btnClasses += ' disable unselect';
                        onClickFun = this._cancelBet;
                       

                    //Able to bet
                    } else {
                        btnContent.push(D.span({ key: 'bc-5' }, smallButton? 'Bet' : 'Auto Place bet'));
                        btnClasses += ' ';
                        onClickFun = this._placebet;
                        console.log(this.props.isAuto);
                        if(localStorage.getItem('isAuto') == 'true'){
                            this._placebet();
                        }
                        console.log('this.props.isAuto');
                    }

                    //User is cashing out
                }  else {
                    console.error('Not defined state in controls');
                }

            //The user is playing
            } else {
                btnContent.push(
                    D.div({ className: 'btn-content', key: 'bc-6' },
                        D.span({ className: 'cashout-cont disable' }, 'Cash out'),
                        D.span({ className: 'cashout-amount-cont' },
                            D.span(null, '@ '),
                            Payout({ engine: this.props.engine }),
                            D.span(null, 'wow')
                        )
                    )
                );

                //Cashing out
                if (this.props.engine.cashingOut) {
                    btnClasses += ' disable';
                    console.log("Cashing out");
                    this.iscashedOut = true;
                    this.props.isAuto = true;
                    localStorage.setItem('isAuto',"true");
                }  else {
                    btnClasses += ' cashout disable';
                    console.log("Cashout clicked");
                    this.iscashedOut = true;
                    //onMouseDownFun = this._cashOut;
                }
            }

            return D.div({ className: 'bet-button-container' },
                D.button({ className: btnClasses, onClick: onClickFun, onMouseDown: onMouseDownFun, onMouseUp: onMouseUpFun },
                    btnContent
                )

            );
        }
    });

});