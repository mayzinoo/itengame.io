/**
 * This view acts as a wrapper for all the other views in the game
 * it is subscribed to changes in EngineVirtualStore but it only
 * listen to connection changes so every view should subscribe to
 * EngineVirtualStore independently.
 */
define([
    'react',
    'components/SweetAlert',
    'components/Loading',
    'components/DemoAlert',
    'components/MemberAlert',
    'components/TopBar',
    'components/ChartControls',
    'components/TabsSelector',
    'components/TabsHistorySelector',
    'components/Players',
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
    'stores/ControlsStore',
    
    
], function (
    React,
    SweetAlertClass,
    LoadingClass,
    DemoAlertClass,
    MemberAlertClass,
    TopBarClass,
    ChartControlsClass,
    TabsSelectorClass,
    TabsHistorySelectorClass,
    PlayersClass,
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
    ControlsStore,
   
    
    
) {
    var TopBar = React.createFactory(TopBarClass);
    //var SpaceWrap = React.createFactory(SpaceWrapClass);
    var ChartControls = React.createFactory(ChartControlsClass);
    var TabsSelector = React.createFactory(TabsSelectorClass);
    var TabsHistorySelector = React.createFactory(TabsHistorySelectorClass);
    var Players = React.createFactory(PlayersClass);
    var Board = React.createFactory(BoardClass);
    var Square = React.createFactory(SquareClass);
    var DynamicSelect = React.createFactory(DynamicSelectClass);
    var SweetAlert = React.createFactory(SweetAlertClass);
    var DemoAlert = React.createFactory(DemoAlertClass);  
    var MemberAlert = React.createFactory(MemberAlertClass); 
    var Loading = React.createFactory(LoadingClass);

    
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
      //alert('gamestate');
        return {
            betSize: 10, //Bet input string in bits
            betInvalid: false, //false || string error message
            cashOut: ControlsStore.getCashOut(),
            cashOutInvalid: false, //false || string error message
            engine: Engine,
            isConnected: Engine.isConnected
        }
    }

    

    return React.createClass({
        displayName: 'Game',

        getInitialState: function () {
          
            var engine = Engine; var en_balance;
            if(engine.balance === null)
            {
                en_balance = 80000;
            }
            else{
              en_balance = Number(engine.balance);
            }

            //Set LocalStoragevalue
            localStorage.setItem('currentstep', localStorage.getItem('currentstep'));
            localStorage.setItem('currentstatus', localStorage.getItem('currentstatus'));
            
            var state = GameSettingsStore.getState(en_balance);
            state.isConnected = Engine.isConnected;
            state.showMessage = true;
            state.isMobileOrSmall = Clib.isMobileOrSmall(); //bool

            return state;
        },


        componentDidMount: function () {            
         
          var engine = Engine; var en_balance;
            if(engine.balance === null)
            {
                en_balance = 80000;
            }
            else{
              en_balance = Number(engine.balance);
            }

            this.setState({ ethereumvalue: en_balance,
                  playbutton: localStorage.getItem('playbutton')
               });  

           this.setState({loading: 'true' });

           localStorage.setItem('start_game', 'false');        
           //this.intervalId = setInterval(this.timer(this), 1000);
           this.intervalId = setInterval(() => this.timer(), 100);          

         
           Engine.on({
                'connected': this._onChange,
            });

            GameSettingsStore.addChangeListener(this._onSettingsChange); 
             window.addEventListener("resize", this._onWindowResize);
            Hotkeys.mount();    
            
        },

        timer: function() {          
          this.setState({
            currentCount: this.state.currentCount - 1
          })
          if(Number(this.state.currentCount) < 1) {
            //alert('complete');
            clearInterval(this.intervalId);
          this.setState({loading: 'false' });
            
          }
        },

        componentWillUnmount: function () {
           clearInterval(this.intervalId);
        },


        componentDidUpdate: function () {       
          if(localStorage.getItem('start_game') === 'true'){
            var readd_balance = Number(this.state.ethereumvalue) + Number(this.state.clicks);
            this._endgame(readd_balance, this.state.clicks);
          }
          
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
            var profit = profit_amt;
            var eth_value = new_value;

            ControlsActions.placeBet(bet, cashOut, eth_value, profit);
        },

         _startgame: function (balance) {
            ControlsActions.startgame(balance);
        },

         _endgame: function (balance, cclicks) {
            ControlsActions.endgame(balance, cclicks);
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

      var current_bet = Number(this.state.clicks);  
    if(current_bet === 100){      
      this.setState({mark6: 360 });
      this.setState({mark5: 1296 });
      this.setState({mark4: 4665 });
      this.setState({mark3: 16796 });
      this.setState({mark2: 60466 });
      this.setState({mark1: 217678 });
      this.setState({mark0: 783641  });
    }  
    else{
      this.setState({mark6: Math.round(current_bet * 3.6)});
      this.setState({mark5: Math.round(current_bet * 12.96)});
      this.setState({mark4: Math.round(current_bet * 46.656)});
      this.setState({mark3: Math.round(current_bet * 167.961)});
      this.setState({mark2: Math.round(current_bet * 604.661)});
      this.setState({mark1: Math.round(current_bet * 2176.782)});
      this.setState({mark0: Math.round(current_bet * 7836.416)});
    }    
    
    this.setState({payout6: (3.6).toFixed(2)});
    this.setState({payout5: (12.96).toFixed(2)});
    this.setState({payout4: (46.656).toFixed(2)});
    this.setState({payout3: (167.961).toFixed(2)});
    this.setState({payout2: (604.661).toFixed(2)});
    this.setState({payout1: (2176.782).toFixed(2)});
    this.setState({payout0: (7836.416).toFixed(2)});

      const response0 = this.generateGame(1,4, 0,4,3);
      const response1 = this.generateGame(1,4, 0,4,3);
      const response2 = this.generateGame(1,4, 0,4,3);
      const response3 = this.generateGame(1,4, 0,4,3);
      const response4 = this.generateGame(1,4, 0,4,3);
      const response5 = this.generateGame(1,4, 0,4,3);
      const response6 = this.generateGame(1,4, 0,4,3);      
   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      
      var engine = Engine; var en_balance;
      if(engine.balance === null)
      {
          en_balance = 80000;
      }
      else{
        en_balance = this.state.ethereumvalue;
      }

      if(Number(this.state.ethereumvalue === 0)){
        this.setState({valid: 'false'});
      }
      else{
        this.setState({valid: 'true'});
      }
      this.setState({ethereumvalue:this.state.ethereumvalue});
      this.setState(this.getNightmareState());
      this.setState({currentstep: 8});
      this.setState({selectedValue: 'Nightmare'});     

    }
    else if(selectedValue === 'Extreme'){
      var current_bet = Number(this.state.clicks);   
    if(current_bet === 100){ 
      this.setState({mark6: 276 });
      this.setState({mark5: 761 });
      this.setState({mark4: 2102 });
      this.setState({mark3: 5802 });
      this.setState({mark2: 16015 });
      this.setState({mark1: 44203 });
      this.setState({mark0: 122001 });
    }
    else{
      this.setState({mark6: Math.round(current_bet * 2.76)});
      this.setState({mark5: Math.round(current_bet * 7.617)});
      this.setState({mark4: Math.round(current_bet * 21.0245)});
      this.setState({mark3: Math.round(current_bet * 58.0278)});
      this.setState({mark2: Math.round(current_bet * 160.156)});
      this.setState({mark1: Math.round(current_bet * 442.0327)});
      this.setState({mark0: Math.round(current_bet * 1220.0105)});
    }  
    
    this.setState({payout6: (2.76).toFixed(2)});
    this.setState({payout5: (7.617).toFixed(2)});
    this.setState({payout4: (21.0245).toFixed(2)});
    this.setState({payout3: (58.0278).toFixed(2)});
    this.setState({payout2: (160.156).toFixed(2)});
    this.setState({payout1: (442.0327).toFixed(2)});
    this.setState({payout0: (1220.0105).toFixed(2)});

      const response0 = this.generateGame(1,3, 0,2,2);
      const response1 = this.generateGame(1,3, 0,2,2);
      const response2 = this.generateGame(1,3, 0,2,2);
      const response3 = this.generateGame(1,3, 0,2,2);
      const response4 = this.generateGame(1,3, 0,2,2);
      const response5 = this.generateGame(1,3, 0,2,2);
      const response6 = this.generateGame(1,3, 0,2,2);
      const response7 = this.generateGame(1,3, 0,2,2);
      const response8 = this.generateGame(1,3, 0,2,2);

   
      this.setState({data0:response0});
      this.setState({data1:response1});
      this.setState({data2:response2});
      this.setState({data3:response3});
      this.setState({data4:response4});
      this.setState({data5:response5});
      this.setState({data6:response6});
      this.setState({data7:response7});
      this.setState({data8:response8});     
      
      var engine = Engine; var en_balance;
      if(engine.balance === null)
      {
          en_balance = 80000;
      }
      else{
        en_balance = this.state.ethereumvalue;
      }

      if(Number(this.state.ethereumvalue === 0)){
        this.setState({valid: 'false'});
      }
      else{
        this.setState({valid: 'true'});
      }
      this.setState({ethereumvalue:this.state.ethereumvalue});
      this.setState(this.getExtremeState());
      this.setState({selectedValue: 'Extreme'});

    }
    else if(selectedValue === 'Hard'){

     var current_bet = Number(this.state.clicks); 
    
    if(current_bet === 100){ 
      this.setState({mark8: 192 });
      this.setState({mark7: 368 }); 
      this.setState({mark6: 707 });
      this.setState({mark5: 1358 });
      this.setState({mark4: 2609 });
      this.setState({mark3: 5009 });
      this.setState({mark2: 9618 });
      this.setState({mark1: 18467 });
      this.setState({mark0: 35457 });
    }
    else{
      this.setState({mark8: Math.round(current_bet * 1.92)});
      this.setState({mark7: Math.round(current_bet * 3.6864)});
      this.setState({mark6: Math.round(current_bet * 7.0778)});
      this.setState({mark5: Math.round(current_bet * 13.5895)});
      this.setState({mark4: Math.round(current_bet * 26.0919)});
      this.setState({mark3: Math.round(current_bet * 50.0964)});
      this.setState({mark2: Math.round(current_bet * 96.18527)});
      this.setState({mark1: Math.round(current_bet * 184.67573)});
      this.setState({mark0: Math.round(current_bet * 354.5774)});
    }    
    
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

      var engine = Engine; var en_balance;
      if(engine.balance === null)
      {
          en_balance = 80000;
      }
      else{
        en_balance = this.state.ethereumvalue;
      }
      if(Number(this.state.ethereumvalue === 0)){
        this.setState({valid: 'false'});
      }
      else{
        this.setState({valid: 'true'});
      }
      this.setState({ethereumvalue:this.state.ethereumvalue});
      this.setState(this.getHardState());
      this.setState({selectedValue: 'Hard'});
    }
    else if(selectedValue === 'Medium'){

     var current_bet = Number(this.state.clicks);   
    if(current_bet === 100){  
      this.setState({mark8: 145 });
      this.setState({mark7: 211 });
      this.setState({mark6: 308 });
      this.setState({mark5: 448 });
      this.setState({mark4: 652 });
      this.setState({mark3: 948 });
      this.setState({mark2: 1380 });
      this.setState({mark1: 2008 });
      this.setState({mark0: 2922 }); 
    }
    else{
      this.setState({mark8: Math.round(current_bet * 1.4550)});
      this.setState({mark7: Math.round(current_bet * 2.1170)});
      this.setState({mark6: Math.round(current_bet * 3.08027137)});
      this.setState({mark5: Math.round(current_bet * 4.48179485)});
      this.setState({mark4: Math.round(current_bet * 6.52101150)});
      this.setState({mark3: Math.round(current_bet * 9.48807174)});
      this.setState({mark2: Math.round(current_bet * 13.80514438)});
      this.setState({mark1: Math.round(current_bet * 20.08648508)});
      this.setState({mark0: Math.round(current_bet * 29.22583579)});
    }     

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

      var engine = Engine; var en_balance;
      if(engine.balance === null)
      {
          en_balance = 80000;
      }
      else{
        en_balance = this.state.ethereumvalue;
      }

      if(Number(this.state.ethereumvalue === 0)){
        this.setState({valid: 'false'});
      }
      else{
        this.setState({valid: 'true'});
      }
      this.setState({ethereumvalue:this.state.ethereumvalue});
      this.setState(this.getMediumState());
      this.setState({selectedValue: 'Medium'});   
    }
    else {
    
    var current_bet = Number(this.state.clicks);    
    if(current_bet === 100){ 
      this.setState({mark8: 129 });
      this.setState({mark7: 167 });
      this.setState({mark6: 216 });
      this.setState({mark5: 279 });
      this.setState({mark4: 361 });
      this.setState({mark3: 468 });
      this.setState({mark2: 605 });
      this.setState({mark1: 782 });
      this.setState({mark0: 1012 });
    }

    else{
      this.setState({mark8: Math.round(current_bet * 1.29333)});
      this.setState({mark7: Math.round(current_bet * 1.67271)});
      this.setState({mark6: Math.round(current_bet * 2.16337)});
      this.setState({mark5: Math.round(current_bet * 2.79796)});
      this.setState({mark4: Math.round(current_bet * 3.61869)});
      this.setState({mark3: Math.round(current_bet * 4.68018)});
      this.setState({mark2: Math.round(current_bet * 6.05303)});
      this.setState({mark1: Math.round(current_bet * 7.82859)});
      this.setState({mark0: Math.round(current_bet * 10.12498)});
    }      

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

      var engine = Engine; var en_balance;
      if(engine.balance === null)
      {
          en_balance = 80000;
      }
      else{
        en_balance = this.state.ethereumvalue;
      }

      if(Number(this.state.ethereumvalue === 0)){
        this.setState({valid: 'false'});
      }
      else{
        this.setState({valid: 'true'});
      }

      this.setState({ethereumvalue:this.state.ethereumvalue});
      this.setState(this.getInitialState1());
      this.setState({clicks:100});
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
  onlogout: function() {
    localStorage.clear();
    alert('Are you sure you want to log out?');
    ControlsActions.logout(Engine.username);
    window.location.reload(false);
    },

  restart:function(...args) { 
    this.setState({hidemark8: 'false' , hidemark7 : 'false' , hidemark6 : 'false',
       hidemark5: 'false', hidemark4: 'false', hidemark3: 'false', hidemark2: 'false' , hidemark1: 'false', hidemark0: 'false'});

    if(this.state.selectedValue === 'Nightmare'){
      if(Number(this.state.ethereumvalue) > 0 )
     {        
        this.setState({valid: 'true' });
     } 
     else{
        this.setState({valid: 'false' });
     } 

     this.setState({takestate: 'nottake'}); 
      if(this.state.takestate != 'take'){
        const response0 = this.generateGame(1,4, 0,4,3);
        const response1 = this.generateGame(1,4, 0,4,3);
        const response2 = this.generateGame(1,4, 0,4,3);
        const response3 = this.generateGame(1,4, 0,4,3);
        const response4 = this.generateGame(1,4, 0,4,3);
        const response5 = this.generateGame(1,4, 0,4,3);
        const response6 = this.generateGame(1,4, 0,4,3);      
     
        this.setState({data0:response0});
        this.setState({data1:response1});
        this.setState({data2:response2});
        this.setState({data3:response3});
        this.setState({data4:response4});
        this.setState({data5:response5});
        this.setState({data6:response6});
      } 
      else{}     

      this.setState(this.getNightmareState(...args));      
      
      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;

       if(currentclicks > Number(this.state.ethereumvalue))
      {
         this.setState({clicks: this.state.ethereumvalue });         
         this.setState({ethereumvalue: 0 });
         var newVal = Number(this.state.ethereumvalue);

         var tempVal;          
         const firstdigit = (newVal + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }

          this.setState({ tempvalue: tempVal });          
      } 
      else{
        this.setState({clicks: currentclicks});
        var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
        this.setState({ethereumvalue: eth_value });
      } 
      
      var cstep = 6;
      this.setState({currentstep: cstep});

      if(Number(this.state.ethereumvalue) === 0)
      {
         this.setState({valid: 'false'});
      } 
      else{
        this.setState({valid: 'true'});
      }

      var engine = Engine;
      if(Engine.username !=null){  
      localStorage.setItem('start_game', 'true');      
          this._startgame(eth_value); 
      } else{}          
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{      
      
      if(this.state.currentstep === 6){
          var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = evalue + bet_amount;             
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);

          if(Number(this.state.ethereumvalue === 0)){
            this.setState({valid: 'false' });
          }
          else{
            this.setState({valid: 'true' });
          }
          
        //  this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this.setState({ethereumvalue: new_value });
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
        }
        else{}    
        this._onGameCrash();      
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
          var eth_value = Number(this.state.ethereumvalue) + Number(profit_amt);
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
       var new_value = eth_value;
       if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
       } else{}   
       this._onGameCrash();      
        GameSettingsStore.addChangeListener(this._onChange);     

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      }    
 
    }
    else if(this.state.selectedValue === 'Extreme'){

      if(Number(this.state.ethereumvalue) > 0 )
     {        
        this.setState({valid: 'true' });
     } 
     else{
        this.setState({valid: 'false' });
     } 

     this.setState({takestate: 'nottake'}); 
      if(this.state.takestate != 'take'){
        const response0 = this.generateGame(1,3, 0,3,2);
        const response1 = this.generateGame(1,3, 0,3,2);
        const response2 = this.generateGame(1,3, 0,3,2);
        const response3 = this.generateGame(1,3, 0,3,2);
        const response4 = this.generateGame(1,3, 0,3,2);
        const response5 = this.generateGame(1,3, 0,3,2);
        const response6 = this.generateGame(1,3, 0,3,2);
        const response7 = this.generateGame(1,3, 0,3,2);
        const response8 = this.generateGame(1,3, 0,3,2);
     
        this.setState({data0:response0});
        this.setState({data1:response1});
        this.setState({data2:response2});
        this.setState({data3:response3});
        this.setState({data4:response4});
        this.setState({data5:response5});
        this.setState({data6:response6});
        this.setState({data7:response7});
        this.setState({data8:response8});
      } 
      else{}   

      this.setState(this.getExtremeState(...args));

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;

       if(currentclicks > Number(this.state.ethereumvalue))
      {
         this.setState({clicks: this.state.ethereumvalue });         
         this.setState({ethereumvalue: 0 });
         var newVal = Number(this.state.ethereumvalue);

         var tempVal;          
         const firstdigit = (newVal + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }

          this.setState({ tempvalue: tempVal });          
      } 
      else{
        this.setState({clicks: currentclicks});
        var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
        this.setState({ethereumvalue: eth_value });
      } 
      
      var cstep = 6;
      this.setState({currentstep: cstep});

      if(Number(this.state.ethereumvalue === 0)){            
            this.setState({valid: 'false' });
          }
          else{                     
            this.setState({valid: 'true' });
          }

      var engine = Engine;
      if(Engine.username !=null){
          localStorage.setItem('start_game', 'true');
          this._startgame(eth_value); 
      } else{}          
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{    
      if(this.state.currentstep === 6){
        var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = evalue + bet_amount;             
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);

          if(Number(this.state.ethereumvalue === 0)){
            this.setState({valid: 'false' });
          }
          else{
            this.setState({valid: 'true' });
          }
          
        //  this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this.setState({ethereumvalue: new_value }); 
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
        } else{}    
       this._onGameCrash();      
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

         
          var eth_value = Number(this.state.ethereumvalue) + Number(profit_amt);
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
       var new_value = eth_value;

       if(Engine.username !=null){
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
       } else{}           
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Hard'){

    if(Number(this.state.ethereumvalue) > 0 )
     {        
        this.setState({valid: 'true' });
     } 
     else{
        this.setState({valid: 'false' });
     }

     this.setState({takestate: 'nottake'}); 
      if(this.state.takestate != 'take'){
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
      } 
      else{}

      this.setState(this.getHardState(...args));      

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;

       if(currentclicks > Number(this.state.ethereumvalue))
      {
         this.setState({clicks: this.state.ethereumvalue });         
         this.setState({ethereumvalue: 0 });
         var newVal = Number(this.state.ethereumvalue);

         var tempVal;          
         const firstdigit = (newVal + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }

          this.setState({ tempvalue: tempVal });          
      } 
      else{
        this.setState({clicks: currentclicks});
        var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
        this.setState({ethereumvalue: eth_value });
      } 
      
      var cstep = 8;
      this.setState({currentstep: cstep});

      if(Number(this.state.ethereumvalue === 0)){            
            this.setState({valid: 'false' });
          }
          else{                     
            this.setState({valid: 'true' });
          }

      var engine = Engine;
      if(Engine.username !=null){
        localStorage.setItem('start_game', 'true');
          this._startgame(eth_value); 
      } else{}          
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{      
      
      if(this.state.currentstep === 8){
         var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = evalue + bet_amount;            
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);

          if(Number(this.state.ethereumvalue === 0)){
            this.setState({valid: 'false' });
          }
          else{
            this.setState({valid: 'true' });
          }
          
        //  this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this.setState({ethereumvalue: new_value });
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
        } else{}
            
       this._onGameCrash();      
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

         
          var eth_value = Number(this.state.ethereumvalue) + Number(profit_amt);
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
       var new_value = eth_value;
       if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
       } else{}           
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Medium'){

      if(Number(this.state.ethereumvalue) > 0 )
     {        
        this.setState({valid: 'true' });
     } 
     else{
        this.setState({valid: 'false' });
     }

     this.setState({takestate: 'nottake'}); 
      if(this.state.takestate != 'take'){
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
      } 
      else{}      

      this.setState(this.getMediumState(...args));     

      if(this.state.playbutton === 'Play' ){   
         
      this.setState({playbutton: 'End'});
      this.setState({currentstatus: 'start'});
      var currentclicks = this.state.clicks;

      if(currentclicks > Number(this.state.ethereumvalue))
      {
         this.setState({clicks: this.state.ethereumvalue });         
         this.setState({ethereumvalue: 0 });
         var newVal = Number(this.state.ethereumvalue);

         var tempVal;          
         const firstdigit = (newVal + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }

          this.setState({ tempvalue: tempVal });          
      } 
      else{
        this.setState({clicks: currentclicks});
        var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
        this.setState({ethereumvalue: eth_value });
      } 
      
      var cstep = 8;
      this.setState({currentstep: cstep});

      if(Number(this.state.ethereumvalue === 0)){            
            this.setState({valid: 'false' });
          }
          else{                     
            this.setState({valid: 'true' });
          }

      var engine = Engine;
      if(Engine.username !=null){
        localStorage.setItem('start_game', 'true');
          this._startgame(eth_value); 
      } else{}          
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{      
      
      if(this.state.currentstep === 8){
        var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = evalue + bet_amount;             
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);

          if(Number(this.state.ethereumvalue === 0)){
            this.setState({valid: 'false' });
          }
          else{
            this.setState({valid: 'true' });
          }
          
        //  this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this.setState({ethereumvalue: new_value });
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
        } else{}    
       this._onGameCrash();      
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

         
          var eth_value = Number(this.state.ethereumvalue) + Number(profit_amt);
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
       var new_value = eth_value;
       if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value);  
       } else{}        
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      this.setState({currentstatus: 'before'});
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      } 
    }
    else if(this.state.selectedValue === 'Easy'){
     if(Number(this.state.ethereumvalue) > 0 )
     {        
        this.setState({valid: 'true' });
     } 
     else{
        this.setState({valid: 'false' });
     }  

    this.setState({takestate: 'nottake'});
   
      if(this.state.takestate != 'take'){
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

        localStorage.setItem('data0', response0);
        localStorage.setItem('data1', response1);
        localStorage.setItem('data2', response2);
        localStorage.setItem('data3', response3);
        localStorage.setItem('data4', response4);
        localStorage.setItem('data5', response5);
        localStorage.setItem('data6', response6);
        localStorage.setItem('data7', response7);
        localStorage.setItem('data8', response8);  
      } 
      else{}

      this.setState(this.getInitialState1(...args));    

      if(this.state.playbutton === 'Play' || localStorage.getItem('playbutton') === 'Play'){      
       
      this.setState({playbutton: 'End'});
      localStorage.setItem('playbutton', 'End');  
      this.setState({currentstatus: 'start'});
      localStorage.setItem('currentstatus', 'start'); 
      var currentclicks = Number(this.state.clicks);      

      if(currentclicks > Number(this.state.ethereumvalue))
      {
         this.setState({clicks: this.state.ethereumvalue });         
         this.setState({ethereumvalue: 0 });
         localStorage.setItem('clicks', this.state.ethereumvalue); 
         localStorage.setItem('ethereumvalue', 0); 
         var newVal = Number(this.state.ethereumvalue);

         var tempVal;          
         const firstdigit = (newVal + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }
                 
          this.setState({ tempvalue: tempVal });          
      } 
      else{
        this.setState({clicks: currentclicks});
        localStorage.setItem('clicks', currentclicks);
        var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
        this.setState({ethereumvalue: eth_value });
        localStorage.setItem('ethereumvalue', eth_value);
      } 
      
      
      var cstep = 8;
      this.setState({currentstep: cstep});
      localStorage.setItem('currentstep', cstep);

      if(Number(this.state.ethereumvalue === 0)){            
            this.setState({valid: 'false' });
             localStorage.setItem('valid', 'false');          
          }
          else{                     
            this.setState({valid: 'true' });
            localStorage.setItem('valid', 'true');
          }

      var engine = Engine;
      if(Engine.username !=null){
        localStorage.setItem('start_game', 'true');  
          this._startgame(eth_value); 
      } else{}          
      GameSettingsStore.addChangeListener(this._onChange); 
      
    }
    else{   
        if(this.state.currentstep === 8){
          var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = evalue + bet_amount;             
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);

        //this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this.setState({ethereumvalue: new_value });
            localStorage.setItem('ethereumvalue', new_value);  
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
        } else{ 
          this.setState({ethereumvalue: new_value });
          localStorage.setItem('ethereumvalue', new_value); 
         }

       this._onGameCrash();      
        this.setState({gstatus: 'fail'}); 
        localStorage.setItem('start_game', 'false');  
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
         
          var eth_value = Number(this.state.ethereumvalue) + Number(profit_amt);
          this.setState({ethereumvalue: eth_value });
          localStorage.setItem('ethereumvalue', eth_value); 
        

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
       var new_value = eth_value;
       if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
       } else {}          
        GameSettingsStore.addChangeListener(this._onChange);

      this.setState({
        alert: getAlert()
      }); 
      }

      this.setState({gstatus: 'fail'});
      localStorage.setItem('gstatus', 'fail');
      localStorage.setItem('start_game', 'false');  
      this.setState({playbutton: 'Play'});
      localStorage.setItem('playbutton', 'Play');
      this.setState({currentstatus: 'before'});
      localStorage.setItem('currentstatus', 'before');
      var currentclicks = this.state.clicks;
      this.setState({clicks: currentclicks});
      localStorage.setItem('clicks', 'currentclicks');
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
      var eth_value = Number(this.state.ethereumvalue) - Number(currentclicks);
      this.setState({ethereumvalue: eth_value });
      var cstep = 8;
      this.setState({currentstep: cstep});
      
    }
    else{      
      
      if(this.state.currentstep === 8){
        var bet_amount = Number(this.state.clicks);
          var evalue = Number(this.state.ethereumvalue);
          var new_value = currentclicks + evalue;             
          var engine = Engine;
          var profit_amt = bet_amount;
          var pay_amt = 1.0.toFixed(4);
          
        //  this._endgame(eth_value, currentclicks);       
        // GameSettingsStore.addChangeListener(this._onChange);
        if(Engine.username !=null){
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
        } else{}    
       this._onGameCrash();      
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
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)) - Number(this.state.clicks) ;
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
       var new_value = Number(engine.balance) + Number(profit_amt);
       if(Engine.username !=null){
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
       } else{}           
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
      maxVal: 100000,
      minVal: 100,
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
      maxVal: 100000,
      minVal: 100,
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
      maxVal: 100000,
      minVal: 100,
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
      maxVal: 100000,
      minVal: 100,
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
      maxVal: 100000,
      minVal: 100,
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
    var newVal = Number(this.state.clicks); 
    var current_bet = Number(this.state.clicks);
    if(this.state.currentstatus === 'before' && current_bet != Number(this.state.ethereumvalue) && Number(this.state.ethereumvalue) > 0){   
    
    const firstdigit = (newVal + '').charAt(0); 
    //Lessthan 1000   
    if(newVal < 1000 && newVal >=100)
    {
        //alert('first');
        if(firstdigit === '5'){
            newVal = newVal * 2; 
        }
        else{
            newVal =  newVal + 100;
        }
    } 
    else if(newVal < 10000 && newVal >=1000) {
      //alert('second');
      if(firstdigit === '5'){
            newVal = newVal * 2; 
        }        
        else{
            newVal = newVal + 1000;
        }
    } 
    else{
      //alert('third');
      newVal = newVal + 5000;
    }
   
    
     
    if(this.state.selectedValue === 'Easy'){      
       if(Number(newVal) <= Number(this.state.maxVal))
       {
          this.setState({mark8: Math.round(newVal * 1.29333) });
          this.setState({mark7: Math.round(newVal * 1.67271) });
          this.setState({mark6: Math.round(newVal * 2.16337) });
          this.setState({mark5: Math.round(newVal * 2.79796) });
          this.setState({mark4: Math.round(newVal * 3.61869) });
          this.setState({mark3: Math.round(newVal * 4.68018) });
          this.setState({mark2: Math.round(newVal * 6.05303) });
          this.setState({mark1: Math.round(newVal * 7.82859) });
          this.setState({mark0: Math.round(newVal * 10.12498) });
       } 
    }
    else if(this.state.selectedValue === 'Medium'){      
       if(Number(newVal) <= Number(this.state.maxVal))
       {
          this.setState({mark8: Math.round(newVal * 1.4550) });
          this.setState({mark7: Math.round(newVal * 2.1170) });
          this.setState({mark6: Math.round(newVal * 3.08027137) });
          this.setState({mark5: Math.round(newVal * 4.48179485) });
          this.setState({mark4: Math.round(newVal * 6.52101150) });
          this.setState({mark3: Math.round(newVal * 9.48807174) });
          this.setState({mark2: Math.round(newVal * 13.80514438) });
          this.setState({mark1: Math.round(newVal * 20.08648508) });
          this.setState({mark0: Math.round(newVal * 29.22583579) });
       } 
    }   
    else if(this.state.selectedValue === 'Hard'){      
       if(Number(newVal) <= Number(this.state.maxVal))
       {
          this.setState({mark8: Math.round(newVal * 1.92) });
          this.setState({mark7: Math.round(newVal * 3.6864) });
          this.setState({mark6: Math.round(newVal * 7.0778) });
          this.setState({mark5: Math.round(newVal * 13.5895) });
          this.setState({mark4: Math.round(newVal * 26.0919) });
          this.setState({mark3: Math.round(newVal * 50.0964) });
          this.setState({mark2: Math.round(newVal * 96.18527) });
          this.setState({mark1: Math.round(newVal * 184.67573) });
          this.setState({mark0: Math.round(newVal * 354.5774) });
       } 
    }
    else if(this.state.selectedValue === 'Extreme'){      
       if(Number(newVal) <= Number(this.state.maxVal))
       {
          this.setState({mark6: Math.round(newVal * 2.76) });
          this.setState({mark5: Math.round(newVal * 7.617) });
          this.setState({mark4: Math.round(newVal * 21.0245) });
          this.setState({mark3: Math.round(newVal * 58.0278) });
          this.setState({mark2: Math.round(newVal * 160.156) });
          this.setState({mark1: Math.round(newVal * 442.0327) });
          this.setState({mark0: Math.round(newVal * 1220.0105) });          
       } 
    }  
    else {      
       if(Number(newVal) <= Number(this.state.maxVal))
       {
          this.setState({mark6: Math.round(newVal * 3.6) });
          this.setState({mark5: Math.round(newVal * 12.96) });
          this.setState({mark4: Math.round(newVal * 46.656) });
          this.setState({mark3: Math.round(newVal * 167.961) });
          this.setState({mark2: Math.round(newVal * 604.661) });
          this.setState({mark1: Math.round(newVal * 2176.782) });
          this.setState({mark0: Math.round(newVal * 7836.416) });   
       } 
    }
    
   
    if(Number(newVal) <= 100000) {  
        if(Number(newVal) > Number(this.state.ethereumvalue))
        {
          this.setState({ clicks: Number(this.state.ethereumvalue) });          
          //Lessthan 1000 
          var tempVal;          
         const firstdigit = (this.state.ethereumvalue + '').charAt(0); 
         var eth_length = newVal.toString().length;
         
          if(eth_length===3)
          {            
            tempVal = firstdigit + '00';             
          } 
          else if(eth_length===4) {
           tempVal = firstdigit + '000'; 
          } 

          else if(eth_length===5){            
            tempVal = firstdigit + '0000'; 
          }
          else{
            tempVal = firstdigit + '00000';
          }       
          this.setState({ tempvalue: tempVal });
        } 
        else{
          this.setState({ clicks: newVal });
        }        
      } 
      else{   }   
    }         
  },


  DecreaseItem:function() {
    var newVal;
    if(this.state.currentstatus === 'before' && Number(this.state.ethereumvalue) > 0){
       //Check increase userbalance or not
       //alert(this.state.tempvalue);
       if(Number(this.state.tempvalue) != 0){        
          newVal = Number(this.state.tempvalue);
          this.setState({ tempvalue: 0 });
        }
        else{          
          newVal = Number(this.state.clicks);

          const firstdigit = (newVal + '').charAt(0);
          //Lessthan 1000   
          if(newVal <= 1000 && newVal >100)
          {
            //alert('first');
              if(firstdigit === '1'){
                  newVal = newVal / 2; 
              }
              else{
                  newVal =  newVal - 100;
              }
          } 
          else if(newVal <= 10000 && newVal >1000) {
            //alert('second');
            if(firstdigit === '1'){
                  newVal = newVal / 2; 
              }       
              else{
                  newVal = newVal - 1000;
              }
          } 
          else{
            //alert('third');
            newVal = newVal - 5000;
          }
        }    
    

    var current_bet = Number(this.state.clicks); 
    if(this.state.selectedValue === 'Easy'){      
       if(Number(newVal) >= Number(this.state.minVal))
       {
          this.setState({mark8: Math.round(newVal * 1.29333) });
          this.setState({mark7: Math.floor(newVal * 1.67271) });
          this.setState({mark6: Math.floor(newVal * 2.16337) });
          this.setState({mark5: Math.floor(newVal * 2.79796) });
          this.setState({mark4: Math.floor(newVal * 3.61869) });
          this.setState({mark3: Math.floor(newVal * 4.68018) });
          this.setState({mark2: Math.floor(newVal * 6.05303) });
          this.setState({mark1: Math.floor(newVal * 7.82859) });
          this.setState({mark0: Math.floor(newVal * 10.12498) });
       } 
    }
    else if(this.state.selectedValue === 'Medium'){      
       if(Number(newVal) >= Number(this.state.minVal))
       {
          this.setState({mark8: Math.floor(newVal * 1.4550) });
          this.setState({mark7: Math.round(newVal * 2.1170) });
          this.setState({mark6: Math.round(newVal * 3.0802) });
          this.setState({mark5: Math.round(newVal * 4.4817) });
          this.setState({mark4: Math.round(newVal * 6.5210) });
          this.setState({mark3: Math.round(newVal * 9.4880) });
          this.setState({mark2: Math.round(newVal * 13.8051) });
          this.setState({mark1: Math.round(newVal * 20.0864) });
          this.setState({mark1: Math.round(newVal * 20.0864) });
          this.setState({mark0: Math.floor(newVal * 29.2258) });
       } 
    }   
    else if(this.state.selectedValue === 'Hard'){      
       if(Number(newVal) >= Number(this.state.minVal))
       {
          this.setState({mark8: Math.floor(newVal * 1.92) });
          this.setState({mark7: Math.floor(newVal * 3.6864) });
          this.setState({mark6: Math.floor(newVal * 7.0778) });
          this.setState({mark5: Math.floor(newVal * 13.5895) });
          this.setState({mark4: Math.floor(newVal * 26.0919) });
          this.setState({mark3: Math.floor(newVal * 50.0964) });
          this.setState({mark2: Math.floor(newVal * 96.18527) });
          this.setState({mark1: Math.floor(newVal * 184.67573) });
          this.setState({mark0: Math.floor(newVal * 354.5774) });
       } 
    }
    else if(this.state.selectedValue === 'Extreme'){      
       if(Number(newVal) >= Number(this.state.minVal))
       {
          this.setState({mark6: Math.floor(newVal * 2.76) });
          this.setState({mark5: Math.floor(newVal * 7.617) });
          this.setState({mark4: Math.floor(newVal * 21.0245) });
          this.setState({mark3: Math.floor(newVal * 58.0278) });
          this.setState({mark2: Math.floor(newVal * 160.156) });
          this.setState({mark1: Math.floor(newVal * 442.0327) });
          this.setState({mark0: Math.floor(newVal * 1220.0105) });          
       } 
    }  
    else {      
       if(Number(newVal) >= Number(this.state.minVal))
       {
          this.setState({mark6: Math.floor(newVal * 3.6) });
          this.setState({mark5: Math.floor(newVal * 12.96) });
          this.setState({mark4: Math.floor(newVal * 46.656) });
          this.setState({mark3: Math.floor(newVal * 167.961) });
          this.setState({mark2: Math.floor(newVal * 604.661) });
          this.setState({mark1: Math.floor(newVal * 2176.782) });
          this.setState({mark0: Math.floor(newVal * 7836.416) });   
       } 
    }
   
    
    if (Number(newVal) >= Number(this.state.minVal)) {   
        this.setState({ clicks: newVal });
      }
    }
    else{  }    
     
  },

  handleClick:function(row, column, data, rowi) { 
    this.state.cc = column;
    if(rowi === 0){      
      
      let game = this.state.game0.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data0;    

      this.setState({gameStarted: true, solution: solution}); 
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true', hidemark5: 'true',
      hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});
       localStorage.setItem('hidemark8', 'true');
       localStorage.setItem('hidemark7', 'true');
       localStorage.setItem('hidemark6', 'true');
       localStorage.setItem('hidemark5', 'true');
       localStorage.setItem('hidemark4', 'true');
       localStorage.setItem('hidemark3', 'true');
       localStorage.setItem('hidemark2', 'true');
       localStorage.setItem('hidemark1', 'true');
       localStorage.setItem('hidemark0', 'true');

     var pay_amt = this.state.payout0;
     var profit_amt = this.state.mark0;      
      
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

       var engine = Engine;
       var bet_amount = this.state.clicks;
       var new_value = eth_value;
       if(Engine.username !=null){
            this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
        } else{}     
       this._onGameCrash();      
        GameSettingsStore.addChangeListener(this._onChange);  

      this.setState({gameFinished: true });
      localStorage.setItem('gameFinished', true);
      var markvalue = 'Take ' + this.state.mark0;
      this.setState({playbutton: 'Play' });
      localStorage.setItem('playbutton', 'Play');
      var eth_value = Number(this.state.ethereumvalue) + Number(this.state.mark0);
      
      this.setState({ethereumvalue:  eth_value });
      localStorage.setItem('ethereumvalue', 'eth_value');
      let minesLeft = this.state.minesLeft;     
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);     
      
      this.state.currentstep = this.state.currentstep - 1;
     
      this.updateGameStatus(game, solution, row, column, '0');
      this.setState({changed: true});
      this.setState({gstatus: 'success'});     
      this.setState({ takestate: 'nottake' });
      this.setState({gameFinished: true});
      localStorage.setItem('changed', true);
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'nottake');
      localStorage.setItem('gameFinished', true);
    }

    else{
      //Fail State
      this.updateGameStatus(game, solution, row, column, '0');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false');  
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});  
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }

      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
     
      if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}    
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
      }
    }
    else if(rowi === 1){      
      //alert('1');
      let game = this.state.game1.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data1;
     

      this.setState({gameStarted: true, solution: solution});
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');      
      
     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true'});
       localStorage.setItem('hidemark8', 'true');
       localStorage.setItem('hidemark7', 'true');
       localStorage.setItem('hidemark6', 'true');
       localStorage.setItem('hidemark5', 'true');
       localStorage.setItem('hidemark4', 'true');
       localStorage.setItem('hidemark3', 'true');
       localStorage.setItem('hidemark2', 'true');
       localStorage.setItem('hidemark1', 'true');

      var markvalue = 'Take ' + this.state.mark1;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue);

      let minesLeft = this.state.minesLeft;    
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '1');
      this.setState({changed: true});
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('changed', true);
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
      //Fail State
      this.updateGameStatus(game, solution, row, column, '1');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false');
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});  
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
     
      if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}     
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    }
    else if(rowi === 2){
      //alert(rowi);
      let game = this.state.game2.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data2;
     

      this.setState({gameStarted: true, solution: solution});
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution'); 
         

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' });
       localStorage.setItem('hidemark8', 'true');
       localStorage.setItem('hidemark7', 'true');
       localStorage.setItem('hidemark6', 'true');
       localStorage.setItem('hidemark5', 'true');
       localStorage.setItem('hidemark4', 'true');
       localStorage.setItem('hidemark3', 'true');
       localStorage.setItem('hidemark2', 'true');

      var markvalue = 'Take ' + this.state.mark2;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '2');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '2');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false');
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});   
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
       
      if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
      } else{}      
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    } 

    else if(rowi === 3){
      //alert(rowi);
      let game = this.state.game3.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data3;
     

      this.setState({gameStarted: true, solution: solution});
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true' });
       localStorage.setItem('hidemark8', 'true');
       localStorage.setItem('hidemark7', 'true');
       localStorage.setItem('hidemark6', 'true');
       localStorage.setItem('hidemark5', 'true');
       localStorage.setItem('hidemark4', 'true');
       localStorage.setItem('hidemark3', 'true');

      var markvalue = 'Take ' + this.state.mark3;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue);

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);      
     
      this.updateGameStatus(game, solution, row, column, '3');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '3');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false');  
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'}); 
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              });      
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
       
      if(Engine.username !=null){ 
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
      } else{}      
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    }  

    else if(rowi === 4){
      //alert(rowi);
      let game = this.state.game4.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data4;    

      this.setState({gameStarted: true, solution: solution});
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true', hidemark5: 'true', hidemark4: 'true' });
      localStorage.setItem('hidemark8', 'true');
      localStorage.setItem('hidemark7', 'true');
      localStorage.setItem('hidemark6', 'true');
      localStorage.setItem('hidemark5', 'true');
      localStorage.setItem('hidemark4', 'true');

      var markvalue = 'Take ' + this.state.mark4;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue);

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      

      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '4');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '4');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false'); 
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});  
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
      
      if(Engine.username !=null){ 
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}    
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    }
    else if(rowi === 5){
      //alert(rowi);
      let game = this.state.game5.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data5;
     

      this.setState({gameStarted: true, solution: solution});
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');     

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true', hidemark5: 'true' });
      localStorage.setItem('hidemark8', 'true'); 
      localStorage.setItem('hidemark7', 'true'); 
      localStorage.setItem('hidemark6', 'true'); 
      localStorage.setItem('hidemark5', 'true'); 

      var markvalue = 'Take ' + this.state.mark5;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue); 

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '5');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);
    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '5');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false'); 
       this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});  
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
      
      if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}     
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    }
    else if(rowi === 6){
      //alert(rowi);
      let game = this.state.game6.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data6;     

      this.setState({gameStarted: true, solution: solution});    
      localStorage.setItem('gameStarted', true); 
      localStorage.setItem('solution', solution);  

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true' });
      localStorage.setItem('hidemark8', 'true');
      localStorage.setItem('hidemark7', 'true');
      localStorage.setItem('hidemark6', 'true'); 

      var markvalue = 'Take ' + this.state.mark6;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue);

      let minesLeft = this.state.minesLeft;      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);     
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '6');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '6');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false'); 
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});   
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }
      
      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
      
      if(Engine.username !=null){
        this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}  
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
    }
    }
    else if(rowi === 7){
      let game = this.state.game7.slice();
      let value = game[row][column];

      let solution;    
      solution = this.state.data7;  
      this.setState({gameStarted: true, solution: solution});  
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');   

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
       //For fruit popup
      this.setState({hidemark8: 'true' , hidemark7 : 'true' });
      localStorage.setItem('hidemark8', 'true');
      localStorage.setItem('hidemark7', 'true');
      
      var markvalue = 'Take ' + this.state.mark7;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue); 

      let minesLeft = this.state.minesLeft;
      
     
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '7');
      this.setState({gstatus: 'success'});
      this.setState({ takestate: 'take' });
      localStorage.setItem('gstatus', 'success');
      localStorage.setItem('takestate', 'take');
      //alert(game);

    }

    else{
       //Fail State
      this.updateGameStatus(game, solution, row, column, '7');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false'); 
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});   
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }

      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);;
      
      if(Engine.username !=null){
        this._placeBet(bet_amount, pay_amt,profit_amt,new_value); 
      } else{}   
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
      
    }

    }
    else if(rowi === 8){ 
     let game = this.state.game8.slice();
      let value = game[row][column];     

      let solution;    
      solution = this.state.data8;
      
      this.setState({gameStarted: true, solution: solution}); 
      localStorage.setItem('gameStarted', true);
      localStorage.setItem('solution', 'solution');
      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      //For fruit popup
      this.setState({hidemark8: 'true' });
      localStorage.setItem('hidemark8', 'true');

      var markvalue = 'Take ' + this.state.mark8;
      this.setState({playbutton: markvalue });
      localStorage.setItem('playbutton', markvalue);

      let minesLeft = this.state.minesLeft;
      minesLeft = 0;
      this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
      //Add New Game Row
      this.state.currentstep = this.state.currentstep - 1;
      var nextstep  = localStorage.getItem('currentstep') - 1;
      localStorage.setItem('currentstep', nextstep);
     
      this.updateGameStatus(game, solution, row, column, '8');
      this.setState({gstatus: 'success'});
      localStorage.setItem('gstatus', 'success');
      this.setState({ takestate: 'take' });
      localStorage.setItem('takestate', 'take');
      
      
      //alert(game);

    }

    else{      
      //Fail State
      this.updateGameStatus(game, solution, row, column, '8');
      this.setState({gstatus: 'fail'});
      this.setState({currentstatus: 'before'});
      this.setState({takestate: 'nottake'});
      localStorage.setItem('start_game', 'false');
      this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
       hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});    
      this.setState({playbutton: 'Play'});

      if(Number(this.state.ethereumvalue) === 0){
        this.setState({valid: 'false'});
        if(Engine.username != null){
              const getAlert = function(){
                return D.div( {  },
                        MemberAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                member: getAlert()
              }); 
            }
            else{              
              const getAlert = function(){
                return D.div( {  },
                        DemoAlert({
                                  success :true,
                                  cname: 'overlay2'

                }));
               };

              this.setState({
                demo: getAlert()
              }); 
            }
      }

      var bet_amount = this.state.clicks;
      var profit_amt = 0;
      var pay_amt = 0.0.toFixed(4);
      var engine = Engine;
      var new_value = Number(this.state.ethereumvalue);
       
      if(Engine.username !=null){
          this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
      } else{  }      
      this._onGameCrash();      
      GameSettingsStore.addChangeListener(this._onChange);
      
    }
    }

    else{
      this.setState({gstatus: 'fail'});
      this.setState({playbutton: 'Play'});
      //this.updateGameStatus(game, solution, row, column, '2');
     
      }



    //   let game = this.state.game8.slice();
    //   let value = game[row][column];     

    //   let solution;    
    //   solution = this.state.data8;
      
    //   this.setState({gameStarted: true, solution: solution}); 
      

    //  var ss = this.reveal(game, solution, row, column);
 
    //  if(ss==='success'){
    //   //For fruit popup
    //   this.setState({hidemark8: 'true' });

    //   var markvalue = 'Take ' + this.state.mark8;
    //   this.setState({playbutton: markvalue });

    //   let minesLeft = this.state.minesLeft;
      
     
    //   minesLeft = 0;
    //   this.vibrate([300, 40, 300, 40, 300, 40, 300]);
      
    //   //Add New Game Row
    //   this.state.currentstep = this.state.currentstep - 1;
     
    //   this.updateGameStatus(game, solution, row, column, '8');
    //   this.setState({gstatus: 'success'});
    //   this.setState({ takestate: 'take' });
    //   //alert(game);

    // }

    // else{      
    //   //Fail State
    //   this.updateGameStatus(game, solution, row, column, '8');
    //   this.setState({gstatus: 'fail'});
    //   this.setState({currentstatus: 'before'});
    //   this.setState({takestate: 'nottake'});
    //   localStorage.setItem('start_game', 'false');
    //   this.setState({hidemark8: 'true' , hidemark7 : 'true' , hidemark6 : 'true',
    //    hidemark5: 'true', hidemark4: 'true', hidemark3: 'true', hidemark2: 'true' , hidemark1: 'true', hidemark0: 'true'});    
    //   this.setState({playbutton: 'Play'});

    //   if(Number(this.state.ethereumvalue) === 0){
    //     this.setState({valid: 'false'});
    //     if(Engine.username != null){
    //           const getAlert = function(){
    //             return D.div( {  },
    //                     MemberAlert({
    //                               success :true,
    //                               cname: 'overlay2'

    //             }));
    //            };

    //           this.setState({
    //             member: getAlert()
    //           }); 
    //         }
    //         else{              
    //           const getAlert = function(){
    //             return D.div( {  },
    //                     DemoAlert({
    //                               success :true,
    //                               cname: 'overlay2'

    //             }));
    //            };

    //           this.setState({
    //             demo: getAlert()
    //           }); 
    //         }
    //   }

    //   var bet_amount = this.state.clicks;
    //   var profit_amt = 0;
    //   var pay_amt = 0.0.toFixed(4);
    //   var engine = Engine;
    //   var new_value = Number(this.state.ethereumvalue);
       
    //   if(Engine.username !=null){
    //       this._placeBet(bet_amount, pay_amt,profit_amt,new_value);
    //   } else{  }      
    //   this._onGameCrash();      
    //   GameSettingsStore.addChangeListener(this._onChange);
      
    // }
    // }

    // else{
    //   this.setState({gstatus: 'fail'});
    //   this.setState({playbutton: 'Play'});
    //   //this.updateGameStatus(game, solution, row, column, '2');
     
    //   }
   
  },

        render: function () {  
        console.log(this.state.loading); 
          if(this.state.loading === 'true') {
              return  D.div({ }, Loading({ })                            
                        );
            }

            else{
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
                     
                      if(localStorage.getItem('currentstep') == 0)
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
                   
                      if(localStorage.getItem('currentstep') == 1)
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
                   
                      if(localStorage.getItem('currentstep') == 2 )
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
                   
                      if(localStorage.getItem('currentstep') == 3)
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
                   
                      if(localStorage.getItem('currentstep') == 4)
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
                   
                      if(localStorage.getItem('currentstep') == 5)
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
                     
                        if(localStorage.getItem('currentstep') == 6)
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
                       
                        if(localStorage.getItem('currentstep') == 7)
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
                       
                        if(localStorage.getItem('currentstep') == 8 )
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
                            hidemark8: localStorage.getItem('hidemark8'),
                            hidemark7: this.state.hidemark7,
                            hidemark6: this.state.hidemark6,
                            hidemark5: this.state.hidemark5,
                            hidemark4: this.state.hidemark4,
                            hidemark3: this.state.hidemark3,
                            hidemark2: this.state.hidemark2,
                            hidemark1: this.state.hidemark1,
                            hidemark0: this.state.hidemark0,
                            game0:this.state.game0,
                            game1:this.state.game1,
                            game2:this.state.game2,
                            game3:this.state.game3,
                            game4:this.state.game4,
                            game5:this.state.game5,
                            game6:this.state.game6,
                            game7:this.state.game7,
                            game8:this.state.game8,                            
                            data0:localStorage.getItem('data0'),
                            data1:localStorage.getItem('data1'),
                            data2:localStorage.getItem('data2'),
                            data3:localStorage.getItem('data3'),
                            data4:localStorage.getItem('data4'),
                            data5:localStorage.getItem('data5'),
                            data6:localStorage.getItem('data6'),
                            data7:localStorage.getItem('data7'),
                            data8:localStorage.getItem('data8'),
                            mark0:this.state.mark0,
                            mark1:this.state.mark1,
                            mark2:this.state.mark2,
                            mark3:this.state.mark3,
                            mark4:this.state.mark4,
                            mark5:this.state.mark5,
                            mark6:this.state.mark6,
                            mark7:this.state.mark7,
                            mark8:this.state.mark8,                          
                            state:localStorage.getItem('currentstep'),
                            currentstatus:localStorage.getItem('currentstatus'),
                            width:this.state.width,
                            clevel:this.state.selectedValue,
                            alldata:this.state.alldata,
                            gstatus:localStorage.getItem('gstatus'),
                            isMobileOrSmall: this.state.isMobileOrSmall,
                            controlsSize: this.state.controlsSize
                    })
                ),                  
            )
        }


            // console.log('ccccc', Engine.username);
            // if (!this.state.isConnected)
            //     return D.div({ id: 'loading-container' },
            //         D.div({ className: 'loading-image' },
            //             D.span({ className: 'bubble-1' }),
            //             D.span({ className: 'bubble-2' }),
            //             D.span({ className: 'bubble-3' })
            //         )
            //     );

            var messageContainer; var loginpanel = []; var playbutton = [];
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

            if(Engine.username !=null){ 
            console.log('user');
              this.state.newethereumvalue = Number(Engine.balance);
              var eth_amount;
              if(Number(this.state.ethereumvalue) === 80000)
              {
                 eth_amount = this.state.newethereumvalue;
                 this.state.ethereumvalue = eth_amount;
              }
              else{                
                eth_amount = this.state.ethereumvalue;
              }
              console.log(eth_amount);
                    loginpanel.push(D.div({ id: 'game-upper-container',className:'header col-md-12'},
                        //Game
                        D.div({className:'col-md-2 col-sm-12 col-xs-12 logo-area'},                          
                            D.img({ src: 'img/wow-logo.png' ,href:'https://wowgo.io/', className: 'img-responsive logo-img'}  ),
                            D.img({ src: 'img/wow.png' ,href:'https://wowgo.io/', className: 'img-responsive logo-txt'}  ),
                        ),
                        D.div({ className:'col-md-4 col-sm-12 col-xs-12 getresult'},
                               
                                D.div({ id: 'chart-controls-col', className: this.state.controlsSize ,className:'balance'},
                                  D.div({className:'lgmyresult'},
                                     /* D.img({src:'img/coin.png',className:'coin'}),*/

                                    /* D.button({className:'demo-txt',id:'b01'},
                                      ),*/
                                      D.h3({  id: 'ethvalue', className: '' },
                                       this.state.ethereumvalue,
                                       ),
                                    ),                                

                              ),
                            ),
                        D.div({className:'col-md-2 col-md-pull-1 headertop-btn'},
                          D.div({className:'right'},
                           D.div( { className : ''},
                           D.div({ className: 'login-upper glow-on-hover2'},
                              D.a({ href: '/account' },                          
                                D.div({ className: 'uname' },
                                Engine.username ),
                              ),  
                              D.div({ className: 'burger-btn uname' },
                                D.a({ href: '/account' },
                                   D.i({ className:'fa fa-bars' } ),
                                ),    
                              ),
                          )  
                      )), ),
              ),) ;
                  }                  
                      
                  else{                   

                     loginpanel.push(D.div({ id: 'game-upper-container', className: containerClass ,className:'header col-md-12'},
                      //Game

                      D.div({className:'col-md-2 col-sm-12 col-xs-12 logo-area'},                          
                            D.img({ src: 'img/wow-logo.png' ,href:'https://wowgo.io/', className: 'img-responsive logo-img'}  ),
                            D.img({ src: 'img/wow.png'  ,href:'https://wowgo.io/', className: 'img-responsive logo-txt'}  ),
                        ),
                      D.div({ className:'col-md-4 col-sm-12 col-xs-12 getresult' },
                             
                            D.div({ id: 'chart-controls-col', className: this.state.controlsSize ,className:'balance'},
                                  D.div({className:'myresult'},
                                     /* D.img({src:'img/coin.png',className:'coin'}),*/
                                     D.button({className:'demo-txt',id:'b01'},'DEMO'                                  
                                      ),

                                      D.h3(                                    
                                          {  id: 'ethvalue', className: '' },
                                              //'Ξ' + eth_amount,
                                              this.state.ethereumvalue ,

                                           ),
                                    ),                                  
                              ),
                          ),
                        D.div({className:'col-md-2 col-md-pull-1 headertop-btn'},
                            D.div({className:'right'},
                        D.div( { className : 'btn'},
                              D.div({ className: 'user-login'},
                                  D.div({ className: 'register' },
                                      D.a({ href: '/register' ,className:'glow-on-hover'}, 'Register' )
                                  ),
                                  D.div({ className: 'login' },
                                      D.a({ href: '/login',className:'glow-on-hover'}, 'Log in' )
                                  ),
                              )  
                      )), ),
              ),);
          }

          //Play Button
          if("playbutton" in localStorage){          

                    playbutton.push(D.div({ id: 'game-upper-container', className: containerClass ,className:'header col-md-12'},
                     
                     D.div({ onClick:() => this.restart(this.state.height, this.state.width, this.state.maximumMines) , className: (this.state.valid === 'true' ? 'sc-cIShpX play' : 'sc-cIShpX play disabled' ) },
                       D.span({  },                          
                        localStorage.getItem('playbutton'),
                        ),
                     ), ), );
                  }                  
                      
                  else{                   

                     playbutton.push(D.div({ id: 'game-upper-container', className: containerClass ,className:'header col-md-12'},
                      //Game

                     D.div({ onClick:() => this.restart(this.state.height, this.state.width, this.state.maximumMines) , className: (this.state.valid === 'true' ? 'sc-cIShpX play' : 'sc-cIShpX play disabled' ) },
                       D.span({  },                          
                        this.state.playbutton,
                        ),
                     ), ), );
          }
          //Play Button End

            var rightContainer = D.div({ id: 'game-right-container' ,className:'col-md-5 col-sm-12 col-xs-12 large_top_padding' },

                    Players()
                );

            return D.div({ id: 'game-inner-container' },

                TopBar({
                    isMobileOrSmall: this.state.isMobileOrSmall
                }),

                  loginpanel,  

                    D.div({ id: 'game-left-container', className: this.state.isMobileOrSmall ? ' small-window' : '' ,className:'col-md-12 col-xs-12 col-sm-12'},
                        D.div({ id: 'chart-controls-row',className:'offset-md-2 col-md-4 col-xs-12 col-sm-12 large_top_padding gamearea' },
                          D.div({className:'gamebox'},
                            D.span({className:'bxspan'},),
                            D.span({className:'bxspan'},),
                            D.span({className:'bxspan'},),
                            D.span({className:'bxspan'},),
                            D.div({ id: 'chart-controls-col', className: this.state.controlsSize ,className:''},
                                                             
                                D.div({  id: 'boo'},

                                     //this.state.data0 + '|' + this.state.data1 + '|' + this.state.data2 + '|' + this.state.data3 + '|' + this.state.data4 + '|' + this.state.data5 + '|' + this.state.data6
                                     //+ '|' + this.state.data7 + '|' + this.state.data8,


                                BoardItems,                                
                                 ),
                                D.div({className:''  },                                 

                                     //this.state.data0 + '|' + this.state.data1 + '|' + this.state.data2 + '|' + this.state.data3 + '|' + this.state.data4 + '|' + this.state.data5 + '|' + this.state.data6
                                 this.state.alert                            
                                 ),
                               
                                D.div({className:''  }, this.state.demo  ),
                                D.div({className:''  }, this.state.member  ),
                               

                                playbutton,



                                D.div({  id: 'ethvalue', className: 'selectvalue' },
                                   DynamicSelect({
                                      arrayOfData: arrayOfData,
                                      onSelectChange: this.handleSelectChange ,
                                      selectedValue: this.state.selectedValue ,                                      
                                      currentstatus: this.state.currentstatus ,
                                      clicks: this.state.clicks,
                                      playstatus: this.state.playbutton,
                                  })
                                 ),

                               D.div({  className: 'sc-cIShpX eJBueb' },
                                    D.span({ className: 'moreforminus', onClick:() => this.DecreaseItem() },
                                    D.i({ className:'fa fa-minus minus' }),
                                  ),
                                   D.span({ className: 'more',  onClick:() => this.IncrementItem() },
                                    D.i({ className:'fa fa-plus plus'}),
                                  ),
                                 
                                  D.input({  className:'input', spellCheck:'false', type:'text', tabIndex:'-1', value:this.state.clicks, onChange:this.handleChange.bind(this) },
                                  ),  

                                   D.div({  className: 'amount-label' }, 'Bet amount' ),                                  
                                 
                                ),
                            ),
                          ),
                        ),
                        rightContainer
                    ),

                D.div({className:'w3l-banner-grids'},
                    D.div({className:'col-md-12 slider'},
                    D.div({className:'offset-md-2 col-md-4'},

                      D.div({ id: '' ,className:''},
                             
                          ),
                      ),
                   
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
            );
                }            
            }
             //End If else check  
    });

});

