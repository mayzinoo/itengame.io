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
    

    return React.createClass({
        displayName: 'DemoAlert',

         closeNav:function (event) 
         {        
             document.getElementById("myalert2").setAttribute("class", "overlay");        
         },
         refreshPage:function() {
            window.location.reload(false);
          },


        propTypes: {
            success:React.PropTypes.bool.isRequired,
            cname:React.PropTypes.string.isRequired,
                        
        },

        render: function () {            
            return D.div({ id: 'myalert2', className: this.props.cname },    
                
                D.p({ className: '' }, 'FUN BALANCE'  ), 
                D.p({ className: '' }, '80000' ),   
                D.p({ className: '' },
                    D.button({ className: 'demoalert', 
                               onClick:() => this.refreshPage() }, 
                         D.i({ }, 'RELOAD' ), 
                    ),
                    ),  
                D.p({ className: '' }, 'OR' ),  
                D.p({ className: '' }, 'PLAY WITH BTC' ),  
                );    
        }   
                                
    });
});         

  
