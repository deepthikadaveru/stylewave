// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post(`${BASE_URL}/api/forgot-password`, { email });
      setMessage('If this email exists, you’ll receive reset instructions shortly.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://i.pinimg.com/736x/29/e6/0c/29e60ca147b51ce02b7ab8832c7ea069.jpg")',
      backgroundSize: 'contain',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif",
      backgroundBlendMode: 'overlay',
    },
    formWrapper: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '15px',
      padding: '35px 30px',
      width: '100%',
      maxWidth: '500px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '28px',
      fontWeight: '700',
      color: '#000',
      fontFamily: "'Poppins', sans-serif",
    },
    input: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      marginBottom: '15px',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#000',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.2s',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '15px',
    },
    successText: {
      color: 'green',
      textAlign: 'center',
      marginBottom: '15px',
    },
    link: {
      textAlign: 'center',
      marginTop: '15px',
      color: '#000',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <form onSubmit={handleSubmit}>
          <h2 style={styles.title}>Forgot Password</h2>
          {message && <p style={styles.successText}>{message}</p>}
          {error && <p style={styles.errorText}>{error}</p>}

          <input
            style={styles.input}
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending…' : 'Submit'}
          </button>

          <p style={styles.link}>
            Remembered? <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
