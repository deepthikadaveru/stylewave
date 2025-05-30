import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("Sending...");

    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      setFormStatus(response.data.message);
      setFormData({ name: "", email: "", message: "" }); // Reset the form
    } catch (error) {
      setFormStatus("Something went wrong, please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </label>
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
        {formStatus && <p style={styles.statusText}>{formStatus}</p>}
      </div>
    </div>
  );
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
    maxWidth: '600px',
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
  label: {
    display: 'block',
    marginBottom: '15px',
    fontSize: '16px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    marginTop: '5px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    marginTop: '5px',
    minHeight: '120px',
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
    marginTop: '20px',
  },
  statusText: {
    textAlign: 'center',
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default ContactUs;
