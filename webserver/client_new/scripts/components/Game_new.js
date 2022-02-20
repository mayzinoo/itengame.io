/**
 * This view acts as a wrapper for all the other views in the game
 * it is subscribed to changes in EngineVirtualStore but it only
 * listen to connection changes so every view should subscribe to
 * EngineVirtualStore independently.
 */
define([
    'react',
    'components/SweetAlert',
    'components/TopBar',
    'components/ChartControls',
    'components/TabsSelector',
    'components/TabsHistorySelector',
    'components/Players',
    'components/BetBar',
    'game-logic/engine',
    'game-logic/clib',
    'game-logic/hotkeys',
    'stores/GameSettingsStore',
    'components/Board',
    'components/Square',
    'components/DynamicSelect',
    'constants/AppConstants',
    'actions/ControlsActions',
    'game-logic/clib',
    'game-logic/stateLib',
    'lodash',
    'stores/ControlsStore'
    
], function (
    React,
    SweetAlertClass,
    TopBarClass,
    ChartControlsClass,
    TabsSelectorClass,
    TabsHistorySelectorClass,
    PlayersClass,
    BetBarClass,
    Engine,
    Clib,
    Hotkeys,
    GameSettingsStore,
    BoardClass,
    SquareClass,
    DynamicSelectClass,
    AppConstants,
    ControlsActions,
    Clib,
    StateLib,
    _,
    ControlsStore
    
) {
    var TopBar = React.createFactory(TopBarClass);
    //var SpaceWrap = React.createFactory(SpaceWrapClass);
    var ChartControls = React.createFactory(ChartControlsClass);
    var TabsSelector = React.createFactory(TabsSelectorClass);
    var TabsHistorySelector = React.createFactory(TabsHistorySelectorClass);
    var Players = React.createFactory(PlayersClass);
    var BetBar = React.createFactory(BetBarClass);
    var Board = React.createFactory(BoardClass);
    var Square = React.createFactory(SquareClass);
    var DynamicSelect = React.createFactory(DynamicSelectClass);
    var SweetAlert = React.createFactory(SweetAlertClass);   


    var D = React.DOM;

    const EMOJI_OK = '🙂';
    const EMOJI_GAME_OVER = '💀';
    const EMOJI_WIN = '😎';

    const arrayOfData = [
      {
        id: 'Easy',
        name: '🥑 Easy' ,
        width: 4,
        level:'easy'   
      },
      {
        id: 'Medium',
        name: '🥥 Medium',
        width: 3,
        level:'medium'    
      },
      {
        id: 'Hard',
        name: '🍌 Hard',
        width: 2,
        level:'hard'    
      },
      {
        id: 'Extreme',
        name: '🍍 Extreme',
        width: 3,
        level:'extreme'    
      },
      {
        id: 'Nightmare',
        name: '🍓 Nightmare',
        width: 2,
        level:'nightmare'    
      },
    ];

    function gamestate() {
      
        return {
            betSize: 10, //Bet input string in bits
            betInvalid: false, //false || string error message
            cashOut: ControlsStore.getCashOut(),
            cashOutInvalid: false, //false || string error message
            engine: Engine
        }
    }

    return React.createClass({
        displayName: 'Game',

        getInitialState: function () {
          alert('initialstate');
            var state = GameSettingsStore.getState(Engine);
            state.isConnected = Engine.isConnected;
            state.showMessage = true;
            state.isMobileOrSmall = Clib.isMobileOrSmall(); //bool
            return state;
        },

        componentDidMount: function () {
        alert('there');
        alert(this.state.isConnected);
        this.getInitialState();
          var engine = Engine;
          
           /*Engine.off({
                game_crash: this._onChange,
                player_bet: this._onChange
            });*/
            GameSettingsStore.addChangeListener(this._onChange);
            
        },

        componentWillUnmount: function () {
            Engine.off({
                'connected': this._onChange,
                'disconnected': this._onChange,
                player_bet: this._onChange,
            });

            window.removeEventListener("resize", this._onWindowResize);

            Hotkeys.unmount();
        },

        _onEngineChange: function () {
            if ((this.state.isConnected != Engine.isConnected) && this.isMounted())
                this.setState({ isConnected: Engine.isConnected });
        },

        _onSettingsChange: function () {
            if (this.isMounted())
                this.setState(GameSettingsStore.getState());
        },

        _onWindowResize: function () {
            var isMobileOrSmall = Clib.isMobileOrSmall();
            if (this.state.isMobileOrSmall !== isMobileOrSmall)
                this.setState({ isMobileOrSmall: isMobileOrSmall });
        },

        _hideMessage: function () {
            this.setState({ showMessage: false });
        },

         _placeBet: function (bet_amount,pay_amt,profit_amt,new_value) {
          
            var bet = bet_amount;
            var new_bet = pay_amt;
            var cashOut = pay_amt;
            var pay_amt = pay_amt;
            var profit = StateLib.parseprofit(500);
            var eth_value = new_value;

            ControlsActions.placeBet(bet, cashOut, eth_value);
        },

         _startgame: function (balance) {
            ControlsActions.startgame(balance);
        },

         _endgame: function (balance) {
            ControlsActions.endgame(balance);
        },

        _cancelBet: function () {
            ControlsActions.cancelBet();
        },

        _cashOut: function () {
            ControlsActions.cashOut();
        },

        _setBetSize: function (betSize) {
            ControlsActions.setBetSize(betSize);
        },

        _setAutoCashOut: function (autoCashOut) {
            ControlsActions.setAutoCashOut(autoCashOut);
        },

        _redirectToLogin: function () {
            window.location = '/login';
        },


    generateGame: function(height, width, currentRow, currentColumn, maximumMines) { 
    
    const game =  this.generateArray(height, width, 0);
   
    let generatedMines = 0;
    let row;
    let column;

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
    return row >= 0 && row < this.state.height
      && column >= 0 && column < this.state.width;
  },

  isMine:function(squares, row, column) {
    return squares[row][column] === 'M';
  },

  randomInRange:function(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  },


  generateArray:function(height, width, value) {
    return Array.from(
      {length: height},
      () => Array.from({length: width}, () => value)
    )
  },

  vibrate:function(pattern) {
    return navigator.vibrate(pattern);
  },


  getSolution:function(game, solution, symbol) {
   
      return game.map(
      (row, rowKey) => row.map(
        (square, squareKey) =>
          this.isMine(solution, rowKey, squareKey) ? symbol : solution[rowKey][squareKey]
      )
    ); 

  },

  thereAreRemainingMoves:function(squares, maximumMines) {
    return squares.flat().filter(
      sq => (sq === null || sq === 'F')
    ).length > maximumMines;
  },

  leftPad:function(number) {
    if (number < 0) {
      return '-' + Math.abs(number).toString().padStart(2, '0');
    }
    return number.toString().padStart(3, '0');
  },

  handleSelectChange:function (selectedValue)
  {
    this.setState({selectedValue: selectedValue});     
    
    if(selectedValue === 'Nightmare'){
      
    this.setState({mark6: (0.00360000).toFixed(8)});
    this.setState({mark5: (0.01296000).toFixed(8)});
    this.setState({mark4: (0.04665600).toFixed(8)});
    this.setState({mark3: (0.16796160).toFixed(8)});
    this.setState({mark2: (0.60466176).toFixed(8)});
    this.setState({mark1: (2.17678233).toFixed(8)});
    this.setState({mark0: (7.83641640).toFixed(8)});
    
    this.setState({payout6: (3.6).toFixed(2)});
    this.setState({payout5: (12.96).toFixed(2)});
    this.setState({payout4: (46.656).toFixed(2)});
    this.setState({payout3: (167.961).toFixed(2)});
    this.setState({payout2: (604.661).toFixed(2)});
    this.setState({payout1: (2176.782).toFixed(2)});
    this.setState({payout0: (7836.416).toFixed(2)});

      const response0 = this.generateGame(1,4, 0,4,1);
      const response1 = this.generateGame(1,4, 0,4,1);
      const response2 = this.generateGame(1,4, 0,4,1);
      const response3 = this.generateGame(1,4, 0,4,1);
      const response4 = this.generateGame(1,4, 0,4,1);
      const response5 = this.generateGame(1,4, 0,4,1);
      const response6 = this.generateGame(1,4, 0,4,1);      
   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});

      this.setState(this.getNightmareState());
      this.setState({currentstep: 8});
      this.setState({selectedValue: 'Nightmare'});     

    }
    else if(selectedValue === 'Extreme'){
      
    this.setState({mark6: (0.00276000).toFixed(8)});
    this.setState({mark5: (0.00761760).toFixed(8)});
    this.setState({mark4: (0.02102457).toFixed(8)});
    this.setState({mark3: (0.05802782).toFixed(8)});
    this.setState({mark2: (0.16015681).toFixed(8)});
    this.setState({mark1: (0.44203279).toFixed(8)});
    this.setState({mark0: (1.22001051).toFixed(8)});
    
    this.setState({payout6: (2.76).toFixed(2)});
    this.setState({payout5: (7.617).toFixed(2)});
    this.setState({payout4: (21.0245).toFixed(2)});
    this.setState({payout3: (58.0278).toFixed(2)});
    this.setState({payout2: (160.156).toFixed(2)});
    this.setState({payout1: (442.0327).toFixed(2)});
    this.setState({payout0: (1220.0105).toFixed(2)});

      const response0 = this.generateGame(1,3, 0,2,1);
      const response1 = this.generateGame(1,3, 0,2,1);
      const response2 = this.generateGame(1,3, 0,2,1);
      const response3 = this.generateGame(1,3, 0,2,1);
      const response4 = this.generateGame(1,3, 0,2,1);
      const response5 = this.generateGame(1,3, 0,2,1);
      const response6 = this.generateGame(1,3, 0,2,1);
      const response7 = this.generateGame(1,3, 0,2,1);
      const response8 = this.generateGame(1,3, 0,2,1);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});     

      this.setState(this.getExtremeState());
      this.setState({selectedValue: 'Extreme'});

    }
    else if(selectedValue === 'Hard'){
    
    this.setState({mark8: (0.00192000).toFixed(8)});
    this.setState({mark7: (0.00368640).toFixed(8)}); 
    this.setState({mark6: (0.00707788).toFixed(8)});
    this.setState({mark5: (0.01358954).toFixed(8)});
    this.setState({mark4: (0.02609192).toFixed(8)});
    this.setState({mark3: (0.05009649).toFixed(8)});
    this.setState({mark2: (0.09618527).toFixed(8)});
    this.setState({mark1: (0.18467573).toFixed(8)});
    this.setState({mark0: (0.35457740).toFixed(8)});
    
    this.setState({payout8: (1.92).toFixed(2)});
    this.setState({payout7: (3.6864).toFixed(2)});
    this.setState({payout6: (7.0778).toFixed(2)});
    this.setState({payout5: (13.5895).toFixed(2)});
    this.setState({payout4: (26.0919).toFixed(2)});
    this.setState({payout3: (50.0964).toFixed(2)});
    this.setState({payout2: (96.18527).toFixed(2)});
    this.setState({payout1: (184.67573).toFixed(2)});
    this.setState({payout0: (354.5774).toFixed(2)});

      const response0 = this.generateGame(1,2, 0,2,1);
      const response1 = this.generateGame(1,2, 0,2,1);
      const response2 = this.generateGame(1,2, 0,2,1);
      const response3 = this.generateGame(1,2, 0,2,1);
      const response4 = this.generateGame(1,2, 0,2,1);
      const response5 = this.generateGame(1,2, 0,2,1);
      const response6 = this.generateGame(1,2, 0,2,1);
      const response7 = this.generateGame(1,2, 0,2,1);
      const response8 = this.generateGame(1,2, 0,2,1);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});

      this.setState(this.getHardState());
      this.setState({selectedValue: 'Hard'});
    }
    else if(selectedValue === 'Medium'){

    this.setState({mark8: (0.00145500).toFixed(8)});
    this.setState({mark7: (0.00211702).toFixed(8)});
    this.setState({mark6: (0.00308027).toFixed(8)});
    this.setState({mark5: (0.00448179).toFixed(8)});
    this.setState({mark4: (0.00652101).toFixed(8)});
    this.setState({mark3: (0.00948807).toFixed(8)});
    this.setState({mark2: (0.01380514).toFixed(8)});
    this.setState({mark1: (0.02008648).toFixed(8)});
    this.setState({mark0: (0.02922583).toFixed(8)});    

    this.setState({payout8: (1.4550).toFixed(2)});
    this.setState({payout7: (2.1170).toFixed(2)});
    this.setState({payout6: (3.08027137).toFixed(2)});
    this.setState({payout5: (4.48179485).toFixed(2)});
    this.setState({payout4: (6.52101150).toFixed(2)});
    this.setState({payout3: (9.48807174).toFixed(2)});
    this.setState({payout2: (13.80514438).toFixed(2)});
    this.setState({payout1: (20.08648508).toFixed(2)});
    this.setState({payout0: (29.22583579).toFixed(2)});

      const response0 = this.generateGame(1,3, 0,3,1);
      const response1 = this.generateGame(1,3, 0,3,1);
      const response2 = this.generateGame(1,3, 0,3,1);
      const response3 = this.generateGame(1,3, 0,3,1);
      const response4 = this.generateGame(1,3, 0,3,1);
      const response5 = this.generateGame(1,3, 0,3,1);
      const response6 = this.generateGame(1,3, 0,3,1);
      const response7 = this.generateGame(1,3, 0,3,1);
      const response8 = this.generateGame(1,3, 0,3,1);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});

      this.setState(this.getMediumState());
      this.setState({selectedValue: 'Medium'});   
    }
    else {

    this.setState({mark8: (0.00129333).toFixed(8)});
    this.setState({mark7: (0.00167271).toFixed(8)});
    this.setState({mark6: (0.00216337).toFixed(8)});
    this.setState({mark5: (0.00279796).toFixed(8)});
    this.setState({mark4: (0.00361869).toFixed(8)});
    this.setState({mark3: (0.00468018).toFixed(8)});
    this.setState({mark2: (0.00605303).toFixed(8)});
    this.setState({mark1: (0.00782859).toFixed(8)});
    this.setState({mark0: (0.01012498).toFixed(8)});    

    this.setState({payout8: (1.29333).toFixed(2)});
    this.setState({payout7: (1.67271).toFixed(2)});
    this.setState({payout6: (2.16337).toFixed(2)});
    this.setState({payout5: (2.79796).toFixed(2)});
    this.setState({payout4: (3.61869).toFixed(2)});
    this.setState({payout3: (4.68018).toFixed(2)});
    this.setState({payout2: (6.05303).toFixed(2)});
    this.setState({payout1: (7.82859).toFixed(2)});
    this.setState({payout0: (10.12498).toFixed(2)});

      const response0 = this.generateGame(1,4, 0,4,1);
      const response1 = this.generateGame(1,4, 0,4,1);
      const response2 = this.generateGame(1,4, 0,4,1);
      const response3 = this.generateGame(1,4, 0,4,1);
      const response4 = this.generateGame(1,4, 0,4,1);
      const response5 = this.generateGame(1,4, 0,4,1);
      const response6 = this.generateGame(1,4, 0,4,1);
      const response7 = this.generateGame(1,4, 0,4,1);
      const response8 = this.generateGame(1,4, 0,4,1);
     
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});  

      this.setState(this.getInitialState1());
      this.setState({clicks:0.00100000.toFixed(8)});
      this.setState({selectedValue: 'Easy'});      
    } 

    var bets = this.state.clicks;    
    this.setState({clicks: bets}); 
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
  _onChange: function () {
        this.setState(gamestate());
  },

  restart:function(...args) { 
  
    if(this.state.selectedValue === 'Nightmare'){
      //alert('nightmare restart');
      const response0 = this.generateGame(1,4, 0,4,1);
      const response1 = this.generateGame(1,4, 0,4,1);
      const response2 = this.generateGame(1,4, 0,4,1);
      const response3 = this.generateGame(1,4, 0,4,1);
      const response4 = this.generateGame(1,4, 0,4,1);
      const response5 = this.generateGame(1,4, 0,4,1);
      const response6 = this.generateGame(1,4, 0,4,1);      
   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});

      this.setState(this.getNightmareState(...args));      
      
      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 6;
      this.setState({currentstep: cstep});
      
    }
    else{      
      
      if(this.state.currentstep === 6){
        var currentclicks = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var eth_value = (currentclicks + evalue). toFixed(8);
          
          var engine = Engine;
         this._endgame(eth_value);       
        GameSettingsStore.addChangeListener(this._onChange); 
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep +1;
        
         if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         //Add Ethereum Amount
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
        //show alert
      const getAlert = function(){
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       }; 

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
       this._onGameCrash();      
        GameSettingsStore.addChangeListener(this._onChange);     

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      }    
 
    }
    else if(this.state.selectedValue === 'Extreme'){
  
      const response0 = this.generateGame(1,3, 0,3,1);
      const response1 = this.generateGame(1,3, 0,3,1);
      const response2 = this.generateGame(1,3, 0,3,1);
      const response3 = this.generateGame(1,3, 0,3,1);
      const response4 = this.generateGame(1,3, 0,3,1);
      const response5 = this.generateGame(1,3, 0,3,1);
      const response6 = this.generateGame(1,3, 0,3,1);
      const response7 = this.generateGame(1,3, 0,3,1);
      const response8 = this.generateGame(1,3, 0,3,1);
   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});

      this.setState(this.getExtremeState(...args));

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 6;
      this.setState({currentstep: cstep});
      
    }
    else{    
      if(this.state.currentstep === 6){
        var currentclicks = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var eth_value = (currentclicks + evalue). toFixed(8);
          
          var engine = Engine;
         this._endgame(eth_value);       
        GameSettingsStore.addChangeListener(this._onChange); 
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep + 1;
        
         if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
        
       //const getAlert = () => (
      const getAlert = function(){
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       };

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);       
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Hard'){      
      const response0 = this.generateGame(1,2, 0,2,1);
      const response1 = this.generateGame(1,2, 0,2,1);
      const response2 = this.generateGame(1,2, 0,2,1);
      const response3 = this.generateGame(1,2, 0,2,1);
      const response4 = this.generateGame(1,2, 0,2,1);
      const response5 = this.generateGame(1,2, 0,2,1);
      const response6 = this.generateGame(1,2, 0,2,1);
      const response7 = this.generateGame(1,2, 0,2,1);
      const response8 = this.generateGame(1,2, 0,2,1);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});

      this.setState(this.getHardState(...args));      

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 8;
      this.setState({currentstep: cstep});
      
    }
    else{      
      
      if(this.state.currentstep === 8){
        var currentclicks = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var eth_value = (currentclicks + evalue). toFixed(8);
          
          var engine = Engine;
         this._endgame(eth_value);       
        GameSettingsStore.addChangeListener(this._onChange); 
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep +1;
        
        if(forpay === 8)
        {
          var pay_amt = this.state.payout8;
          var profit_amt = this.state.mark8;          
        } 
        else if(forpay === 7)
        {
          var pay_amt = this.state.payout7;
          var profit_amt = this.state.mark7;          
        } 
         else if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
    
       //const getAlert = () => (
     const getAlert = function(){
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       };

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);       
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Medium'){
      
      const response0 = this.generateGame(1,3, 0,3,1);
      const response1 = this.generateGame(1,3, 0,3,1);
      const response2 = this.generateGame(1,3, 0,3,1);
      const response3 = this.generateGame(1,3, 0,3,1);
      const response4 = this.generateGame(1,3, 0,3,1);
      const response5 = this.generateGame(1,3, 0,3,1);
      const response6 = this.generateGame(1,3, 0,3,1);
      const response7 = this.generateGame(1,3, 0,3,1);
      const response8 = this.generateGame(1,3, 0,3,1);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});

      this.setState(this.getMediumState(...args));     

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 8;
      this.setState({currentstep: cstep});
      
    }
    else{      
      
      if(this.state.currentstep === 8){
        var currentclicks = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var eth_value = (currentclicks + evalue). toFixed(8);
          
          var engine = Engine;
         this._endgame(eth_value);       
        GameSettingsStore.addChangeListener(this._onChange); 
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep +1;
        
        if(forpay === 8)
        {
          var pay_amt = this.state.payout8;
          var profit_amt = this.state.mark8;          
        } 
        else if(forpay === 7)
        {
          var pay_amt = this.state.payout7;
          var profit_amt = this.state.mark7;          
        } 
         else if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
       //const getAlert = () => (
     const getAlert = function(){
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       };

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);       
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Easy'){ 
        

      const response0 = this.generateGame(1,4, 0,4,1);
      const response1 = this.generateGame(1,4, 0,4,1);
      const response2 = this.generateGame(1,4, 0,4,1);
      const response3 = this.generateGame(1,4, 0,4,1);
      const response4 = this.generateGame(1,4, 0,4,1);
      const response5 = this.generateGame(1,4, 0,4,1);
      const response6 = this.generateGame(1,4, 0,4,1);
      const response7 = this.generateGame(1,4, 0,4,1);
      const response8 = this.generateGame(1,4, 0,4,1);
     
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});      

      this.setState(this.getInitialState1(...args));      

      if(this.state.playbutton === 'Play'){      
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 8;
      this.setState({currentstep: cstep});

      var engine = Engine;
       this._startgame(eth_value);       
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{ 

        if(this.state.currentstep === 8){
          var currentclicks = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var eth_value = (currentclicks + evalue). toFixed(8);
          
          var engine = Engine;
         this._endgame(eth_value);       
        GameSettingsStore.addChangeListener(this._onChange); 
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep +1;
        
        if(forpay === 8)
        {
          var pay_amt = this.state.payout8;
          var profit_amt = this.state.mark8;          
        } 
        else if(forpay === 7)
        {
          var pay_amt = this.state.payout7;
          var profit_amt = this.state.mark7;          
        } 
         else if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
       
       const getAlert = function(){        
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       };

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);       
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      }
    

    } else{
      const response0 = this.generateGame(1,4, 0,4,1);
      const response1 = this.generateGame(1,4, 0,4,1);
      const response2 = this.generateGame(1,4, 0,4,1);
      const response3 = this.generateGame(1,4, 0,4,1);
      const response4 = this.generateGame(1,4, 0,4,1);
      const response5 = this.generateGame(1,4, 0,4,1);
      const response6 = this.generateGame(1,4, 0,4,1);
      const response7 = this.generateGame(1,4, 0,4,1);
      const response8 = this.generateGame(1,4, 0,4,1);
     
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});      

      this.setState(this.getInitialState1(...args));     

      if(this.state.playbutton === 'Play'){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      var eth_value = (this.state.ethereumvalue - currentclicks) .toFixed(8);
      this.setState({ethereumvalue: eth_value });
      var cstep = 8;
      this.setState({currentstep: cstep});
      
    }
    else{      
      
      if(this.state.currentstep === 8){
        this.setState({gstatus: 'fail'});
      }
      else{
        var forpay = this.state.currentstep +1;
        
        if(forpay === 8)
        {
          var pay_amt = this.state.payout8;
          var profit_amt = this.state.mark8;          
        } 
        else if(forpay === 7)
        {
          var pay_amt = this.state.payout7;
          var profit_amt = this.state.mark7;          
        } 
         else if(forpay === 6)
        {
          var pay_amt = this.state.payout6;
          var profit_amt = this.state.mark6;          
        } 
         else if(forpay === 5)
        {
          var pay_amt = this.state.payout5;
          var profit_amt = this.state.mark5;          
        } 
         else if(forpay === 4)
        {
          var pay_amt = this.state.payout4;
          var profit_amt = this.state.mark4;         
        } 
         else if(forpay === 3)
        {
          var pay_amt = this.state.payout3;
          var profit_amt = this.state.mark3;          
        } 
         else if(forpay === 2)
        {
          var pay_amt = this.state.payout2;
          var profit_amt = this.state.mark2;          
        } 
         else if(forpay === 1)
        {
          var pay_amt = this.state.payout1;
          var profit_amt = this.state.mark1;          
        } 
         else
        {
          var pay_amt = this.state.payout0;
          var profit_amt = this.state.mark0;
        } 

         //Add Ethereum Amount
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
        //show alert
     const getAlert = function(){      
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       }; 

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = (Number(engine.balance) + Number(profit_amt)).toFixed(8);
       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);       
        GameSettingsStore.addChangeListener(this._onChange);     

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      }
    }   
  },

  getExtremeState:function(height = 1, width = 3, maximumMines = 1) { 
  var engine = Engine; 
      return {
      height: height,
      width: 3,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: this.generateArray(height, 3, null),
      game0:this.generateArray(height, 3, null),
      game1:this.generateArray(height, 3, null),
      game2:this.generateArray(height, 3, null),
      game3:this.generateArray(height, 3, null),
      game4:this.generateArray(height, 3, null),
      game5:this.generateArray(height, 3, null),
      game6:this.generateArray(height, 3, null),
      cc:0,
      solution: null,
      gameStarted: false,
      gameFinished: false,
      currentvalue:'F', 
      currentstep:7,     
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
      gstatus:'',
      ethereumvalue:(engine.balance).toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Extreme',
      alert:null,
    };   
  },

  getNightmareState:function(height = 1, width = 4, maximumMines = 1) {  
    var engine = Engine;
      return {
      height: height,
      width: 4,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: this.generateArray(height, 4, null),
      game0:this.generateArray(height, 4, null),
      game1:this.generateArray(height, 4, null),
      game2:this.generateArray(height, 4, null),
      game3:this.generateArray(height, 4, null),
      game4:this.generateArray(height, 4, null),
      game5:this.generateArray(height, 4, null),
      game6:this.generateArray(height, 4, null),
      cc:0,
      solution: null,
      gameStarted: false,
      gameFinished: false,
      currentvalue:'F', 
      currentstep:7,     
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
      gstatus:'',
      ethereumvalue:(engine.balance).toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Nightmare',
      alert:null,
    };   
  },

  getHardState:function(height = 1, width = 2, maximumMines = 1) {  
    var engine = Engine;
      return {
      height: height,
      width: 2,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: this.generateArray(height, 2, null),
      game0:this.generateArray(height, 2, null),
      game1:this.generateArray(height, 2, null),
      game2:this.generateArray(height, 2, null),
      game3:this.generateArray(height, 2, null),
      game4:this.generateArray(height, 2, null),
      game5:this.generateArray(height, 2, null),
      game6:this.generateArray(height, 2, null),
      game7:this.generateArray(height, 2, null),
      game8:this.generateArray(height, 2, null),
      cc:0,
      solution: null,
      gameStarted: false,
      gameFinished: false,
      currentvalue:'F',  
      currentstep:9,    
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
      gstatus:'',
      ethereumvalue:(engine.balance).toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Hard',
      alert:null,
    };   
  },

  getMediumState:function(height = 1, width = 3, maximumMines = 1) { 
  var engine = Engine; 
      return {
      height: height,
      width: 3,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: this.generateArray(height, 3, null),
      game0:this.generateArray(height, 3, null),
      game1:this.generateArray(height, 3, null),
      game2:this.generateArray(height, 3, null),
      game3:this.generateArray(height, 3, null),
      game4:this.generateArray(height, 3, null),
      game5:this.generateArray(height, 3, null),
      game6:this.generateArray(height, 3, null),
      game7:this.generateArray(height, 3, null),
      game8:this.generateArray(height, 3, null),
      cc:0,
      solution: null,
      gameStarted: false,
      gameFinished: false,
      currentvalue:'F', 
      currentstep:9,     
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
      gstatus:'',
      ethereumvalue:(engine.balance).toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Medium',
      alert:null,
    };
   
  },

  getInitialState1:function(height = 1, width = 4, maximumMines = 1) {
    var engine = Engine;
      return {
      height: height,
      width: 4,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: this.generateArray(height, 4, null),
      game0:this.generateArray(height, 4, null),
      game1:this.generateArray(height, 4, null),
      game2:this.generateArray(height, 4, null),
      game3:this.generateArray(height, 4, null),
      game4:this.generateArray(height, 4, null),
      game5:this.generateArray(height, 4, null),
      game6:this.generateArray(height, 4, null),
      game7:this.generateArray(height, 4, null),
      game8:this.generateArray(height, 4, null),
      cc:0,
      solution: null,
      gameStarted: false,
      gameFinished: false,
      currentvalue:'F',
      currentstep:9,
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
      users:[],
      changed:false,
      gstatus:'',
      ethereumvalue:(engine.balance).toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue: 'Easy',
      alert:null,
    };
   
  },

  

  reveal:function(game, solution, row, column) {
   
    game[row][column] = solution[row][column];

    if (game[row][column] === 0 || game[row][column] === 1 || game[row][column] === 2 || game[row][column] === 3) {   
   
    var gamestatus = 'success';    
       return gamestatus;
     }    

  },

  expand:function(game, solution, row, column) {
    this.reveal(game, solution, row - 1, column);
    this.reveal(game, solution, row + 1, column);
    this.reveal(game, solution, row, column - 1);
    this.reveal(game, solution, row, column + 1);
    this.reveal(game, solution, row - 1, column - 1);
    this.reveal(game, solution, row - 1, column + 1);
    this.reveal(game, solution, row + 1, column + 1);
    this.reveal(game, solution, row + 1, column - 1);
  },

  updateGameStatus:function(game, solution, row, column, rowi) {
   //alert(rowi);
   if(rowi===0){
    //alert('zzzz');
      if (this.isMine(game, row, column)) {
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !this.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
     
      row = this.state.row + 1;
      game = this.getSolution(game, solution, 'F');
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
    }

    this.setState({ game, gameFinished, buttonStatus, minesLeft});
   }
   else if(rowi === 1){
    //alert('one');
      if (this.isMine(game, row, column)) {
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !this.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      
      row = this.state.row + 1;
      game = this.getSolution(game, solution, 'F');
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
    }

    this.setState({ game, gameFinished, buttonStatus, minesLeft});
   }
   else if(rowi === 2){
    //alert('two');
      if (this.isMine(game, row, column)) {
        //alert('mine');
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !this.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      //alert('fffff');
      
      row = this.state.row + 1;
      game = this.getSolution(game, solution, 'F');
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
    }

    this.setState({ game,gameFinished, buttonStatus, minesLeft});
   }
   else{
    //alert('fout');
     if (this.isMine(game, row, column)) {
        //alert('mine');
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !this.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      //alert('fffff');
      
      row = this.state.row + 1;
      game = this.getSolution(game, solution, 'F');
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
    }

    this.setState({ game,gameFinished, buttonStatus, minesLeft});
   }  

  },

  setGameOver:function(game, solution, row, column) {    
      this.setState({gstatus: 'fail'});
      //alert('two  ddddd');
      
      game = game.map(
        (row, rowKey) => row.map(
          (square, squareKey) => {
            const isMine = this.isMine(solution, rowKey, squareKey);
            if (square === 'F') {
              //alert('ffff');
              return isMine ? square : 'W';
            }


            return isMine ? 'M' : 'W';
          }
        )
      );
      this.vibrate(800);
      game[row][column] = 'C'; // differ clicked mine that led to game over


      this.setState({
        game,
        gameFinished: true,
        buttonStatus: EMOJI_GAME_OVER,
      });  
   
  },

  handleChange:function (event){
    if(this.state.currentstatus === 'before'){
      this.setState({clicks : event.target.value});
    }else{}
    
  },

  IncrementItem:function (){
    if(this.state.currentstatus === 'before'){
      var newVal = this.state.clicks; 
      

    const firstdigit = (newVal + '').charAt(0);    
    
    if(firstdigit === '0'){ 

      var patt1 = /[1-9]/g;
      var result = newVal.toString().match(patt1);
         
       if(result == '2'){           
          newVal = newVal * 2.5;
          newVal = newVal.toFixed(8);

          //Change marks
          var newmark0 = (this.state.mark0 * 2.5).toFixed(8);
          var newmark1 = (this.state.mark1 * 2.5).toFixed(8);
          var newmark2 = (this.state.mark2 * 2.5).toFixed(8);
          var newmark3 = (this.state.mark3 * 2.5).toFixed(8);
          var newmark4 = (this.state.mark4 * 2.5).toFixed(8);
          var newmark5 = (this.state.mark5 * 2.5).toFixed(8);
          var newmark6 = (this.state.mark6 * 2.5).toFixed(8);
          var newmark7 = (this.state.mark7 * 2.5).toFixed(8);
          var newmark8 = (this.state.mark8 * 2.5).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
        }
        else {          
          newVal = newVal * 2;
          newVal = newVal.toFixed(8);

          //Change marks
          var newmark0 = (this.state.mark0 * 2).toFixed(8);
          var newmark1 = (this.state.mark1 * 2).toFixed(8);
          var newmark2 = (this.state.mark2 * 2).toFixed(8);
          var newmark3 = (this.state.mark3 * 2).toFixed(8);
          var newmark4 = (this.state.mark4 * 2).toFixed(8);
          var newmark5 = (this.state.mark5 * 2).toFixed(8);
          var newmark6 = (this.state.mark6 * 2).toFixed(8);
          var newmark7 = (this.state.mark7 * 2).toFixed(8);
          var newmark8 = (this.state.mark8 * 2).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
        } 
    } 
    else{
      if(firstdigit === '2'){
       newVal = (newVal * 2.5).toFixed(8);

       //Change marks
          var newmark0 = (this.state.mark0 * 2.5).toFixed(8);
          var newmark1 = (this.state.mark1 * 2.5).toFixed(8);
          var newmark2 = (this.state.mark2 * 2.5).toFixed(8);
          var newmark3 = (this.state.mark3 * 2.5).toFixed(8);
          var newmark4 = (this.state.mark4 * 2.5).toFixed(8);
          var newmark5 = (this.state.mark5 * 2.5).toFixed(8);
          var newmark6 = (this.state.mark6 * 2.5).toFixed(8);
          var newmark7 = (this.state.mark7 * 2.5).toFixed(8);
          var newmark8 = (this.state.mark8 * 2.5).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
      }     
      else{
        newVal = (newVal * 2).toFixed(8);
      }      
    }  
    if (newVal <= this.state.ethereumvalue) {   
        this.setState({ clicks: newVal });
      } 
    }
    else{}        
  },


  DecreaseItem:function() {
    if(this.state.currentstatus === 'before'){
      var newVal = this.state.clicks;
    const firstdigit = (newVal + '').charAt(0); 
   
    if(firstdigit === '0'){ 

      var patt1 = /[1-9]/g;
      var result = newVal.toString().match(patt1);
         
       if(result == '5'){ 
               
          newVal = newVal / 2.5;
          newVal = newVal.toFixed(8);

          //Change marks
          var newmark0 = (this.state.mark0 / 2.5).toFixed(8);
          var newmark1 = (this.state.mark1 / 2.5).toFixed(8);
          var newmark2 = (this.state.mark2 / 2.5).toFixed(8);
          var newmark3 = (this.state.mark3 / 2.5).toFixed(8);
          var newmark4 = (this.state.mark4 / 2.5).toFixed(8);
          var newmark5 = (this.state.mark5 / 2.5).toFixed(8);
          var newmark6 = (this.state.mark6 / 2.5).toFixed(8);
          var newmark7 = (this.state.mark7 / 2.5).toFixed(8);
          var newmark8 = (this.state.mark8 / 2.5).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
        }
        else {          
          newVal = newVal / 2;
          newVal = newVal.toFixed(8);

          //Change marks
          var newmark0 = (this.state.mark0 / 2).toFixed(8);
          var newmark1 = (this.state.mark1 / 2).toFixed(8);
          var newmark2 = (this.state.mark2 / 2).toFixed(8);
          var newmark3 = (this.state.mark3 / 2).toFixed(8);
          var newmark4 = (this.state.mark4 / 2).toFixed(8);
          var newmark5 = (this.state.mark5 / 2).toFixed(8);
          var newmark6 = (this.state.mark6 / 2).toFixed(8);
          var newmark7 = (this.state.mark7 / 2).toFixed(8);
          var newmark8 = (this.state.mark8 / 2).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
        } 
    } 
    else{   
      if(firstdigit === '5'){
         newVal = (newVal / 2.5).toFixed(8);

         //Change marks
          var newmark0 = (this.state.mark0 / 2.5).toFixed(8);
          var newmark1 = (this.state.mark1 / 2.5).toFixed(8);
          var newmark2 = (this.state.mark2 / 2.5).toFixed(8);
          var newmark3 = (this.state.mark3 / 2.5).toFixed(8);
          var newmark4 = (this.state.mark4 / 2.5).toFixed(8);
          var newmark5 = (this.state.mark5 / 2.5).toFixed(8);
          var newmark6 = (this.state.mark6 / 2.5).toFixed(8);
          var newmark7 = (this.state.mark7 / 2.5).toFixed(8);
          var newmark8 = (this.state.mark8 / 2.5).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});
      }     
      else{        
        newVal = (newVal / 2).toFixed(8); 

        //Change marks
          var newmark0 = (this.state.mark0 / 2).toFixed(8);
          var newmark1 = (this.state.mark1 / 2).toFixed(8);
          var newmark2 = (this.state.mark2 / 2).toFixed(8);
          var newmark3 = (this.state.mark3 / 2).toFixed(8);
          var newmark4 = (this.state.mark4 / 2).toFixed(8);
          var newmark5 = (this.state.mark5 / 2).toFixed(8);
          var newmark6 = (this.state.mark6 / 2).toFixed(8);
          var newmark7 = (this.state.mark7 / 2).toFixed(8);
          var newmark8 = (this.state.mark8 / 2).toFixed(8);

          this.setState({mark0:newmark0});
          this.setState({mark1:newmark1});
          this.setState({mark2:newmark2});
          this.setState({mark3:newmark3});
          this.setState({mark4:newmark4});
          this.setState({mark5:newmark5});
          this.setState({mark6:newmark6});
          this.setState({mark7:newmark7});
          this.setState({mark8:newmark8});      
      }        
    }   

    if (newVal >= this.state.minVal) {   
        this.setState({ clicks: newVal });
      }
    }
    else{}    
     
  },

  handleClick:function(row, column, data, rowi) {
    
    this.state.cc = column;
    if(rowi === 0){      
      
      let game = this.state.game0.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data0;    

      this.setState({gameStarted: true, solution: solution}); 
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      
    const getAlert = function(){
        return D.div( {  },
                SweetAlert({
                          success :true,
                          title:  pay_amt,
                          amount: profit_amt,
                          cname: 'overlay2'

        }));
       };

    this.setState({
      alert: getAlert()
    });

      this.setState({gameFinished: true });
      var markvalue = 'Take ' + this.state.mark0;
      this.setState({playbutton: 'Play' });
      var eth_value = Number(this.state.ethereumvalue) + Number(this.state.mark0);
      
      this.setState({ethereumvalue:  eth_value.toFixed(8) });
      let minesLeft = this.state.minesLeft;     
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);     

      
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '0');
      this.setState({changed: true});
      this.setState({gstatus: 'success'});     

    }

    else{
      
      this.updateGameStatus(game, solution, row, column, '0');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});

      //this.state.cc = this.state.cc + 1;
      }
    }
    else if(rowi === 1){
      
      //alert('1');
      let game = this.state.game1.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data1;
     

      this.setState({gameStarted: true, solution: solution});
   
      
      
     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark1;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '1');
      this.setState({changed: true});
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{

      this.updateGameStatus(game, solution, row, column, '1');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }
    else if(rowi === 2){
      //alert(rowi);
      let game = this.state.game2.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data2;
     

      this.setState({gameStarted: true, solution: solution});
   
         

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark2;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '2');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '2');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    } 

    else if(rowi === 3){
      //alert(rowi);
      let game = this.state.game3.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data3;
     

      this.setState({gameStarted: true, solution: solution});
   
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark3;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '3');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '3');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }  

    else if(rowi === 4){
      //alert(rowi);
      let game = this.state.game4.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data4;
     

      this.setState({gameStarted: true, solution: solution});
   
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark4;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '4');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '4');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }
    else if(rowi === 5){
      //alert(rowi);
      let game = this.state.game5.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data5;
     

      this.setState({gameStarted: true, solution: solution});
   
     

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark5;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '5');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '5');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }
    else if(rowi === 6){
      //alert(rowi);
      let game = this.state.game6.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data6;
     

      this.setState({gameStarted: true, solution: solution});
   
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark6;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '6');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '6');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }
    else if(rowi === 7){
      let game = this.state.game7.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data7;
     

      this.setState({gameStarted: true, solution: solution});
   
     

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      
      var markvalue = 'Take ' + this.state.mark7;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '7');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '7');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }
    else if(rowi === 8){
     
      let game = this.state.game8.slice();
      let value = game[row][column];
      

      let solution;    
      solution = this.state.data8;
      
      this.setState({gameStarted: true, solution: solution});
   
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){ 
      
      var markvalue = 'Take ' + this.state.mark8;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '8');
      this.setState({gstatus: 'success'});
      //alert(game);

    }

    else{
       //alert('fail');
      this.updateGameStatus(game, solution, row, column, '8');
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.state.cc = this.state.cc + 1;
    }
    }

    else{
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.updateGameStatus(game, solution, row, column, '2');
     
      }
   
  },

 

        render: function () {

            const BoardItems = []; var gamelength;
 
              if(this.state.selectedValue === 'Nightmare'){
                gamelength = '7';
              }
              else if(this.state.selectedValue === 'Extreme'){
                gamelength = '7';
              }
              else if(this.state.selectedValue === 'Hard'){
                gamelength = '9';
              }
              else if(this.state.selectedValue === 'Medium'){
                gamelength = '9';
              }
              else if(this.state.selectedValue === 'Easy'){
                 gamelength = '9';
              }
              else{ gamelength = '9'; }
                for (var i=0; i < gamelength; i++) {
             
                  var datai; var statusi = 'true'; const rowi = i; var cid; var nrow; var old; var gg = [];
                  switch (i) {
                    case 0:
                      datai : this.state.data0;
                       gg : this.state.game0;
                       
                      nrow : 2;  
                      // if(this.state.currentstep === 0)
                      // {
                      //   statusi : 'false';              
                      // }
                      // else{
                      //   statusi : 'true';            
                      // }

                      if(this.state.currentstep == 0)
                      {
                         statusi = 'false';              
                      }
                      else{
                         statusi = 'true';            
                      }     
                         
                      break;

                    case 1:
                    
                    datai : this.state.data1;
                    gg : this.state.game1;
                    
                    nrow : 1;
                     // if(this.state.currentstep === 1)
                     //  {
                     //    statusi : 'false';
                     //    nrow : 1;
                       
                     //  }
                     //  else{
                     //    statusi : 'true';
                       
                     //  }

                      if(this.state.currentstep == 1)
                      {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;

                    case 2:
                    
                    gg : this.state.game2;
                    
                    datai : this.state.data2;
                    nrow : 0;
                     // if(this.state.currentstep === 2)
                     //  {
                     //    statusi : 'false';
                                     
                     //  }
                     //  else{
                     //    statusi : 'true';
                                 
                     //  }
                      if(this.state.currentstep == 2 )
                      {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 3:
                     
                    gg : this.state.game3;
                    
                    datai : this.state.data3;
                    nrow : 0;
                     // if(this.state.currentstep === 3)
                     //  {
                     //    statusi : 'false';
                                     
                     //  }
                     //  else{
                     //    statusi : 'true';
                                 
                     //  }
                      if(this.state.currentstep == 3)
                      {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 4:
                      
                    gg : this.state.game4;
                    
                    datai : this.state.data4;
                    nrow : 0;
                     // if(this.state.currentstep === 4)
                     //  {
                     //    statusi : 'false';
                                     
                     //  }
                     //  else{
                     //    statusi : 'true';
                                 
                     //  }
                      if(this.state.currentstep == 4)
                      {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 5:
                      
                    gg : this.state.game5;
                   
                    datai : this.state.data5;
                    nrow : 0;
                     // if(this.state.currentstep === 5)
                     //  {
                     //    statusi : 'false';
                                     
                     //  }
                     //  else{
                     //    statusi : 'true';
                                 
                     //  }
                      if(this.state.currentstep == 5)
                      {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 6:
                      
                      gg : this.state.game6;
                      
                      datai : this.state.data6;
                      nrow : 0;
                       // if(this.state.currentstep === 6)
                       //  {
                       //    statusi : 'false';
                                       
                       //  }
                       //  else{
                       //    statusi : 'true';
                                   
                       //  }
                        if(this.state.currentstep == 6)
                        {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 7:
                      
                      gg : this.state.game7;
                      
                      datai : this.state.data7;
                      nrow : 0;
                       // if(this.state.currentstep === 7)
                       //  {
                       //    statusi : 'false';
                                       
                       //  }
                       //  else{
                       //    statusi : 'true';
                                   
                       //  }
                        if(this.state.currentstep == 7)
                       {
                       statusi = 'false';              
                      }
                      else{                                     
                        statusi = 'true';            
                      }
                     
                      break;  
                      case 8:
                      
                      gg : this.state.game8;
                      
                      datai : this.state.data8;
                      nrow : 0;
                       // if(this.state.currentstep === 8)
                       //  {
                       //    statusi : 'false';
                                       
                       //  }
                       //  else{
                       //    statusi : 'true';
                                   
                       //  }
                        if(this.state.currentstep == 8 )
                        {
                       statusi = 'false';              
                      }
                      else{
                        statusi = 'true';            
                      }
                      break; 
                      
                  }
                  //console.log('cccccc', statusi);

                BoardItems.push(D.div({className: 'Game' },
                     Board({ 
                            id:i,
                            key:i,
                            game:this.state.game0,
                            onClick:(row, column) => this.handleClick(row, column, datai, rowi),
                            gameFinished:this.state.gameFinished,
                            cc:statusi,
                            game0:this.state.game0,
                            game1:this.state.game1,
                            game2:this.state.game2,
                            game3:this.state.game3,
                            game4:this.state.game4,
                            game5:this.state.game5,
                            game6:this.state.game6,
                            game7:this.state.game7,
                            game8:this.state.game8,                            
                            data0:this.state.data0,
                            data1:this.state.data1,
                            data2:this.state.data2,
                            data3:this.state.data3,
                            data4:this.state.data4,
                            data5:this.state.data5,
                            data6:this.state.data6,
                            data7:this.state.data7,
                            data8:this.state.data8,
                            mark0:this.state.mark0,
                            mark1:this.state.mark1,
                            mark2:this.state.mark2,
                            mark3:this.state.mark3,
                            mark4:this.state.mark4,
                            mark5:this.state.mark5,
                            mark6:this.state.mark6,
                            mark7:this.state.mark7,
                            mark8:this.state.mark8,                           
                            state:this.state.currentstep,
                            currentstatus:this.state.currentstatus,
                            width:this.state.width,
                            alldata:this.state.alldata,
                            gstatus:this.state.gstatus,
                            isMobileOrSmall: this.state.isMobileOrSmall,
                            controlsSize: this.state.controlsSize
                    })
                ),                   
            )
        } 


  

            var messageContainer;
            if (USER_MESSAGE && this.state.showMessage) {

                var messageContent, messageClass, containerClass = 'show-message';
                switch (USER_MESSAGE.type) {
                    case 'error':
                        messageContent = D.span(null,
                            D.span(null, USER_MESSAGE.text)
                        );
                        messageClass = 'error';
                        break;
                    case 'newUser':
                        messageContent = D.span(null,
                            D.a({ href: "/request" }, "Welcome to bustabit.com, to start you have 2 free bits, bits you can request them here or you can just watch the current games... have fun :D")
                        );
                        messageClass = 'new-user';
                        break;
                    case 'received':
                        messageContent = D.span(null,
                            D.span(null, "Congratulations you have been credited " + USER_MESSAGE.qty + " free bits. Have fun!")
                        );
                        messageClass = 'received';
                        break;
                    case 'advice':
                        messageContent = D.span(null,
                            D.span(null, USER_MESSAGE.advice)
                        );
                        messageClass = 'advice';
                        break;
                    case 'collect':
                        messageContent = D.span(null,
                            D.a({ href: '/request' }, 'Collect your two free bits!')
                        );
                        messageClass = 'collect';
                        break;
                    default:
                        messageContent = null;
                        messageClass = 'hide';
                        containerClass = '';
                }

                messageContainer = D.div({ id: 'game-message-container', className: messageClass },
                    messageContent,
                    D.a({ className: 'close-message', onClick: this._hideMessage }, D.i({ className: 'fa fa-times' }))
                )
            } else {
                messageContainer = null;
                containerClass = '';
            }

            // var rightContainer = !this.state.isMobileOrSmall ?
            //     D.div({ id: 'game-right-container' },
            //         Players(),
            //         BetBar()
            //     ) : null;

            var rightContainer = !this.state.isMobileOrSmall ?

                D.div({ id: 'game-right-container' },
                    Players(),
                    BetBar()
                ) : null;

            return D.div({ id: 'game-inner-container' },
                   'Game Game Game',
                TopBar({
                    isMobileOrSmall: this.state.isMobileOrSmall
                }),

                // messageContainer,

                // D.div({ id: 'game-playable-container', className: containerClass },
                //     D.div({ id: 'game-left-container', className: this.state.isMobileOrSmall? ' small-window' : '' },
                //         D.div({ id: 'chart-controls-row' },
                //             D.div({ id: 'chart-controls-col', className: this.state.controlsSize },
                //                 D.div({ className: 'cell-wrapper' },
                //                     ChartControls({
                //                         isMobileOrSmall: this.state.isMobileOrSmall,
                //                         controlsSize: this.state.controlsSize
                //                     })
                //                 )
                //             )
                //         ),

                //     ),


                //     rightContainer
                // ),
                // D.div({ id: 'tabs-controls-row' },
                //             D.div({ id: 'tabs-controls-col' },
                //                 D.div({ className: 'cell-wrapper' },
                //                     TabsSelector({
                //                         isMobileOrSmall: this.state.isMobileOrSmall,
                //                         controlsSize: this.state.controlsSize
                //                     })
                //                 )
                //             )
                //         ),




                D.div({ id: 'game-upper-container', className: containerClass ,className:'header'},
                    //Game
                    D.div({ id: 'game-left-container', className: this.state.isMobileOrSmall ? ' small-window' : '' ,className:'col-md-12'},
                        D.div({ id: 'chart-controls-row',className:'offset-md-2 col-md-4' },
                            D.div({ id: 'chart-controls-col', className: this.state.controlsSize ,className:'balance'},
                              D.h3({  id: 'ethvalue', className: '' },
                                    'Ξ' + this.state.ethereumvalue,
                                 ),                                
                                D.div({  id: 'boo'},
                                    // this.state.data0 + '|' + this.state.data1 + '|' + this.state.data2 + '|' + this.state.data3 + '|' + this.state.data4 + '|' + this.state.data5 + '|' + this.state.data6
                                    // + '|' + this.state.data7 + '|' + this.state.data8,
                                BoardItems,                                
                                 ),
                                D.div({  id: 'boo'},                                    
                                this.state.alert
                                 ),
                                // D.div({  id: 'ethvalue', className: 'selectvalue' },
                                //    SweetAlert({                                      
                                //       success: true ,
                                //       title: 'Testing',                                      
                                //       amount: '1000'
                                //   })
                                //  ), 
                                

                                D.div({ className: 'sc-cIShpX play' },
                                   D.span({  onClick:() => this.restart(this.state.height, this.state.width, this.state.maximumMines) },                          
                                    this.state.playbutton,
                                    ),
                                 ),



                                D.div({  id: 'ethvalue', className: 'selectvalue' },
                                   DynamicSelect({
                                      arrayOfData: arrayOfData,
                                      onSelectChange: this.handleSelectChange ,
                                      selectedValue: this.state.selectedValue ,                                      
                                      currentstatus: this.state.currentstatus , clicks: this.state.clicks
                                  })
                                 ), 

                                D.div({  className: 'sc-cIShpX eJBueb' },
                                   D.span({  onClick:() => this.IncrementItem() },
                                    D.i({ className:'fa fa-plus plus' }),
                                  ),
                                  D.span({  onClick:() => this.DecreaseItem() },
                                    D.i({ className:'fa fa-minus minus' }),
                                  ), 
                                  D.input({  className:'input', spellCheck:'false', type:'text', tabIndex:'-1', value:this.state.clicks, onChange:this.handleChange.bind(this) },
                                  ),  

                                   D.div({  className: 'amount-label' }, 'Bet amount' ),                                   
                                 
                                ), 
                            ),
                        ),
                        D.div({className:'col-md-2 col-md-pull-1 headertop-btn'},
                          D.div({className:'right'},
                              D.div({className:'btn'},
                                  D.a({className:'glow-on-hover'},'Signin'),
                                  D.a({className:'glow-on-hover'},'Singup')
                                ),

                            ),

                          ),
                    ),

                    rightContainer
                ),
                // D.div({ id: 'game-lower-container', className: containerClass },
                //     D.div({ id: 'game-lower-bottom-container', className: this.state.isMobileOrSmall ? ' small-window' : '' },
                //         D.div({ id: 'tabs-controls-row' },
                //             D.div({ id: 'tabs-controls-col' },
                //                 D.div({ className: 'cell-wrapper' },
                //                     TabsSelector({
                //                         isMobileOrSmall: this.state.isMobileOrSmall,
                //                         controlsSize: this.state.controlsSize
                //                     })
                //                 )
                //             )
                //         ),
                //     ),
                // ),
                D.div({className:'w3l-banner-grids'},
                    D.div({className:'col-md-12 slider'},
                    D.div({className:'offset-md-2 col-md-4'},

                      D.div({ id: '' ,className:''},
                              // D.div({ id: 'game-lower-bottom-container', className: this.state.isMobileOrSmall ? ' small-window' : '' },
                              //     D.div({ id: 'tabs-controls-row' },
                              //         D.div({ id: 'tabs-controls-col' },
                              //             D.div({ className: 'cell-wrapper' },
                              //                 TabsHistorySelector({
                              //                     isMobileOrSmall: this.state.isMobileOrSmall,
                              //                     controlsSize: this.state.controlsSize
                              //                 })
                              //             )
                              //         )
                              //     ),
                              // ),
                          ),
                      ),
                    // D.div({className:'col-md-6'},

                    //       D.div({ id: '', className: this.state.isMobileOrSmall ? ' small-window' : '' },
                    //         D.div({ id: 'game-lower-bottom-container', className: this.state.isMobileOrSmall ? ' small-window' : '' },
                    //             D.div({ id: 'tabs-controls-row' },
                    //                 D.div({ id: 'tabs-controls-col' },
                    //                     D.div({ className: 'cell-wrapper' },
                    //                         TabsSelector({
                    //                             isMobileOrSmall: this.state.isMobileOrSmall,
                    //                             controlsSize: this.state.controlsSize
                    //                         })
                    //                     )
                    //                 )
                    //             ),
                    //         ),
                    //     ),
                    //   ),
                  ),
                  ),
                D.div({className:'w3l-banner-grids'},
                D.div({className:'col-md-12 slider'},
                          D.div({ id: 'game-lower-container', className: containerClass,className:'offset-md-2 col-md-4 nopadding' },
                          
                          D.div({ id: '', className: this.state.isMobileOrSmall ? ' small-window' : '' ,className:'col-md-6 nopadding'},
                              
                          ),
                      ),
              ),
              ),  





                // D.div({ id: 'game-playable-container', className: containerClass },
                //     D.div({ id: 'game-left-container', className: this.state.isMobileOrSmall ? ' small-window' : '' },
                //         D.div({ id: 'chart-controls-row' },
                //             D.div({ id: 'chart-controls-col', className: this.state.controlsSize },
                //                 D.div({ className: 'cell-wrapper' },
                //                     ChartControls({
                //                         isMobileOrSmall: this.state.isMobileOrSmall,
                //                         controlsSize: this.state.controlsSize
                //                     })
                //                 )
                //             )
                //         ),


                //     ),

                //     // D.div({ id: 'game-right-container' },
                //     //     Players(),
                //     //     BetBar(),
                //     // ),
                //     // D.div({ id: 'game-right-bottom-container' },
                //     //     D.div({ id: 'chart-controls-row' },
                //     //         D.div({ id: 'tabs-controls-col' },
                //     //             D.div({ className: 'cell-wrapper' },
                //     //                 TabsSelector({
                //     //                     isMobileOrSmall: this.state.isMobileOrSmall,
                //     //                     controlsSize: this.state.controlsSize
                //     //                 })
                //     //             )
                //     //         )
                //     //     )
                //     // ),
                   // D.div({ id: 'game-right-container' },
                        //Players(),
                        //BetBar(),
                   // ),
                    // D.div({ id: 'game-right-bottom-container' },
                    //     D.div({ id: 'chart-controls-row' },
                    //         D.div({ id: 'tabs-controls-col' },
                    //             D.div({ className: 'cell-wrapper' },
                    //                 TabsSelector({
                    //                     isMobileOrSmall: this.state.isMobileOrSmall,
                    //                     controlsSize: this.state.controlsSize
                    //                 })
                    //             )
                    //         )
                    //     )
                    // ),

                
            );
        }
    });

});
