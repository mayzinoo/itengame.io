define([
    'dispatcher/AppDispatcher',
    'constants/AppConstants'
], function(
    AppDispatcher,
    AppConstants
){

    var ControlsSelectorActions = {

        selectControl: function(controlName,isMobile){
            console.log(isMobile);
            console.log('isMobile');
            if(controlName == 'strategy' && isMobile){
                $('#game-right-container').hide();
            }else{
                $('#game-right-container').show();
            }
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.SELECT_CONTROL,
                controlName: controlName
            });
        },

        toggleControl: function(){
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.TOGGLE_CONTROL
            });
        }

    };

    return ControlsSelectorActions;
});