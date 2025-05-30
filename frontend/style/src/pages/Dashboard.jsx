// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/api/profiles/${user.id}`);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfile();
    else setLoading(false);
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      {profile && (
        <section className="profile-section">
          <h2>Your Profile Details</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.type && <p><strong>Role:</strong> {profile.type}</p>}
          {profile.brand && <p><strong>Brand:</strong> {profile.brand}</p>}
          {profile.city && <p><strong>City:</strong> {profile.city}</p>}
          {/* Add more fields as desired */}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
