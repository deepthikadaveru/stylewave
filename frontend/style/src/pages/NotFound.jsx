// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <h1>404 — Page Not Found</h1>
    <p>Sorry, we couldn’t find what you were looking for.</p>
    <Link to="/">Go back home</Link>
  </div>
);

export default NotFound;
