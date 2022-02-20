
// import React , { useState, useCallback } from 'react';
// import Square from './Square';
// import './Board.css';

define([
    'react',
    'components/GraphicsContainer',
    'components/ControlsSelector', 
    'components/Square'   
], function (
    React,
    GraphicsContainerClass,
    ControlsSelectorClass, 
    SquareClass,   
) {
    var D = React.DOM;

    var GraphicsContainer = React.createFactory(GraphicsContainerClass);
    var ControlsSelector = React.createFactory(ControlsSelectorClass);
    var Square = React.createFactory(SquareClass);




    var renderSquare = function renderSquare(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, row, column, value, width, level) {
        return D.div( {  id: 'square'},
                Square({
                          id:pid,
                          dd:column,
                          key:pid + "_" + column,
                          value:value,
                          data0:data0,
                          data1:data1,
                          data2:data2,
                          data3:data3,
                          data4:data4,
                          data5:data5,
                          data6:data6,
                          data7:data7,
                          data8:data8,
                          gstatus:gstatus,
                          width:width,
                          level:level,
                          onClick: function(){ return clickcc(0, column) } 

                   }));
};


var renderRow = function renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, row, items, width, level) {
  return items.map(function (value, key) {

    return renderSquare(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, row, key, value, width, level);
  });
};




    return React.createClass({
        displayName: 'Board',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            controlsSize: React.PropTypes.string.isRequired,
            id:React.PropTypes.number.isRequired,
            key:React.PropTypes.number.isRequired,
            game:React.PropTypes.array.isRequired,
            game0:React.PropTypes.array.isRequired,
            game1:React.PropTypes.array.isRequired,
            game2:React.PropTypes.array.isRequired,
            game3:React.PropTypes.array.isRequired,
            game4:React.PropTypes.array.isRequired,
            game5:React.PropTypes.array.isRequired,
            game6:React.PropTypes.array.isRequired,
            game7:React.PropTypes.array.isRequired,
            game8:React.PropTypes.array.isRequired,
            gameFinished:React.PropTypes.bool.isRequired,            
            data0:React.PropTypes.array.isRequired,
            data1:React.PropTypes.array.isRequired,
            data2:React.PropTypes.array.isRequired,
            data3:React.PropTypes.array.isRequired,
            data4:React.PropTypes.array.isRequired,
            data5:React.PropTypes.array.isRequired,
            data6:React.PropTypes.array.isRequired,
            data7:React.PropTypes.array.isRequired,
            data8:React.PropTypes.array.isRequired,
            mark0:React.PropTypes.string.isRequired,
            mark1:React.PropTypes.string.isRequired,
            mark2:React.PropTypes.string.isRequired,
            mark3:React.PropTypes.string.isRequired,
            mark4:React.PropTypes.string.isRequired,
            mark5:React.PropTypes.string.isRequired,
            mark6:React.PropTypes.string.isRequired,
            mark7:React.PropTypes.string.isRequired,
            mark8:React.PropTypes.string.isRequired,            
            state:React.PropTypes.number.isRequired,
            currentstatus:React.PropTypes.string.isRequired,
            width:React.PropTypes.number.isRequired,
            clevel:React.PropTypes.string.isRequired, 
            gstatus:React.PropTypes.string.isRequired,
            cc:React.PropTypes.string.isRequired,
            hidemark8:React.PropTypes.number.isRequired,
            hidemark7:React.PropTypes.number.isRequired,
            hidemark6:React.PropTypes.number.isRequired,
            hidemark5:React.PropTypes.number.isRequired,
            hidemark4:React.PropTypes.number.isRequired,
            hidemark3:React.PropTypes.number.isRequired,
            hidemark2:React.PropTypes.number.isRequired,
            hidemark1:React.PropTypes.number.isRequired,
            hidemark0:React.PropTypes.number.isRequired,
        }, 

        render: function (props) {
          console.log(this.props.clevel);
          
          var tt = [] ; var pid; 
          var data0 = this.props.data0;
          var data1 = this.props.data1;
          var data2 = this.props.data2;
          var data3 = this.props.data3;
          var data4 = this.props.data4;
          var data5 = this.props.data5;
          var data6 = this.props.data6;
          var data7 = this.props.data7;
          var data8 = this.props.data8;
          var gstatus = this.props.gstatus;
          var clickcc = this.props.onClick;
          var width = this.props.width;
          var level = this.props.clevel;

         
         
    if(this.props.id === 0){
    pid = 0; 
    var mark = this.props.mark0;
    var width = this.props.width;
    tt = this.props.game0;

    if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark0 === 'true' ? 'hidemark' : '')}, mark ,       
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                //this.props.game0.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 8, value, width,level)), 
                this.props.game0.map(function (value, key) {
  return renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 8, value, width, level);
})               
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark0 === 'true' ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game0.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 8, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark0 === 'true' ? 'hidemark' : '') }, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game0.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 8, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 1){
    var mark = this.props.mark1;
    var width = this.props.width;
    tt = this.props.game1;
     pid = 1;

     if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark1 === 'true' ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game1.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 7, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark1 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game1.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 7, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark1 === 'true' ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game1.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 7, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 2){
    var mark = this.props.mark2;
   var width = this.props.width;
    tt = this.props.game2;
     pid = 2;

     if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark2 === 'true'  ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game2.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 6, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark2 === 'true'  ? 'hidemark' : '') }, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game2.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 6, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark2 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game2.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 6, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 3){
    var mark = this.props.mark3;
   var width = this.props.width;
    tt = this.props.game3;
     pid = 3;

     if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark3 === 'true' ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game3.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 5, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark3 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game3.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 5, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark3 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game3.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 5, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 4){
    var mark = this.props.mark4;
    var width = this.props.width;
    tt = this.props.game4;
     pid = 4;

     if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark4 === 'true'  ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game4.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 4, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark4 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game4.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 4, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark4 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game4.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 4, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 5){
    var mark = this.props.mark5;
    var width = this.props.width;
    tt = this.props.game5;
     pid = 5; 

    if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark5 === 'true' ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game5.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 3, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark5 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game5.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 3, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark5 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game5.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 3, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 6){
    
    var mark = this.props.mark6;
    var width = this.props.width;
    tt = this.props.game6;
    pid = 6;

    if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark6 === 'true' ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game6.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 2, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark6 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game6.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 2, value, width, level)),                
                ),                  
              );
     }
     else{

      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark6 === 'true'  ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game6.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 2, value, width, level)),                
                ),                  
              );
     }      
  }
  else if(this.props.id === 7){
    
    var mark = this.props.mark7;
    var width = this.props.width;
    tt = this.props.game7;
    pid = 7;
    if(this.props.width===4){  
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark7 === 'true' ? 'hidemark' : '')}, mark ,
             D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
            } } , 
             
            
                this.props.game7.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 1, value, width, level)),                
              ),                  
            );
     }
     else if(this.props.width===3){  
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark8 === 'true' ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game7.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 1, value, width, level)),                
                ),                  
              );
     }
     else{
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark7 === 'true' ? 'hidemark' : '')}, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game7.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 1, value, width, level)),                
                ),                  
              );
     }
  }
  else if(this.props.id === 8){
    var mark = this.props.mark8; 
    var width = this.props.width;
    tt = this.props.game8; 
    pid = 8;

    if(this.props.width===4){      
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark8 === 'true' ? 'hidemark' : '') }, mark ,
               D.div({ id:this.props.id, className:'Board4' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game8.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 0, value, width, level)),                
                ),                  
              );
    }
   else if(this.props.width===3){      
      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark8 === 'true'  ? 'hidemark' : '') }, mark ,
               D.div({ id:this.props.id, className:'Board3' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } , 
               
              
                  this.props.game8.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 0, value, width, level)),                
                ),                  
              );
    }

   
   else{  

      return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'm-active') +  (this.props.hidemark8 === 'true'  ? 'hidemark' : '') }, mark ,


       D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } ,               
              
                  this.props.game8.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 0, value, width, level)),                
                ),                  
              );
    }
  }
  else{
    return  D.span({ id: 'mark', className:'' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? '' : 'uu') }, mark ,
               D.div({ id:this.props.id, className:'Board2' + (this.props.cc ==='true' || this.props.currentstatus === 'before' ? ' disabled' : ' btn-active'), style: { gridTemplateColumns: `repeat(${this.props.width}, 1fr)`
              } } ,               
              
                  this.props.game8.map((value, key) => renderRow(pid, data0, data1, data2, data3, data4, data5, data6, data7, data8, gstatus, clickcc, 0, value, width, level)),                
                ),                  
              );
    tt = [];
  } 
   
  
            
        }
    });

});


