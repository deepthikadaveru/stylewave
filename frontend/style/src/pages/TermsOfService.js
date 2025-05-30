import React from "react";

const TermsOfService = () => {
  return (
    <div style={pageStyles}>
      <h1 style={headerStyles}>Terms of Service</h1>
      <div style={contentStyles}>
        <p><strong>Introduction:</strong> Welcome to Stylewave! By using our services, you agree to our terms and conditions.</p>
        <p><strong>Account Registration:</strong> You must provide accurate and complete information during registration.</p>
        <p><strong>User Conduct:</strong> You agree not to engage in any activity that could harm the website or other users.</p>
        <p><strong>Intellectual Property:</strong> All content on this website is owned by Stylewave. You may not use it without permission.</p>
        <p><strong>Termination:</strong> We reserve the right to suspend or terminate your access if you violate our terms.</p>
        <p><strong>Limitation of Liability:</strong> Stylewave is not responsible for any direct, indirect, or incidental damages.</p>
        <p><strong>Changes to Terms:</strong> We may update these terms from time to time. Please review this page periodically.</p>
      </div>
    </div>
  );
};

const pageStyles = {
  padding: "40px",
  backgroundColor: "#f9f9f9",
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

export default TermsOfService;
