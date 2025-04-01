import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Se existir
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Use o método de renderização mais simples
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
); 