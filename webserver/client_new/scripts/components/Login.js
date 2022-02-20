define([
    'react',
    'game-logic/engine',
    'stores/GameSettingsStore',
    'actions/GameSettingsActions',
    'game-logic/clib',
    'screenfull'
], function(
    React,
    Engine,
    GameSettingsStore,
    GameSettingsActions,
    Clib,
    Screenfull //Attached to window.screenfull
) {
    var D = React.DOM;

    function getState() {

        // let a = GameSettingsStore.getCurrentTheme();
        // console.log('theme' , a);
        var engine = Engine; var en_balance;
        if(engine.balance === null)
        {
            en_balance = (0.1).toFixed(8);
        }
        else{
          en_balance = engine.balance;
        }
        return {
            balanceBitsFormatted: en_balance,
            theme: GameSettingsStore.getCurrentTheme()//black || white
            // theme: 'black'
        }
    }
   
    
    return React.createClass({
        displayName: 'TopBar',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            username: React.PropTypes.string.isRequired
        },

        getInitialState: function() {
            var state = getState();
            GameSettingsActions.toggleTheme();
            state.username = Engine.username;
            state.fullScreen = false;
            return state;
        },

        componentDidMount: function() {
            Engine.on({
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
		//alert(Engine.username);
            GameSettingsStore.on('all', this._onChange);
        },

        componentWillUnmount: function() {
            Engine.off({
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
            GameSettingsStore.off('all', this._onChange);
        },

        _onChange: function() {
            this.setState(getState());
        },

        _toggleTheme: function() {
            GameSettingsActions.toggleTheme();
        },

        _toggleFullScreen: function() {
            window.screenfull.toggle();
            this.setState({ fullScreen: !this.state.fullScreen });
        },

        render: function() {

            var userLogin;
            var divStyle = {
                color: 'white',
              };
	 console.log('user user', this.props.username);
            if(this.props.username) {
                return D.div( { className : 'btn' },
                     D.div({ className: 'user-login' },
                    // D.div({ className: 'balance-bits' },
                    //     D.span(null, 'Ethereum:'),
                    //     // D.span(null, 'Bits: '),
                    //     D.span({ className: 'balance' }, this.state.balanceBitsFormatted )
                    // ),
                    D.div({ className: 'username' },
                        D.a({ href: '/account'}, this.props.username
                    )),
                    D.div({ className: 'username' },
                        D.a({ href: '/logout'}, 'Logout'
                    )),
                  )  
                );
            } else {
                return   D.div( { className : 'btn' },
                        D.div({ className: 'user-login' },
                    D.div({ className: 'register' },
                        D.a({ href: '/register' }, 'Register' )
                    ),
                    D.div({ className: 'login' },
                        D.a({ href: '/login'}, 'Log in' )
                    ),
                  )  
                );
            }

        }
    });
});

