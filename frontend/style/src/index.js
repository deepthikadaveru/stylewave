import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <Router>
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <App />
    </AuthProvider>
  </Router>
);
