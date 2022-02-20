import React, {Component} from 'react';
import './Game.css';

class DynamicSelect extends Component{
    constructor(props){
        super(props)
    }
    
    //On the change event for the select box pass the selected value back to the parent
     handleEasy = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = 'Easy';
        this.props.onSelectChange(selectedValue);
    }
     handleMedium = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = 'Medium';
        this.props.onSelectChange(selectedValue);
    }
     handleHard = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = 'Hard';
        this.props.onSelectChange(selectedValue);
    }
     handleExtreme = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = 'Extreme';
        this.props.onSelectChange(selectedValue);
    }
     handleNightmare = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = 'Nightmare';
        this.props.onSelectChange(selectedValue);
    }
    handleChange = (event) =>
    {
        document.getElementById("myNav").setAttribute("class", "overlay"); 
        let selectedValue = event.target.value;
        this.props.onSelectChange(selectedValue);
    }
    openNav = (event) =>
    {        
        document.getElementById("myNav").setAttribute("class", "overlay2");
        let selectedValue = this.props.selectedValue;
        this.props.onSelectChange(selectedValue);        
    }
    closeNav = (event) =>
    {        
        document.getElementById("myNav").setAttribute("class", "overlay");        
    }

    

    render(){
        const symbolMapping = {
      'Easy': '🥑',
      'Medium': '🥥',
      'Hard': '🍌',
      'Extreme': '🍍',
      'Nightmare': '🍓',
      
    }
        const getSymbol = value => symbolMapping[value];
        let arrayOfData = this.props.arrayOfData;
        let options = arrayOfData.map((data) =>
                <option 
                    key={data.id}
                    value={data.id}
                >
                    {data.name}
                </option>
            );
        
            return (
            <React.Fragment> 
            
           <div id="myNav" className="overlay" >
              <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
              <div className="overlay-content">
                <div className="dropdown">
                    <ul className="groups-holder">            
                        <li onClick={this.handleEasy}>
                            <div><div className="inner-dropdown" ><div className={(this.props.selectedValue === "Easy" ? "activelabel" : "label")}>
                            <div className="mode-name">Easy</div><div className="group-name">3 out of 4 win</div></div></div>
                            <div className="btn-holder" ><div className="selected-mode sc-dxgOiQ dtjNHQ"><i className="image border sc-dnqmqq gtgabp"></i><i className="image border-active sc-dnqmqq dZtyxK"></i><i className="image bg sc-dnqmqq jSarNC"></i>
                                <div className="level" ><i className="image sc-dnqmqq eYMclv">🥑</i></div></div></div></div>
                        </li>
                        <li className="group" onClick={this.handleMedium}>
                <div>
                    <div className="inner-dropdown">
                        <div className={(this.props.selectedValue === "Medium" ? "activelabel" : "label")}>
                            <div className="mode-name">Medium</div>
                            <div className="group-name">2 out of 3 win</div>
                        </div>
                    </div>
                    <div className="btn-holder">
                    <div className="selected-mode sc-dxgOiQ dtjNHQ">
                        <i className="image border sc-dnqmqq gtgabp"></i><i className="image bg sc-dnqmqq jSarNC"></i>
                        <div className="level"><i className="image sc-dnqmqq eVyCvR">🥥</i></div></div>
                    </div>
                </div>
            </li>
            <li className="group" onClick={this.handleHard}>
                <div><div className="inner-dropdown"><div className={(this.props.selectedValue === "Hard" ? "activelabel" : "label")}><div className="mode-name">Hard</div><div className="group-name">1 out of 2 wins</div></div></div><div className="btn-holder" ><div className="selected-mode sc-dxgOiQ dtjNHQ"><i className="image border sc-dnqmqq gtgabp"></i><i className="image bg sc-dnqmqq jSarNC"></i>
                <div className="level"><i className="image sc-dnqmqq frFmZv">🍌</i></div></div></div></div>
            </li>
            <li className="group" onClick={this.handleExtreme}>
                <div><div className="inner-dropdown"><div className={(this.props.selectedValue === "Extreme" ? "activelabel" : "label")}><div className="mode-name">Extreme</div><div className="group-name">1 out of 3 wins</div></div></div><div className="btn-holder" ><div className="selected-mode sc-dxgOiQ dtjNHQ"><i className="image border sc-dnqmqq gtgabp"></i><i className="image bg sc-dnqmqq jSarNC"></i>
                <div className="level"><i className="image sc-dnqmqq bQeetG">🍍</i></div></div></div></div>
            </li>
            <li className="group" onClick={this.handleNightmare}>
                <div><div className="inner-dropdown"><div className={(this.props.selectedValue === "Nightmare" ? "activelabel" : "label")}><div className="mode-name">Nightmare</div><div className="group-name">1 out of 4 wins</div></div></div><div className="btn-holder"><div className="selected-mode sc-dxgOiQ dtjNHQ"><i className="image border sc-dnqmqq gtgabp"></i><i className="image bg sc-dnqmqq jSarNC"></i>
                <div className="level"><i className="image sc-dnqmqq EFmHR">🍓</i></div></div></div></div>
            </li>
        </ul>
                </div></div></div>
                <button className={(this.props.currentstatus === "before" ? "btn-level" : "tooltip")} onClick={this.openNav}><i>
                { (this.props.selectedValue) ? getSymbol(this.props.selectedValue) : '🥑'}</i>
                <span className="tooltiptext">Finish active bet to change difficulty</span>
                </button>
                
                </React.Fragment>        
        );
    }
}

export default DynamicSelect;