// src/pages/OTPVerification.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { otp });
      if (response.data.success) {
        history.push('/');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('Error verifying OTP');
    }
  };

  return (
    <div className="otp-container">
      <form onSubmit={handleSubmit}>
        <h2>Enter OTP</h2>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default OTPVerification;
