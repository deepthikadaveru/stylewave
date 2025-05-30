import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={pageStyles}>
      <h1 style={headerStyles}>Privacy Policy</h1>
      <div style={contentStyles}>
        <p><strong>Introduction:</strong> We value your privacy and are committed to protecting your personal information.</p>
        <p><strong>What Information We Collect:</strong> We collect information like your name, email, and usage data.</p>
        <p><strong>How We Use Your Information:</strong> Your information is used to improve user experience, contact you, and deliver services.</p>
        <p><strong>Sharing Information:</strong> We do not share your personal information with third parties unless required by law.</p>
        <p><strong>Your Rights:</strong> You have the right to access, update, or delete your personal information.</p>
        <p><strong>Changes to Privacy Policy:</strong> We reserve the right to update our privacy policy. Please check this page regularly.</p>
      </div>
    </div>
  );
};

const pageStyles = {
  padding: "40px",
  backgroundColor: "#fff",
  fontFamily: "Arial, sans-serif"
};

const headerStyles = {
  textAlign: "center",
  color: "#333"
};

const contentStyles = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#666",
  maxWidth: "800px",
  margin: "0 auto"
};

export default PrivacyPolicy;
