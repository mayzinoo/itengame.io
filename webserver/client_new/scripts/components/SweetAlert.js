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
        displayName: 'SweetAlert',

         closeNav:function (event) 
         {        
             document.getElementById("myalert").setAttribute("class", "overlay");        
         },


        propTypes: {
            success:React.PropTypes.bool.isRequired,
            title:React.PropTypes.string.isRequired,
            amount:React.PropTypes.string.isRequired,
            cname:React.PropTypes.string.isRequired,
                        
        },         

          render: function () {
            console.log('xxxxxx', this.props.cname);
            return D.div({ id: 'myalert', className: this.props.cname },                 
                // D.a({ className:'closebtn', onClick:this.closeNav },  'X', ), 
                D.p({ className: '' }, 'x' + this.props.title ), 
                D.p({ className: '' }, this.props.amount ), 
                D.audio({className:'dd'},
                            D.source({src:'sounds/findingsuccess.wav'}),
                        )   
                );    
        }   
                                
    });
});

    

    


