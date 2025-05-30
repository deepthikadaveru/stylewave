import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ResellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'Tailor',
    email: '',
    phone: '',
    password: '',
    description: '',
    profilePicture: null,
    images: [],
    address: '',
    city: '',
    lat: '',
    lng: '',
    instagram: '',
    facebook: '',
    website: '',
    workingHours: '',
    averageFare: '',
    services: [], // for multiple services input
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleImagesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key === 'images') {
          formData.images.forEach((file) => form.append('images', file));
        } else if (key === 'profilePicture' && formData.profilePicture) {
          form.append('profilePicture', formData.profilePicture);
        } else {
          form.append(key, formData[key]);
        }
      }

      await axios.post(`${BASE_URL}/api/register/reseller`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '150vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://i.pinimg.com/736x/29/e6/0c/29e60ca147b51ce02b7ab8832c7ea069.jpg")',
      backgroundColor: '#f4f4f4',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
      backgroundBlendMode: 'overlay',
    },
    formWrapper: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '15px',
      padding: '35px 30px',
      width: '100%',
      maxWidth: '600px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '25px',
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
      boxSizing: 'border-box', // Ensure the input does not overflow the container
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Reseller Sign Up</h2>
        {error && <div style={styles.errorText}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              onChange={handleProfilePictureChange}
              accept="image/*"
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Additional Images</label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              onChange={handleImagesChange}
              accept="image/*"
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              name="lat"
              type="text"
              value={formData.lat}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              name="lng"
              type="text"
              value={formData.lng}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input
              id="instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input
              id="facebook"
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          
  
<div style={styles.formGroup}>
  <label htmlFor="workingHours">Working Hours</label>
  <input
    id="workingHours"
    name="workingHours"
    type="text"
    value={formData.workingHours}
    onChange={handleChange}
    required
    placeholder="e.g., 10:00 AM - 8:00 PM"
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="averageFare">Average Fare</label>
  <input
    id="averageFare"
    name="averageFare"
    type="number"
    value={formData.averageFare}
    onChange={handleChange}
    required
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="services">Services (comma-separated)</label>
  <input
    id="services"
    name="services"
    type="text"
    value={formData.services.join(', ')}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        services: e.target.value.split(',').map((s) => s.trim()),
      }))
    }
    required
    placeholder="e.g., Bridal wear, Saree draping"
    style={styles.input}
  />
</div>


          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={styles.link}>
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default ResellerRegister;
