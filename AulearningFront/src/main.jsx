import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './styles/app.css';
import './styles/auth.css';
import './styles/components.css';
import './styles/admin-layout.css';
import './styles/learning-layout.css';
import './styles/learning-dashboard.css';
import './styles/responsive.css';
import './styles/loaders.css';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);