import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PackageScene from './libraries/packageScene';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

new PackageScene();

root.render(
  <div>
    <React.StrictMode>    
    </React.StrictMode>
  </div>
);