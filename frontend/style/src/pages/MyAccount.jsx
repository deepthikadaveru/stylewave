import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DEFAULT_PROFILE_IMG = `${BASE_URL}/images/default.jpeg`;

const MyAccount = () => {
  const { user, logout, refreshUser } = useAuth();
  const [tailorData, setTailorData] = useState(null);
  const [designerData, setDesignerData] = useState(null);
  const [resellerData, setResellerData] = useState(null);
  const [form, setForm] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_PROFILE_IMG);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);


  useEffect(() => {
    if (!user) return;
    const url = typeof user.profilePicture === 'string'
  ? `${BASE_URL}${user.profilePicture}?t=${Date.now()}`
  : user.profilePicture?.filename
    ? `${BASE_URL}/images/users/${user.profilePicture.filename}?t=${Date.now()}`
    : DEFAULT_PROFILE_IMG;

    setImagePreview(url);

    if (user.role === 'tailor') {
      axios.get(`${BASE_URL}/api/tailors/${user.id}`)
        .then(res => {
          setTailorData(res.data);
          const imageUrl = res.data.profilePicture
          ? `${BASE_URL}${
              res.data.profilePicture.startsWith('/images/tailors')
                ? res.data.profilePicture
                : `/images/tailors/${res.data.profilePicture}`
            }?t=${Date.now()}`
          : DEFAULT_PROFILE_IMG;
        


        setImagePreview(imageUrl);
          setForm({
            brand: res.data.brand || '',
            description: res.data.description || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            city: res.data.city || '',
            workingHours: res.data.workingHours || '',
            averageFare: res.data.averageFare || '',
            services: (res.data.services || []).join(','),
            instagram: res.data.instagram || '',
            facebook: res.data.facebook || '',
            website: res.data.website || '',
          });
        })
        .catch(err => {
          console.error('Error fetching tailor data:', err);
          setError('Failed to load tailor details');
        });
    }
    if (user.role === 'designer') {
      axios.get(`${BASE_URL}/api/designers/${user.id}`)
        .then(res => {
          setDesignerData(res.data);
    
          const imageUrl = res.data.profilePicture
  ? `${BASE_URL}${
      res.data.profilePicture.startsWith('/images/designers')
        ? res.data.profilePicture
        : `/images/designers/${res.data.profilePicture}`
    }?t=${Date.now()}`
  : DEFAULT_PROFILE_IMG;


    
          setImagePreview(imageUrl);
          setForm({
            brand: res.data.brand || '',
            description: res.data.description || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            city: res.data.city || '',
            workingHours: res.data.workingHours || '',
            averageFare: res.data.averageFare || '',
            services: (res.data.services || []).join(','),
            instagram: res.data.instagram || '',
            facebook: res.data.facebook || '',
            website: res.data.website || '',
          });
        })
        .catch(err => {
          console.error('Error fetching designer data:', err);
          setError('Failed to load designer details');
        });
    }
    if (user.role === 'reseller') {
      axios.get(`${BASE_URL}/api/resellers/${user.id}`)
        .then(res => {
          setResellerData(res.data);
    
          const imageUrl = res.data.profilePicture
  ? `${BASE_URL}${
      res.data.profilePicture.startsWith('/images/resellers')
        ? res.data.profilePicture
        : `/images/resellers/${res.data.profilePicture}`
    }?t=${Date.now()}`
  : DEFAULT_PROFILE_IMG;


    
          setImagePreview(imageUrl);
          setForm({
            brand: res.data.brand || '',
            description: res.data.description || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            city: res.data.city || '',
            workingHours: res.data.workingHours || '',
            averageFare: res.data.averageFare || '',
            services: (res.data.services || []).join(','),
            instagram: res.data.instagram || '',
            facebook: res.data.facebook || '',
            website: res.data.website || '',
          });
        })
        .catch(err => {
          console.error('Error fetching reseller data:', err);
          setError('Failed to load reseller details');
        });
    }
    
  }, [user]);

 

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      

      const payload = { ...form, services: form.services.split(',').map(s => s.trim()) };
      const res = await axios.put(`${BASE_URL}/api/${user.role}s/${user.id}`, payload);
      setTailorData(res.data);
      alert('Profile updated!');
      await refreshUser();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handlePortfolioSelect = (e) => setPortfolioFiles(Array.from(e.target.files));

  const handlePortfolioUpload = async () => {
    if (!portfolioFiles.length) return;
    const data = new FormData();
    portfolioFiles.forEach(file => data.append('images', file));
    setUploading(true);
    setError('');

    try {
      const res = await axios.post(
        `${BASE_URL}/api/${user.role}s/${user.id}/portfolio`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (user.role === 'tailor')      setTailorData(res.data);
      else if (user.role === 'designer') setDesignerData(res.data);
      else if (user.role === 'reseller') setResellerData(res.data);
      setPortfolioFiles([]);
      alert('Portfolio updated!');
    } catch (err) {
      console.error('Portfolio upload failed:', err);
      setError('Portfolio upload failed. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const renderAccountInfo = (role) => {
    const links = <>
      <Link to="/messages" style={styles.linkBtn}>Messages</Link>
      <Link to="/forgot-password" style={styles.linkBtn}>Change Password</Link>
    </>;

    if (role === 'tailor') {
      if (!tailorData || !form) return <p style={styles.loading}>Loading…</p>;

      return <>
        <h2 style={styles.subheading}>Tailor Dashboard</h2>
        {['brand', 'description', 'phone', 'address', 'city', 'workingHours', 'averageFare', 'services', 'instagram', 'facebook', 'website'].map(field => (
          <label key={field} style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {field === 'description'
              ? <textarea name={field} value={form[field]} onChange={handleChange} style={styles.textarea} />
              : <input name={field} value={form[field]} onChange={handleChange} style={styles.input} />
            }
          </label>
        ))}
        <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>

        <p style={styles.paragraph}><strong>Ratings & Reviews:</strong></p>
        <ul style={{ marginLeft: '1.5rem' }}>
          {tailorData.ratings.map((r, i) => <li key={i}><strong>{r.user}</strong>: {r.rating} ⭐ – {r.comment}</li>)}
        </ul>

        <p style={styles.paragraph}><strong>Portfolio Images:</strong></p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {tailorData.images.map((src, i) => (
           <img
           key={i}
           src={
             src.startsWith('/images/tailors') 
               ? `${BASE_URL}${src}` 
               : `${BASE_URL}/images/tailors/${src}`
           }
           alt={`portfolio-${i}`}
           style={styles.portfolioImg}
         />
         
          ))}
        </div>
       <input type="file" multiple accept="image/*" onChange={handlePortfolioSelect} style={{ marginTop: 10 }} disabled={uploading} />
        <button onClick={handlePortfolioUpload} style={styles.saveBtn} disabled={uploading || !portfolioFiles.length}>Upload Portfolio</button>
        {links}
      </>;
    }

    if (role === 'designer') {
      if (!designerData || !form) return <p style={styles.loading}>Loading…</p>;

  return <>
    <h2 style={styles.subheading}>Designer Dashboard</h2>
    {['brand', 'description', 'phone', 'address', 'city', 'workingHours', 'averageFare', 'services', 'instagram', 'facebook', 'website'].map(field => (
      <label key={field} style={styles.label}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
        {field === 'description'
          ? <textarea name={field} value={form[field]} onChange={handleChange} style={styles.textarea} />
          : <input name={field} value={form[field]} onChange={handleChange} style={styles.input} />
        }
      </label>
    ))}
    <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>

    <p style={styles.paragraph}><strong>Ratings & Reviews:</strong></p>
    <ul style={{ marginLeft: '1.5rem' }}>
      {designerData.ratings.map((r, i) => (
        <li key={i}><strong>{r.user}</strong>: {r.rating} ⭐ – {r.comment}</li>
      ))}
    </ul>

    <p style={styles.paragraph}><strong>Portfolio Images:</strong></p>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
    {designerData.images.map((src, i) => (
  <img
  key={i}
  src={
    src.startsWith('/images/designers') 
      ? `${BASE_URL}${src}` 
      : `${BASE_URL}/images/designers/${src}`
  }
  alt={`portfolio-${i}`}
  style={styles.portfolioImg}
/>
))}
    </div>
    <input type="file" multiple accept="image/*" onChange={handlePortfolioSelect} style={{ marginTop: 10 }} disabled={uploading} />
    <button onClick={handlePortfolioUpload} style={styles.saveBtn} disabled={uploading || !portfolioFiles.length}>Upload Portfolio</button>

    {links}
  </>;

    };
    if (role === 'reseller'){
      if (role === 'reseller') {
        if (!resellerData || !form) return <p style={styles.loading}>Loading…</p>;
      
        return <>
          <h2 style={styles.subheading}>Reseller Dashboard</h2>
          {[
            'brand', 'description', 'phone', 'address', 'city', 'workingHours', 'averageFare', 'services', 'instagram', 'facebook', 'website'
          ].map(field => (
            <label key={field} style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {field === 'description'
                ? <textarea name={field} value={form[field]} onChange={handleChange} style={styles.textarea} />
                : <input name={field} value={form[field]} onChange={handleChange} style={styles.input} />
              }
            </label>
          ))}
          <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>
      
          <p style={styles.paragraph}><strong>Ratings & Reviews:</strong></p>
          <ul style={{ marginLeft: '1.5rem' }}>
            {resellerData.ratings.map((r, i) => (
              <li key={i}><strong>{r.user}</strong>: {r.rating} ⭐ – {r.comment}</li>
            ))}
          </ul>
      
          <p style={styles.paragraph}><strong>Portfolio Images:</strong></p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {resellerData.images.map((src, i) => (
  <img
  key={i}
  src={
    src.startsWith('/images/resellers') 
      ? `${BASE_URL}${src}` 
      : `${BASE_URL}/images/resellers/${src}`
  }
  alt={`portfolio-${i}`}
  style={styles.portfolioImg}
/>
))}

          </div>
          <input type="file" multiple accept="image/*" onChange={handlePortfolioSelect} style={{ marginTop: 10 }} disabled={uploading} />
          <button onClick={handlePortfolioUpload} style={styles.saveBtn} disabled={uploading || !portfolioFiles.length}>Upload Portfolio</button>
          {links}
        </>;
      }
      
    }

    return <>
  <h2 style={styles.subheading}>User Dashboard</h2>
  <p style={styles.paragraph}>Explore your account settings and features.</p>
  <Link to="/messages" style={styles.linkBtn}>Messages</Link>
  <Link to="/forgot-password" style={styles.linkBtn}>Change Password</Link>
  <div style={styles.buttonGroup}>
    

  </div>
</>;

  };

  return <div style={styles.container}>
    <div style={styles.card}>
      <h1 style={styles.heading}>Hello, {user.name}</h1>
      <div style={styles.profileWrapper}>
      

<img
  src={imagePreview}
  alt="Profile"
  style={styles.profilePic}
  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_IMG; }}
/>


      
      </div>
      <p><strong>Email:</strong> {user.email}</p>
      <div>{renderAccountInfo(user.role)}</div>
      <button onClick={logout} style={styles.logoutBtn}>Logout</button>
    </div>
  </div>;
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

  inputFile: {
    marginTop: 10,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px',
  },
  saveBtn: {
    marginTop: 10,
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    marginBottom: 20,
  },
  linkBtn: {
    padding: '8px 16px',
    margin: '10px 8px 0 0',
    backgroundColor: '#000',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: '',
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
    backgroundColor: '#000', // Change this to #000 (black) as in login page
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  portfolioImg: {
    width: '200px',   // Define the width of the image
    height: '150px',  // Define the height of the image
    objectFit: 'cover', // Optional: ensures the image maintains its aspect ratio without distortion
    borderRadius: '8px', // Optional: gives the image rounded corners
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

  // Profile Page and Card Styles
  card: {
    maxWidth: 800,
    width: '100%',
    background: '#fff',
    padding: '2.5rem',
    borderRadius: 16,
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  profileWrapper: {
    textAlign: 'center',
  },
  profileWrapper: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',  // Centers the profile picture horizontally
    alignItems: 'center',      // Centers the profile picture vertically if needed
    flexDirection: 'column',   // Stacks the profile picture and other content vertically
  },
  
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: '50%',
    marginBottom: 15,
    objectFit: 'cover',        // Ensures the image fits well within the circle
  },
  
  logoutBtn: {
    background: '#dc3545', // Red logout button
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    marginTop: 15,
    width: '65%'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  buttonLink: {
    backgroundColor: '#000', // Use the blue button style here for links
    color: '#fff',
    padding: '6px 10px',
    textAlign: 'center',
    borderRadius: 5,
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default MyAccount;
