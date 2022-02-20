define([
    'react',
    'components/GraphicsContainer',
    'components/ControlsSelector' 
], function (
    React,
    GraphicsContainerClass,
    ControlsSelectorClass, 

) {
    var D = React.DOM;

    var GraphicsContainer = React.createFactory(GraphicsContainerClass);
    var ControlsSelector = React.createFactory(ControlsSelectorClass);

     const symbolMapping = {
      'Easy': '🥑',
      'Medium': '🥥',
      'Hard': '🍌',
      'Extreme': '🍍',
      'Nightmare': '🍓',
      
    };
    const arrayData = [
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
    const getSymbol = value => symbolMapping[value];
    

    return React.createClass({
        displayName: 'Change',

         handleMedium:function(event) 
        {
            document.getElementById("myNav").setAttribute("class", "overlay"); 
            let selectedValue = 'Newbie';
            this.props.onSelectChange(selectedValue);
        },
         handleHard:function(event) 
         {
             document.getElementById("myNav").setAttribute("class", "overlay"); 
             let selectedValue = 'Classic';
             this.props.onSelectChange(selectedValue);
         },
          handleExtreme:function (event)
         {
             document.getElementById("myNav").setAttribute("class", "overlay"); 
             let selectedValue = 'Hard';
             this.props.onSelectChange(selectedValue);
             //localStorage.setItem('stopgame', 'true');
         },
          handleNightmare:function (event) 
         {
             document.getElementById("myNav").setAttribute("class", "overlay"); 
             let selectedValue = 'Expert';
             this.props.onSelectChange(selectedValue);
         },
         handleChange:function(event) 
         {
             document.getElementById("myNav").setAttribute("class", "overlay"); 
             let selectedValue = event.target.value;
             this.props.onSelectChange(selectedValue);
         },
         openNav:function(event) 
         {   
             document.getElementById("myNav").setAttribute("class", "overlay2");
             let selectedValue = this.props.selectedValue;
             this.props.onSelectChange(selectedValue);        
         },
         closeNav:function (event) 
         {        
             document.getElementById("myNav").setAttribute("class", "overlay");        
         },

        propTypes: {
            selectedValue:React.PropTypes.string.isRequired,
            currentstatus:React.PropTypes.string.isRequired,
            clicks:React.PropTypes.string.isRequired,
            playstatus:React.PropTypes.string.isRequired,
                        
        },         

          render: function () {  
          var changeclass; var changebtn = [];
          if(this.props.selectedValue === "Newbie"){              
              if(this.props.currentstatus === 'before')             
               {
                    changeclass = 'change-btn';
               } 
               else{
                    changeclass = 'notableclick';
               }
          }
          else if(this.props.selectedValue === "Classic"){
              if(this.props.currentstatus === 'before')             
               {
                    changeclass = 'change-btn';
               } 
               else{
                    changeclass = 'notableclick';
               }
          }
          else if(this.props.selectedValue === "Hard"){
              if(this.props.currentstatus === 'before')             
               {
                    changeclass = 'change-btn-2';
               } 
               else{
                    changeclass = 'notableclick-2';
               }
          }
          else if(this.props.selectedValue === "Expert"){
              if(this.props.currentstatus === 'before')             
               {
                    changeclass = 'change-btn-2';
               } 
               else{
                    changeclass = 'notableclick-2';
               }
          }
          else{
              if(this.props.currentstatus === 'before')             
               {
                    changeclass = 'change-btn';
               } 
               else{
                    changeclass = 'notableclick';
               }
          } 

          if(this.props.currentstatus === 'before'){
                changebtn.push(D.div({  onClick:this.openNav , className: changeclass }, 'Change' ) ); 
          }
          else{
                changebtn.push(D.div({  className: changeclass }, 'Change' ) ); 
          }

            return D.div({ },
                    D.div({ id: 'myNav', className: 'overlay' },

                        D.div({ className: 'overlay-content' },
                            D.div({ className: 'overlay-content' },
                                D.ul({ className: 'groups-holder' },

                                    D.li({ onClick:this.handleMedium },
                                        D.div({  },
                                            D.div({ className:'inner-dropdown' },
                                                D.div({ className:'(this.props.selectedValue === "Newbie" ? "activelabel" : "label")' },
                                                    D.div({className:'gname-label'},
                                                        D.img({ src: 'img/plant.png' , className: 'img-responsive level-logo'} ),
                                                        D.div({ className:'mode-name' }, 'Newbie', ),
                                                        D.div({ className:'group-name' }, '(*1.2 rate)', ),
                                                    ),
                                                ),
                                            ),    
                                        ),
                                    ),

                                    D.li({ onClick:this.handleHard },
                                        D.div({  },
                                            D.div({ className:'inner-dropdown' },
                                                D.div({ className:'(this.props.selectedValue === "Classic" ? "activelabel" : "label")' },
                                                    D.div({className:'gname-label'},
                                                        D.img({ src: 'img/hard.png' , className: 'img-responsive level-logo'} ),
                                                        D.div({ className:'mode-name' }, 'Classic', ),
                                                        D.div({ className:'group-name' }, '(*1.4 rate)', ),
                                                    ),
                                                ),
                                            ),    
                                        ),
                                    ),

                                    D.li({ onClick:this.handleExtreme },
                                        D.div({  },
                                            D.div({ className:'inner-dropdown' },
                                                D.div({ className:'(this.props.selectedValue === "Hard" ? "activelabel" : "label")' },
                                                    D.div({className:'gname-label'},
                                                        D.img({ src: 'img/extreme.png' , className: 'img-responsive level-logo'} ),
                                                        D.div({ className:'mode-name' }, 'Hard', ),
                                                        D.div({ className:'group-name' }, '(*2 rate)', ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                    ),

                                    D.li({ onClick:this.handleNightmare },
                                        D.div({  },
                                            D.div({ className:'inner-dropdown' },
                                                D.div({ className:'(this.props.selectedValue === "Expert" ? "activelabel" : "label")' },
                                                    D.div({className:'gname-label'},
                                                        D.img({ src: 'img/nightmare.png' , className: 'img-responsive level-logo'} ),
                                                        D.div({ className:'mode-name' }, 'Expert', ),
                                                        D.div({ className:'group-name' }, '(*2.5 rate)', ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                
                    ),

                     changebtn,            

                );    
        }   
                                
    });
});

    

    


