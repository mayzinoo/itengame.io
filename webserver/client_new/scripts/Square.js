import React , { useState, useCallback } from 'react';
import './Square.css';

const classMapping = {
  'C': 'emoji mine clicked',
  'M': 'emoji mine',
  'F': 'emoji flag',
  'W': 'emoji wrong',
  null: 'unrevealed',
};

const symbolMapping = {
  'C': '💣',
  'M': '💣',
  'M\'': '💣',
  '\'M': '💣',
  'F': '💣',
  'W': '🍇',
  '0': '🍇',
  '0\'': '🍇',
  '\'0': '🍇',
  '1': '🍇',
  '\'1': '🍇',
  '1\'': '🍇',
  '2': '🍇',
  '2\'': '🍇',
  '\'2': '🍇',
  '' : '🍇',

};
var names = 'Harry,John,Clark,Peter,Rohn,Alice';
var nameArr = names.split(',');

const getClass = value => classMapping[value] || 'revealed number' + value;
const getSymbol = value => symbolMapping[value] || (value ? value : '');

export default function Square(props) {
if(props.id === 0){
var skey = props.dd;
   var names_zero = props.data0;
   names_zero = "'" + names_zero + "'";
   var nameArr_0 = names_zero.split(',');
   
   
   if(skey === 0){
      var result = nameArr_0[0];    
      
   }
   else if(skey === 1){
    var result = nameArr_0[1];
    
   }
   else if(skey === 2){
    var result = nameArr_0[2];    
   }
   else{
    var result = nameArr_0[3];    
   }

  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
    { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) } 
       
   
 
    </button>  
 );
}
else if(props.id ===1){
   var skey = props.dd;
   var names_one = props.data1;
   names_one = "'" + names_one + "'";
   var nameArr_1 = names_one.split(',');
   
   
   if(skey === 0){
      var result = nameArr_1[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_1[1];
    
   }
   else if(skey === 2){
    var result = nameArr_1[2];
    
   }
   else{
    var result = nameArr_1[3];
    
   }

  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
       
 
    </button>  
 );
}
else if(props.id ===2){
   var skey = props.dd;
   var names_two = props.data2;
   names_two = "'" + names_two + "'";
   var nameArr_2 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_2[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_2[1];
    
   }
   else if(skey === 2){
    var result = nameArr_2[2];
    
   }
   else{
    var result = nameArr_2[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}

else if(props.id ===3){
   var skey = props.dd;
   var names_two = props.data3;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}

else if(props.id ===4){
   var skey = props.dd;
   var names_two = props.data4;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}
else if(props.id ===5){
   var skey = props.dd;
   var names_two = props.data5;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}

else if(props.id ===6){
   var skey = props.dd;
   var names_two = props.data6;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}

else if(props.id ===7){
   var skey = props.dd;
   var names_two = props.data7;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}


else {
   var skey = props.dd;
   var names_two = props.data8;
   names_two = "'" + names_two + "'";
   var nameArr_3 = names_two.split(',');
   
   
   if(skey === 0){
      var result = nameArr_3[0];
      
      
   }
   else if(skey === 1){
    var result = nameArr_3[1];
    
   }
   else if(skey === 2){
    var result = nameArr_3[2];
    
   }
   else{
    var result = nameArr_3[3];
    
   }

   
  return (

    <button
      className={`Square ${getClass(props.value)}`}
     
      onClick={props.onClick}
      onContextMenu={props.onRightClick}        
    >  
   
     
      { (props.gstatus === 'fail'  ?  getSymbol(result) :  getSymbol(props.value) ) }
   
 
    </button>  
 );
}
 
   
 
};