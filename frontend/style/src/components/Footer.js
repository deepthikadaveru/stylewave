import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Importing icons

const Footer = () => {
  return (
    <footer style={footerStyles}>
      <div style={footerContentStyles}>
        <div style={footerTextStyles}>
          <p>© 2025 Stylewave. All rights reserved.</p>
          <p>Crafted with 💖 for fashion creators</p>
        </div>
        
        <div style={footerLinksStyles}>
          <ul style={footerLinksListStyles}>
            <li style={footerLinkItemStyles}><a href="/contact-us" style={footerLinkStyles}>Contact Us</a></li>
            <li style={footerLinkItemStyles}><a href="/privacy-policy" style={footerLinkStyles}>Privacy Policy</a></li>
            <li style={footerLinkItemStyles}><a href="/terms-of-service" style={footerLinkStyles}>Terms of Service</a></li>
          </ul>
        </div>

        <div style={footerSocialStyles}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialIconStyles}><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={socialIconStyles}><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={socialIconStyles}><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={socialIconStyles}><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
};

// CSS styles in JS
const footerStyles = {
  backgroundColor: "#282c34",
  color: "white",
  padding: "40px 20px",
  textAlign: "center",
};

const footerContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const footerTextStyles = {
  marginBottom: "20px",
};

const footerLinksStyles = {
  marginBottom: "20px",
};

const footerLinksListStyles = {
  listStyleType: "none",
  padding: "0",
};

const footerLinkItemStyles = {
  display: "inline-block",
  margin: "0 15px",
};

const footerLinkStyles = {
  color: "#f1f1f1",
  textDecoration: "none",
  fontWeight: "600",
  transition: "color 0.3s ease",
};

const footerSocialStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const socialIconStyles = {
  fontSize: "1.5rem",
  color: "white",
  transition: "color 0.3s ease",
};

const hoverStyles = {
  color: "#ff7f50", // A soft orange for hover effect
};

export default Footer;
