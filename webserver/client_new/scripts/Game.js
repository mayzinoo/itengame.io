import React, {Component , Fragment} from 'react';
import './Game.css';

import DynamicSelect from './DynamicSelect';
import Board from './Board';
import Square from './Square';
import Status from './Status';
import Popup from './Popup';
import { useAlert, transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import SweetAlert from 'react-bootstrap-sweetalert';
import DifficultyLevel from './DifficultyLevel';

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

const options = {
  // you can also just use 'bottom center'
  position: positions.middle,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}


class Game extends Component {

  componentDidMount(){

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


    const alldata = response0 +','+ response1 +','+ response2 ;    

    this.setState({alldata:alldata});    

    var names = 'Harry,John,Clark,Peter,Rohn,Alice';
    var nameArr = names.split(',');
    
 
  }
  

  static randomInRange(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  static isMine(squares, row, column) {
    return squares[row][column] === 'M';
  }

  static generateArray(height, width, value) {
    return Array.from(
      {length: height},
      () => Array.from({length: width}, () => value)
    )
  }

  static vibrate(pattern) {
    return navigator.vibrate(pattern);
  }

  static getSolution(game, solution, symbol) {
   
      return game.map(
      (row, rowKey) => row.map(
        (square, squareKey) =>
          Game.isMine(solution, rowKey, squareKey) ? symbol : solution[rowKey][squareKey]
      )
    );
   

  }

  static thereAreRemainingMoves(squares, maximumMines) {
    return squares.flat().filter(
      sq => (sq === null || sq === 'F')
    ).length > maximumMines;
  }

  static leftPad(number) {
    if (number < 0) {
      return '-' + Math.abs(number).toString().padStart(2, '0');
    }

    return number.toString().padStart(3, '0');
  }

  constructor(props) {
    super(props);  
    //this.superhero = React.createRef();
    this.state = this.getInitialState();
    this.state1 = false;
    this.handler = this.handler.bind(this);

    this.state.alert = null ;
    //this.state.selectedValue = 'Easy';
    
  }

  handleSelectChange (selectedValue)
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

      this.setState(this.getInitialState());
      this.setState({clicks:0.00100000.toFixed(8)});
      this.setState({selectedValue: 'Easy'});      
    } 

    var bets = this.state.clicks;    
    this.setState({clicks: bets}); 
  }
  

  handler() {
        this.setState({
            game:"'''"
        });
    }
 
  onClick(e,row,column) {
    this.state.state1 = true;
  }     


  restart(...args) {      

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
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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
        
        
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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
        
    
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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
        
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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

      this.setState(this.getInitialState(...args));      

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

         
          var eth_value = (Number(this.state.ethereumvalue) + Number(profit_amt)).toFixed(8);
          this.setState({ethereumvalue: eth_value });
        
       
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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

      this.setState(this.getInitialState(...args));     

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
       const getAlert = () => (
        <SweetAlert 
          success 
          title={pay_amt}
          onConfirm={() => this.hideAlert()}
        >
          {profit_amt}
        </SweetAlert>
      );

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
   
  }

  getExtremeState(height = 1, width = 3, maximumMines = 1) {  
      return {
      height: height,
      width: 3,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, 3, null),
      game0:Game.generateArray(height, 3, null),
      game1:Game.generateArray(height, 3, null),
      game2:Game.generateArray(height, 3, null),
      game3:Game.generateArray(height, 3, null),
      game4:Game.generateArray(height, 3, null),
      game5:Game.generateArray(height, 3, null),
      game6:Game.generateArray(height, 3, null),
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
      ethereumvalue:100.0.toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Extreme',
    };   
  }

  getNightmareState(height = 1, width = 4, maximumMines = 1) {  
      return {
      height: height,
      width: 4,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, 4, null),
      game0:Game.generateArray(height, 4, null),
      game1:Game.generateArray(height, 4, null),
      game2:Game.generateArray(height, 4, null),
      game3:Game.generateArray(height, 4, null),
      game4:Game.generateArray(height, 4, null),
      game5:Game.generateArray(height, 4, null),
      game6:Game.generateArray(height, 4, null),
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
      ethereumvalue:100.0.toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Nightmare',
    };   
  }

  getHardState(height = 1, width = 2, maximumMines = 1) {  
      return {
      height: height,
      width: 2,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, 2, null),
      game0:Game.generateArray(height, 2, null),
      game1:Game.generateArray(height, 2, null),
      game2:Game.generateArray(height, 2, null),
      game3:Game.generateArray(height, 2, null),
      game4:Game.generateArray(height, 2, null),
      game5:Game.generateArray(height, 2, null),
      game6:Game.generateArray(height, 2, null),
      game7:Game.generateArray(height, 2, null),
      game8:Game.generateArray(height, 2, null),
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
      ethereumvalue:100.0.toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Hard',
    };   
  }

  getMediumState(height = 1, width = 3, maximumMines = 1) {  
      return {
      height: height,
      width: 3,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, 3, null),
      game0:Game.generateArray(height, 3, null),
      game1:Game.generateArray(height, 3, null),
      game2:Game.generateArray(height, 3, null),
      game3:Game.generateArray(height, 3, null),
      game4:Game.generateArray(height, 3, null),
      game5:Game.generateArray(height, 3, null),
      game6:Game.generateArray(height, 3, null),
      game7:Game.generateArray(height, 3, null),
      game8:Game.generateArray(height, 3, null),
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
      ethereumvalue:100.0.toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue:'Medium',
    };
   
  }

  getInitialState(height = 1, width = 4, maximumMines = 1) {
      return {
      height: height,
      width: 4,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, 4, null),
      game0:Game.generateArray(height, 4, null),
      game1:Game.generateArray(height, 4, null),
      game2:Game.generateArray(height, 4, null),
      game3:Game.generateArray(height, 4, null),
      game4:Game.generateArray(height, 4, null),
      game5:Game.generateArray(height, 4, null),
      game6:Game.generateArray(height, 4, null),
      game7:Game.generateArray(height, 4, null),
      game8:Game.generateArray(height, 4, null),
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
      ethereumvalue:100.0.toFixed(8),
      maxVal: 1000000,
      minVal: 0.00000010,
      currentstatus: 'before',
      selectedValue: 'Easy',
    };
   
  }

  checkStart() {
    if (!this.state.gameStarted) {
      this.startTimer();
    }
  }

  handleClick(row, column, data, rowi) {    
   
    this.state.cc = column;
    if(rowi === 0){      
      
      let game = this.state.game0.slice();
      let value = game[row][column];

      let solution;    
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      
       const getAlert = () => (
      <SweetAlert 
        success 
        title={'x' + this.state.payout0}
        onConfirm={() => this.hideAlert()}
      >
        {this.state.mark0}
      </SweetAlert>
    );

    this.setState({
      alert: getAlert()
    });

      this.setState({gameFinished: true });
      var markvalue = 'Take ' + this.state.mark0;
      this.setState({playbutton: 'Play' });
      var eth_value = Number(this.state.ethereumvalue) + Number(this.state.mark0);
      
      this.setState({ethereumvalue:  eth_value.toFixed(8) });


      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

      
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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();
      
     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark1;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark2;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark3;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark4;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();     

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark5;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      var markvalue = 'Take ' + this.state.mark6;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){
      
      var markvalue = 'Take ' + this.state.mark7;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
      //alert(rowi);
      let game = this.state.game8.slice();
      let value = game[row][column];

      let solution;    
      solution = data;
     

      this.setState({gameStarted: true, solution: solution});
   
      this.checkStart();      

     var ss = this.reveal(game, solution, row, column);
 
     if(ss==='success'){ 

      var markvalue = 'Take ' + this.state.mark8;
      this.setState({playbutton: markvalue });

      let minesLeft = this.state.minesLeft;
      this.stopTimer();
     
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);

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
   
  }

  hideAlert() {
    console.log('Hiding alert...');
    this.setState({
      alert: null
    });
  }

 
  handleRightClick(event, row, column) {
    let game = this.state.game.slice();
    event.preventDefault();
    this.checkStart();

    let value = game[row][column];
    //let value = 'F';
    if (this.state.gameFinished
      || (value !== null && value !== 'F')) {
      return;
    }

    game[row][column] = value ? null : 'F';
    const minesLeft = this.state.minesLeft + (game[row][column] ? -1 : 1);
    Game.vibrate(200);

    this.setState({game, minesLeft});
  }

  reveal(game, solution, row, column) {
   //alert(solution);
    // if (!this.inRange(row, column) || game[row][column] !== null) {      
    //   return;
    // }
    game[row][column] = solution[row][column];

    if (game[row][column] === 0 || game[row][column] === 1 || game[row][column] === 2 || game[row][column] === 3) {
    //alert(solution[row][column]);
   
    var gamestatus = 'success';    
       return gamestatus;
     }    

    // if (game[row][column] === 0) {
    //   this.expand(game, solution, row, column);
    // }
  }

  expand(game, solution, row, column) {
    this.reveal(game, solution, row - 1, column);
    this.reveal(game, solution, row + 1, column);
    this.reveal(game, solution, row, column - 1);
    this.reveal(game, solution, row, column + 1);
    this.reveal(game, solution, row - 1, column - 1);
    this.reveal(game, solution, row - 1, column + 1);
    this.reveal(game, solution, row + 1, column + 1);
    this.reveal(game, solution, row + 1, column - 1);
  }

  updateGameStatus(game, solution, row, column, rowi) {
   //alert(rowi);
   if(rowi===0){
    //alert('zzzz');
      if (Game.isMine(game, row, column)) {
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      this.stopTimer();
      row = this.state.row + 1;
      game = Game.getSolution(game, solution, 'F');
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);
    }

    this.setState({ game, gameFinished, buttonStatus, minesLeft});
   }
   else if(rowi === 1){
    //alert('one');
      if (Game.isMine(game, row, column)) {
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      this.stopTimer();
      row = this.state.row + 1;
      game = Game.getSolution(game, solution, 'F');
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);
    }

    this.setState({ game, gameFinished, buttonStatus, minesLeft});
   }
   else if(rowi === 2){
    //alert('two');
      if (Game.isMine(game, row, column)) {
        //alert('mine');
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      //alert('fffff');
      this.stopTimer();
      row = this.state.row + 1;
      game = Game.getSolution(game, solution, 'F');
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);
    }

    this.setState({ game,gameFinished, buttonStatus, minesLeft});
   }
   else{
    //alert('fout');
     if (Game.isMine(game, row, column)) {
        //alert('mine');
      this.state.currentstep = this.state.currentstep - 1;
      this.state.gameFinished = true;
      this.setState({gstatus: 'fail'});
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;


    if (gameFinished) {
      //alert('fffff');
      this.stopTimer();
      row = this.state.row + 1;
      game = Game.getSolution(game, solution, 'F');
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);
    }

    this.setState({ game,gameFinished, buttonStatus, minesLeft});
   }
   

  }

  setGameOver(game, solution, row, column) {    
      this.setState({gstatus: 'fail'});
      //alert('two  ddddd');
      this.stopTimer();
      game = game.map(
        (row, rowKey) => row.map(
          (square, squareKey) => {
            const isMine = Game.isMine(solution, rowKey, squareKey);
            if (square === 'F') {
              //alert('ffff');
              return isMine ? square : 'W';
            }


            return isMine ? 'M' : 'W';
          }
        )
      );
      Game.vibrate(800);
      game[row][column] = 'C'; // differ clicked mine that led to game over


      this.setState({
        game,
        gameFinished: true,
        buttonStatus: EMOJI_GAME_OVER,
      });
   
   
  }

  generateGame(height, width, currentRow, currentColumn, maximumMines) {
 
    //generateGame(height, width,  maximumMines) {
    const game =  Game.generateArray(height, width, 0);
   
    //alert(game);
    let generatedMines = 0;
    let row;
    let column;

    while (generatedMines < maximumMines) {
     
      row = Game.randomInRange(0, height - 1);
      column = Game.randomInRange(0, width - 1);

      //alert(row);
      //alert(column);

      //if (!Game.isMine(game, row, column) && !(currentRow === row && currentColumn === column)) {
        if (!Game.isMine(game, row, column)) {
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
    //alert(row);
    //alert(column);
    //alert(game);
    return game;
  }

  incrementMinesNearby(game, row, column) {
    if (this.inRange(row, column) && !Game.isMine(game, row, column)) {
      game[row][column] = game[row][column] + 1;
    }
  }

  inRange(row, column) {
    return row >= 0 && row < this.state.height
      && column >= 0 && column < this.state.width;
  }

  startTimer() {
    this.setState({
      gameStarted: true,
      time: 1,
      start: Date.now(),
    });
    if (this.timer) {
      this.stopTimer();
    }
    this.timer = setInterval(() => this.setState({
      time: Math.floor((Date.now() - this.state.start) / 1000) + 1,
    }), 1);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateBestTime(newTime) {
    const bestTimes = Object.assign({}, this.state.bestTimes);
    const bestTime = bestTimes[this.getBestTimeKey()] || null;
    if (bestTime === null || newTime < bestTime) {
      bestTimes[this.getBestTimeKey()] = newTime;
      localStorage.setItem('minesweeper:bestTimes', JSON.stringify(bestTimes));
      this.setState({bestTimes});
    }
  }

  getBestTimeText() {
    const bestTime = this.state.bestTimes[this.getBestTimeKey()] || null;
    return bestTime !== null ? 'Best time: ' + Game.leftPad(bestTime) : '';
  }

  getBestTimeKey() {
    return `${this.state.height},${this.state.width},${this.state.maximumMines}`;
  }

  isGame(height, width, maximumMines) {
    return this.state.height === height
      && this.state.width === width
      && this.state.maximumMines === maximumMines;
  }

  IncrementItem = () => {

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
        
  }


  DecreaseItem = () => {
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
     
  }

  handleChange (event){
    if(this.state.currentstatus === 'before'){
      this.setState({clicks : event.target.value});
    }else{}
    
  }
  

  render() {


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
 
      const datai = '';  const statusi = ''; const rowi = i; const cid=''; const nrow = ''; const old = ''; const gg ='';
      switch (i) {
        case 0:
          datai = this.state.data0;
          gg = this.state.game0;
          nrow = 2;  
          if(this.state.currentstep === 0)
          {
            statusi = false;              
          }
          else{
            statusi = true;            
          }

          if(this.state.currentstep === -1)
          {            
            cid = true;
             
          }
          else{
           
            cid = false;  
            old =0;  
          }        
             
          break;

        case 1:
        datai = this.state.data1;
        gg = this.state.game1;
        nrow = 1;
         if(this.state.currentstep === 1)
          {
            statusi = false;
            nrow = 1;
           
          }
          else{
            statusi = true;
           
          }

          if(this.state.currentstep === 0)
          {            
            cid = true;
             
          }
          else{
           
            cid = false;
            old =1;  
          }
         
          break;

        case 2:
        gg = this.state.game2;
        datai = this.state.data2;
        nrow = 0;
         if(this.state.currentstep === 2)
          {
            statusi = false;
                         
          }
          else{
            statusi = true;
                     
          }
          if(this.state.currentstep === 1 )
          {            
            cid = true;            

          }
          else{            
            cid = false;  
            old = 2;        
          }
         
          break;  
          case 3:
        gg = this.state.game3;
        datai = this.state.data3;
        nrow = 0;
         if(this.state.currentstep === 3)
          {
            statusi = false;
                         
          }
          else{
            statusi = true;
                     
          }
          if(this.state.currentstep === 2)
          {            
            cid = true;            

          }
          else{            
            cid = false;  
            old = 2;        
          }
         
          break;  
          case 4:
        gg = this.state.game4;
        datai = this.state.data4;
        nrow = 0;
         if(this.state.currentstep === 4)
          {
            statusi = false;
                         
          }
          else{
            statusi = true;
                     
          }
          if(this.state.currentstep === 3)
          {            
            cid = true;            

          }
          else{            
            cid = false;  
            old = 2;        
          }
         
          break;  
          case 5:
        gg = this.state.game5;
        datai = this.state.data5;
        nrow = 0;
         if(this.state.currentstep === 5)
          {
            statusi = false;
                         
          }
          else{
            statusi = true;
                     
          }
          if(this.state.currentstep === 4)
          {            
            cid = true;            

          }
          else{            
            cid = false;  
            old = 2;        
          }
         
          break;  
          case 6:
          gg = this.state.game6;
          datai = this.state.data6;
          nrow = 0;
           if(this.state.currentstep === 6)
            {
              statusi = false;
                           
            }
            else{
              statusi = true;
                       
            }
            if(this.state.currentstep === 5)
            {            
              cid = true;            

            }
            else{            
              cid = false;  
              old = 2;        
            }
         
          break;  
          case 7:
          gg = this.state.game7;
          datai = this.state.data7;
          nrow = 0;
           if(this.state.currentstep === 7)
            {
              statusi = false;
                           
            }
            else{
              statusi = true;
                       
            }
            if(this.state.currentstep === 6)
            {            
              cid = true;            

            }
            else{            
              cid = false;  
              old = 2;        
            }
         
          break;  
          case 8:
          gg = this.state.game8;
          datai = this.state.data8;
          nrow = 0;
           if(this.state.currentstep === 8)
            {
              statusi = false;
                           
            }
            else{
              statusi = true;
                       
            }
            if(this.state.currentstep === 8 || this.state.currentstep === 7)
            {            
              cid = true;            

            }
            else{            
              cid = false;  
              old = 2;        
            }
         
          break;          
         
      }
     
        BoardItems.push(<div ><Board
            id={i}
            key={rowi}
            onClick={(row, column) => this.handleClick(row, column, datai, rowi)}
            onRightClick={(event, row, column) => this.handleRightClick(event, row, column)}
            game={gg}
            gameFinished={this.state.gameFinished}
            cc={statusi}
            data0={this.state.data0}
            data1={this.state.data1}
            data2={this.state.data2}
            data3={this.state.data3}
            data4={this.state.data4}
            data5={this.state.data5}
            data6={this.state.data6}
            data7={this.state.data7}
            data8={this.state.data8}
            mark0={this.state.mark0}
            mark1={this.state.mark1}
            mark2={this.state.mark2}
            mark3={this.state.mark3}
            mark4={this.state.mark4}
            mark5={this.state.mark5}
            mark6={this.state.mark6}
            mark7={this.state.mark7}
            mark8={this.state.mark8}
            ccid={cid}
            old={old}
            state={this.state.currentstep}
            currentstatus={this.state.currentstatus}
            width={this.state.width}
            users={this.state.users}
            alldata={this.state.alldata}            
            gstatus={this.state.gstatus}

          /></div>);
    }
     

    return (
      <div className="Game">        
       
       <div className="sc-cIShpX play">   
                 
          <div >Ξ {this.state.ethereumvalue}</div>
        </div> 
        

        {BoardItems}

        {this.state.alert}
        
        
          <div className="sc-cIShpX play">   
                   
            <div><span onClick={() => this.restart(this.state.height, this.state.width, this.state.maximumMines)}>{this.state.playbutton}</span> </div>      
            
          </div>
          <div className="selectvalue">
                <DynamicSelect arrayOfData={arrayOfData} onSelectChange={this.handleSelectChange.bind(this)} selectedValue={this.state.selectedValue }
                currentstatus={this.state.currentstatus} clicks={this.state.clicks}/> <br /><br />
        </div>
            

        <div className="sc-cIShpX eJBueb">         
         <span onClick={this.IncrementItem}><i className="fa fa-plus plus" ></i></span>
         <span onClick={this.DecreaseItem}><i className="fa fa-minus minus"></i></span>
          <input className="input" spellCheck="false" type="text" tabIndex="-1" value={this.state.clicks} onChange={this.handleChange.bind(this)}></input>         
        <div className="amount-label">Bet amount</div>
        </div>


        
        
        


      </div>
    );
  }
}

export default Game;