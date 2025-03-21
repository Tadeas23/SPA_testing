import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Pokud chcete přidat nějaké globální styly
import App from './app'; // Import hlavní aplikace
import { BrowserRouter as Router } from 'react-router-dom'; // Router pro navigaci

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
