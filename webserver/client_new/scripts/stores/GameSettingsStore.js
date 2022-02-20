  define([
    'dispatcher/AppDispatcher',
    'constants/AppConstants',
    'lib/events',
    'lodash',
    'game-logic/clib',
    'game-logic/engine'
], function(
    AppDispatcher,
    AppConstants,
    Events,
    _,
    Clib,
    Engine
){
    var CHANGE_EVENT = 'change';

    var _themeFileName = '/css/' + (window.THEME_FILE_NAME || 'blackTheme.css'); //Global var sent by the server

    /** Theme **/
    var _currentTheme = Clib.localOrDef('currentTheme', 'black'); //black || white


    /** Display Settings **/
    var _controlsSize = Clib.localOrDef('controlsSize', 'big'); //big || small
    var _graphMode = Clib.localOrDef('graphMode', 'graphics'); //graphics || text
    var _controlsPosition = Clib.localOrDef('controlsPosition', 'right'); //right || left
    var _leftWidget = Clib.localOrDef('leftWidget', 'players'); //players || history || chat

    /** Hotkeys **/
    var _hotkeysActive = false; //true || false //Disabled by default!

    if(localStorage['currentTheme'] === 'black')
        Clib.loadCss(_themeFileName, 'theme-black');

    /** List of ignored users client side **/
    var _ignoredClientList = JSON.parse(Clib.localOrDef('ignoredList', '{}'));


    //Singleton ControlsStore Object
    var GameSettingsStore = _.extend({}, Events, {

        emitChange: function() {
            this.trigger(CHANGE_EVENT);
        },

        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },

        removeChangeListener: function(callback) {
            this.off(CHANGE_EVENT, callback);
        },

        _toggleTheme: function() {
            // if(_currentTheme === 'white') {
            //     Clib.loadCss(_themeFileName, 'theme-black');
            //     _currentTheme = 'black';
            // } else {
            //     Clib.removeCss('theme-black');
            //     _currentTheme = 'white';
            // }
            Clib.loadCss(_themeFileName, 'theme-black');
            localStorage['currentTheme'] = _currentTheme;
        },

        _setGraphMode: function(graphMode) {
            _graphMode = graphMode;
            localStorage['graphMode'] = graphMode;
        },

        _setControlsSize: function(controlsSize) {
            _controlsSize = controlsSize;
            localStorage['controlsSize'] = controlsSize;
        },

        _toggleHotkeysState: function() {
            _hotkeysActive = !_hotkeysActive;
        },

        _ignoreUser: function(username) {
            _ignoredClientList[username.toLowerCase()] = { username: username };
            localStorage['ignoredList'] = JSON.stringify(_ignoredClientList);
        },

        _approveUser: function(username) {
            username = username.toLowerCase();
            if(_ignoredClientList[username]) {
                delete _ignoredClientList[username];
                localStorage['ignoredList'] = JSON.stringify(_ignoredClientList);
            }
        },

        getState: function(eth_amount) {
            const response0 = this.generateGame(1,4, 0,4,1);
            const response1 = this.generateGame(1,4, 0,4,1);
            const response2 = this.generateGame(1,4, 0,4,1);
            const response3 = this.generateGame(1,4, 0,4,1);
            const response4 = this.generateGame(1,4, 0,4,1);
            const response5 = this.generateGame(1,4, 0,4,1);
            const response6 = this.generateGame(1,4, 0,4,1);
            const response7 = this.generateGame(1,4, 0,4,1);
            const response8 = this.generateGame(1,4, 0,4,1);

            const EMOJI_OK = '🙂';
            const EMOJI_GAME_OVER = '💀';
            const EMOJI_WIN = '😎';


            return {
                graphMode: _graphMode,
                controlsSize: _controlsSize,
                controlsPosition: _controlsPosition,
                leftWidget: _leftWidget,
                hotkeysActive: _hotkeysActive,
                data0:response0,
                data1:response1,
                data2:response2,
                data3:response3,
                data4:response4,
                data5:response5,
                data6:response6,
                data7:response7,
                data8:response8,
                currentstatus:'before',
                playbutton:'Play',
                clicks:100,
                payout8:(1.2).toFixed(2),
                payout7:(1.44).toFixed(2),
                payout6:(1.728).toFixed(2),
                payout5:(2.0736).toFixed(2),
                payout4:(2.48832).toFixed(2),
                payout3:(2.985984).toFixed(2),
                payout2:(3.5831808).toFixed(2),
                payout1:(4.29981696).toFixed(2),
                payout0:(5.159780352).toFixed(2),
                mark8:120,
                mark7:144,
                mark6:173,
                mark5:207,
                mark4:249,
                mark3:299,
                mark2:358,
                mark1:430,
                mark0:516,
                game:this.generateArray(1, 3, null),
                game0:this.generateArray(1, 3, null),
                game1:this.generateArray(1, 3, null),
                game2:this.generateArray(1, 3, null),
                game3:this.generateArray(1, 3, null),
                game4:this.generateArray(1, 3, null),
                game5:this.generateArray(1, 3, null),
                game6:this.generateArray(1, 3, null),
                game7:this.generateArray(1, 3, null),
                game8:this.generateArray(1, 3, null),
                game9:this.generateArray(1, 3, null),
                height: 1,
                width: 3,
                maximumMines: 1,
                cc:0,
              solution: null,
              gameStarted: false,
              gameFinished: false,
              currentvalue:'F',
              currentstep:8,
              buttonStatus: EMOJI_OK,
              time: 0,
              start: 0,
              bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
              users:[],
              changed:false,
              gstatus:'success',
              //ethereumvalue:eth_amount,
              maxVal: 100000,
              minVal: 100,
              selectedValue: 'Newbie',
              valid:'true',
              alert:null,
                animation:null,
                sound:null,
              currentCount:5,
              takevalue:0        
            }
        },


        generateGame: function(height, width, currentRow, currentColumn, maximumMines) { 
    
    const game =  this.generateArray(height, width, 0);
   
    var generatedMines = 0;
    var row;
    var column;

    while (generatedMines < maximumMines) {
     
      row = this.randomInRange(0, height - 1);
      column = this.randomInRange(0, width - 1);

      if (!this.isMine(game, row, column)) {
          //alert('lessthan');
        game[row][column] = 'M';
        this.incrementMinesNearby(game, row - 1, column);
        this.incrementMinesNearby(game, row + 1, column);
        this.incrementMinesNearby(game, row, column - 1);
        this.incrementMinesNearby(game, row, column + 1);
        this.incrementMinesNearby(game, row - 1, column - 1);
        this.incrementMinesNearby(game, row - 1, column + 1);
        this.incrementMinesNearby(game, row + 1, column + 1);
        this.incrementMinesNearby(game, row + 1, column - 1);
        generatedMines++;
      }
      else{
        //alert('gameover');
      }
    }
    return game;
  },

  incrementMinesNearby:function(game, row, column) {
    if (this.inRange(row, column) && !this.isMine(game, row, column)) {
      game[row][column] = game[row][column] + 1;
    }
  },
  inRange:function(row, column) {
    return row >= 0 && row < 1
      && column >= 0 && column < 4;
  },

  isMine:function(squares, row, column) {
    return squares[row][column] === 'M';
  },

  randomInRange:function(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  },

         generateArray:function(height, width, value) {
            return Array.from({
            length: height
          }, function () {
            return Array.from({
              length: width
            }, function () {
              return value;
            });
          });
  },

        getCurrentTheme: function() {
            return _currentTheme;
        },

        getIgnoredClientList: function() {
            return _ignoredClientList;
        }

    });

    AppDispatcher.register(function(payload) {
        var action = payload.action;

        switch(action.actionType) {
            case AppConstants.ActionTypes.TOGGLE_THEME:
                GameSettingsStore._toggleTheme();
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.SET_CONTROLS_SIZE:
                GameSettingsStore._setControlsSize(action.controlsSize);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.SET_GRAPH_MODE:
                GameSettingsStore._setGraphMode(action.graphMode);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.TOGGLE_HOYTKEYS_STATE:
                GameSettingsStore._toggleHotkeysState();
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.IGNORE_USER:
                GameSettingsStore._ignoreUser(action.username);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.APPROVE_USER:
                GameSettingsStore._approveUser(action.username);
                GameSettingsStore.emitChange();
                break;

            //case AppConstants.ActionTypes.SET_CONTROLS_POSITION:
            //    GameSettingsStore._setGraphMode(action.graphMode);
            //    GameSettingsStore.emitChange();
            //    break;
            //
            //case AppConstants.ActionTypes.SET_LEFT_WIDGET:
            //    GameSettingsStore._setGraphMode(action.graphMode);
            //    GameSettingsStore.emitChange();
            //    break;

        }

        return true; // No errors. Needed by promise in Dispatcher.
    });

    return GameSettingsStore;
});
