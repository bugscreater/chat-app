import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.js';
import {BrowserRouter as Router} from 'react-router-dom' 
import $ from 'jquery';
import Popper from 'popper.js';






ReactDOM.render(
  <React.StrictMode>
    <Router>
    <App/>
    </Router>
   
  </React.StrictMode>,
  document.getElementById('root')
);


