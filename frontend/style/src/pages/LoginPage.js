// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const [stage, setStage] = useState('credentials'); // 'credentials' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/login`, { email, password });
      // OTP sent to email
      setStage('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
      // data: { token, user, ... }
      login(data); // save token & user in context
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
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
      boxSizing: 'border-box', // Ensures input doesn't overflow container
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
    buttonHover: {
      backgroundColor: '#222',
      transform: 'scale(1.03)',
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
    extraLinks: {
      textAlign: 'center',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        {stage === 'credentials' ? (
          <form onSubmit={handleCredentialSubmit}>
            <h2 style={styles.title}>Login</h2>
            {error && <p style={styles.errorText}>{error}</p>}
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
            <div style={styles.extraLinks}>
              <p>
                Don’t have an account? <Link to="/register/user">Register</Link>
              </p>
              <p>
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <h2 style={styles.title}>Enter OTP</h2>
            {error && <p style={styles.errorText}>{error}</p>}
            <p>OTP has been sent to <strong>{email}</strong></p>
            <input
              style={styles.input}
              type="text"
              placeholder="One-Time Password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
