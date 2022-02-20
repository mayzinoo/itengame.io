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
        displayName: 'Anialert',

        propTypes: {
           success:React.PropTypes.bool.isRequired,
            cname:React.PropTypes.string.isRequired,
                        
        },         

          render: function () {
            console.log('aaaaaaa');
	                   
                   
            return  D.div({id:'',className:''},
                        D.div({ className: 'pyro'},                 
                    D.img({className:'fireworkani', src :'img/goldencup2.png'},),
                            D.div({className:'before'},),
                            D.div({className:'after'},),
                        ), 
                    );
        }   
                                
    });
});

    

    



