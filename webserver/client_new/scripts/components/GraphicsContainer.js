define([
    'react',
    'lodash',
    'game-logic/clib',
    'components/GraphicDisplay',
    'components/TextDisplay',
    'game-logic/engine',
    'stores/ChartStore',
    'stores/GameSettingsStore',    
    'components/Game_new',
    // 'components/DynamicSelect'
], function(
    React,
    _,
    Clib,
    GraphicDisplayClass,
    TextDisplayClass,
    Engine,
    ChartStore,
    GameSettingsStore,    
    Game_newClass
    // Square,
    // DynamicSelect
){

    var D = React.DOM;

    var GraphicDisplay = new GraphicDisplayClass();
    var TextDisplay = React.createFactory(TextDisplayClass);    
    var Game_new = React.createFactory(Game_newClass);

    function getState(){
        return _.merge({}, ChartStore.getState(), GameSettingsStore.getState());
    }

    return React.createClass({
        displayName: 'Chart',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            controlsSize: React.PropTypes.string.isRequired
        },

        getInitialState: function () {
            var state = getState();
            state.nyan = false;
            return state;
        },

        getThisElementNode: function() {
            //return this.getDOMNode();
        },

        componentDidMount: function() {

            // Engine.on({
            //     game_started: this._onChange,
            //     game_crash: this._onChange,
            //     game_starting: this._onChange,
            //     lag_change: this._onChange,
            //     nyan_cat_animation: this._onNyanAnim
            // });
            //GameSettingsStore.addChangeListener(this._onChange);

            // if(this.state.graphMode === 'graphics')
            //     GraphicDisplay.startRendering(this.refs.canvas.getDOMNode(), this.getThisElementNode);

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



            //Marking  

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

            this.setState({currentstatus: 'before'});
            this.setState({playbutton: 'Play'});
            this.setState({clicks:0.00100000.toFixed(8)});

            var alldata = response0 +','+ response1 +','+ response2 ;    

            this.setState({alldata:alldata});   
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

        componentWillUnmount: function() {
            Engine.off({
                game_started: this._onChange,
                game_crash: this._onChange,
                game_starting: this._onChange,
                lag_change: this._onChange,
                nyan_cat_animation: this._onNyanAnim
            });
            // GameSettingsStore.removeChangeListener(this._onChange);

            // if(this.state.graphMode === 'graphics')
            //     GraphicDisplay.stopRendering();
        },

        _onChange: function() {
            if(this.state.nyan === true && Engine.gameState !== 'IN_PROGRESS')
                this.setState({ nyan: false });

            var state = getState();

            // if(this.state.graphMode !== state.graphMode) {
            //     if(this.state.graphMode === 'text')
            //         GraphicDisplay.startRendering(this.refs.canvas.getDOMNode(), this.getThisElementNode);
            //     else
            //         GraphicDisplay.stopRendering();
            // }

            if(this.isMounted())
                this.setState(state);
        },

        componentDidUpdate: function(prevProps, prevState) {
            //Detect changes on the controls size to trigger a window resize to resize the canvas of the graphics display
              if(this.state.graphMode === 'graphics' &&  this.state.controlsSize !== prevState.controlsSize)
                    GraphicDisplay.onWindowResize();
        },

        _onNyanAnim: function() {
            this.setState({ nyan: true });
        },

        render: function() {
            var textDisplay = (this.state.graphMode === 'text')?
                TextDisplay() :
                null;

                var self = this;

                var rows = Engine.tableHistory.slice(0, 6).map(function (game, i) {
                    var className;
                    if (game.game_crash >= 198)
                        className = 'games-log-goodcrash';
                    else if (game.game_crash <= 196)
                        className = 'games-log-badcrash';
                    else
                        className = '';
                    return D.span({className: className+' history_span'},Clib.formatSatoshis(game.game_crash)+'x');
                });

            return D.div({ id: 'test', className: this.props.controlsSize, ref: 'container' },
                D.div({ className: 'anim-cont' },
                    D.div({ className: 'nyan' + (this.state.nyan? ' show' : '') },
                        //this.state.nyan? D.img({ src: 'img/nyan.gif' }) : null
                    )
                ),
                D.div({ className: 'max-profit' },
                    'Max profit: ', (Engine.maxWin/1e8).toFixed(4), ' ETH'
                ),

                D.div({ className: 'history' },
                    rows
                ),

                D.div({ className: 'winner green-winner' },
                'You are winner' 
                ),
                
                // D.canvas({ ref: 'canvas', className: ((this.state.graphMode === 'text')? 'hide': '') }),
                // textDisplay,

                D.div({ id: 'game_new' },
                 Game_new({
                        isMobileOrSmall: this.props.isMobileOrSmall,
                        controlsSize: this.props.controlsSize
                    })
                ),
            )
        }
    });
});