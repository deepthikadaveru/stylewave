import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('password', formData.password);
      if (image) {
        form.append('profilePicture', image);
      }
  
      const res = await axios.post(`${BASE_URL}/register/user`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || 'Registration failed');
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
      backgroundColor: '#f4f4f4',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
      backgroundBlendMode: 'overlay',
    },
    formWrapper: {
      background: 'rgba(255, 255, 255, 0.8)', // semi-transparent for glass effect
      borderRadius: '15px',
      padding: '35px 30px',
      width: '100%',
      maxWidth: '450px',
      backdropFilter: 'blur(10px)', // glass effect
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
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Customer Sign Up</h2>
        {error && <div style={styles.errorText}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
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
            <label htmlFor="email" style={styles.label}>Email</label>
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
            <label htmlFor="password" style={styles.label}>Password</label>
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
  <label htmlFor="profileImage">Upload Profile Image (optional)</label>
  <input
    type="file"
    id="profileImage"
    name="profilePicture"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
  />
  {image && (
    <div style={{ marginTop: '10px' }}>
      <p>Selected Image:</p>
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        style={{ width: '150px', borderRadius: '8px' }}
      />
    </div>
  )}
</div>


          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading && styles.buttonDisabled)
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
