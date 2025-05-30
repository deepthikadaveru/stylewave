import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TailorRegister = () => {
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
  
      // 1. Required text fields
      form.append('name',        formData.name);
      form.append('brand',       formData.brand);
      form.append('email',       formData.email);
      form.append('phone',       formData.phone);
      form.append('password',    formData.password);
      form.append('description', formData.description);
  
      // 2. Location & contact
      form.append('address', formData.address);
      form.append('city',    formData.city);
      form.append('lat',     formData.lat.toString());
      form.append('lng',     formData.lng.toString());
  
      // 3. Social links
      form.append('instagram', formData.instagram);
      form.append('facebook',  formData.facebook);
      form.append('website',   formData.website);
  
      // 4. Hours, fare, services
      form.append('workingHours', formData.workingHours);
      form.append('averageFare',  formData.averageFare.toString());
  
      // services: send as repeated fields so multer gives you an array
      formData.services.forEach(svc => {
        if (svc.trim()) form.append('services', svc.trim());
      });
  
      // 5. Files
      if (formData.profilePicture) {
        form.append('profilePicture', formData.profilePicture);
      }
      formData.images.forEach(file => {
        form.append('images', file);
      });

      console.log('🛰️ FormData payload:');
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }
  
      // 6. Do the POST (no manual headers!)
      await axios.post(`${BASE_URL}/api/register/tailor`, form);
  
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
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
    formGroup: {
      marginBottom: '20px',
    },
    fileInput: {
      padding: '10px 14px',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Tailor Sign Up</h2>
        {error && <div style={styles.errorText}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              onChange={handleProfilePictureChange}
              accept="image/*"
              style={styles.fileInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="images">Additional Images</label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              onChange={handleImagesChange}
              accept="image/*"
              style={styles.fileInput}
            />
          </div>

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
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

          <div style={styles.formGroup}>
  <label htmlFor="lat">Latitude</label>
  <input
    id="lat"
    name="lat"
    type="number"
    value={formData.lat}
    onChange={handleChange}
    required
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="lng">Longitude</label>
  <input
    id="lng"
    name="lng"
    type="number"
    value={formData.lng}
    onChange={handleChange}
    required
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="instagram">Instagram URL</label>
  <input
    id="instagram"
    name="instagram"
    type="url"
    value={formData.instagram}
    onChange={handleChange}
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="facebook">Facebook URL</label>
  <input
    id="facebook"
    name="facebook"
    type="url"
    value={formData.facebook}
    onChange={handleChange}
    style={styles.input}
  />
</div>

<div style={styles.formGroup}>
  <label htmlFor="website">Website URL</label>
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
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#222')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#000')}
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


export default TailorRegister;
