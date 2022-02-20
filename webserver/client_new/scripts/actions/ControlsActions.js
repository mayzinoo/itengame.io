define([
    'dispatcher/AppDispatcher',
    'constants/AppConstants'
], function(
    AppDispatcher,
    AppConstants
){

    var ControlsActions = {

        placeBet: function(bet, cashOut,  eth_value, profit){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.PLACE_BET,
                bet: bet,
                cashOut: cashOut,                
                eth_value: eth_value,
                profitvalue: profit
            });
        },

         logout: function(username){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.LOGOUT,
                username: username
            });
        },

        startgame: function(balance){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.START_GAME,
                balance: balance
            });
        },

        endgame: function(balance, cclicks){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.END_GAME,
                balance: balance,
                cclicks: cclicks
            });
        },

        cashOut: function(){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.CASH_OUT
            });
        },

        cancelBet: function(){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.CANCEL_BET
            });
        },

        setBetSize: function(betSize){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.SET_BET_SIZE,
                betSize: betSize
            });
        },

        setAutoCashOut: function(autoCashOut){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.SET_AUTO_CASH_OUT,
                autoCashOut: autoCashOut
            });
        }


    };

    return ControlsActions;
});
