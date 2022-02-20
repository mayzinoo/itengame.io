import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<Game/>, document.getElementById('game-container'));
// ReactDOM.render(<Game/>, document.getElementById('second'));
// ReactDOM.render(<Game/>, document.getElementById('first'));


serviceWorker.register();
