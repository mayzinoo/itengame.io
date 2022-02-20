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
      'Newbie': '🥥',
      'Classic': '🍌',
      'Hard': '🍍',
      'Expert': '🍓',
      
    };
    const arrayData = [      
      {
        id: 'Newbie',
        name: '🥥 Newbie',
        width: 3,
        level:'newbie'    
      },
      {
        id: 'Classic',
        name: '🍌 Classic',
        width: 2,
        level:'classic'    
      },
      {
        id: 'Hard',
        name: '🍍 Hard',
        width: 3,
        level:'hard'    
      },
      {
        id: 'Expert',
        name: '🍓 Expert',
        width: 2,
        level:'expert'    
      },
    ];
    const getSymbol = value => symbolMapping[value];
    

    return React.createClass({
        displayName: 'DynamicSelect',

         handleEasy:function (event)
        {
            document.getElementById("myNav").setAttribute("class", "overlay"); 
            let selectedValue = 'Easy';
            this.props.onSelectChange(selectedValue);
        },
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
            var imgname; var logoclass;
          if(this.props.selectedValue === "Newbie"){
              imgname = 'img/plant.png';
              logoclass = 'level-logo-easy';
          }
          else if(this.props.selectedValue === "Classic"){
              imgname = 'img/hard.png';
              logoclass = 'level-logo-easy';
          }
          else if(this.props.selectedValue === "Hard"){
              imgname = 'img/extreme.png';
              logoclass = 'level-logo-2';
          }
          else if(this.props.selectedValue === "Expert"){
              imgname = 'img/nightmare.png';
              logoclass = 'level-logo-2';
          }
          else{
              imgname = 'img/plant.png';
              logoclass = 'level-logo-easy';
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
                                                        D.div({className:'level-logo'},
                                                            D.img({ src: 'img/plant.png' , className: 'img-responsive fruit-img'} ), ),
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
                                                        D.div({className:'level-logo'},
                                                            D.img({ src: 'img/hard.png' , className: 'img-responsive fruit-img'} ), ),
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
                                                        D.div({className:'level-logo'},
                                                            D.img({ src: 'img/extreme.png' , className: 'img-responsive fruit-img'} ), ),
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
                                                        D.div({className:'level-logo'},
                                                            D.img({ src: 'img/nightmare.png' , className: 'img-responsive fruit-img'} ), ),
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

                    D.button({ className: 'btn-level'   }, 
                         D.img({ src: imgname , className: `img-responsive ${logoclass}` }  ), 
                         D.span({ className:'tooltiptext' }, 'Finish active bet to change difficulty' ), 
                    ),                    

                );    
        }   
                                
    });
});

    

    


