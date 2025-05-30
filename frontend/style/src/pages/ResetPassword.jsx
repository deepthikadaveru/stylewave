// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/reset-password`, { token, password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed.');
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
    link: {
      textAlign: 'center',
      marginTop: '15px',
      color: '#000',
      fontSize: '14px',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Reset Password</h2>
        {error && <p style={styles.errorText}>{error}</p>}
        {message && <p style={styles.successText}>{message}</p>}
        {!message && (
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
        <p style={styles.link}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
