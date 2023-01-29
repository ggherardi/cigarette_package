import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainComponent from './libraries/components/MainComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
//@ts-ignore
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

let isCreated = false;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

if(!isCreated){
  root.render(
    <div>
      <MainComponent />
    </div>
  );
  isCreated = true;
}
