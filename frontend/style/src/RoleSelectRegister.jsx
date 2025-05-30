import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/form.css';

const RoleSelectRegister = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <div className="role-select-container" style={{
      backgroundImage: "url('/images/register-bg.jpg')",
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '2rem',
    }}>
      <h2 className="role-title">Choose Your Role to Register</h2>
      <div className="role-cards">
        <div className="role-card" onClick={() => handleSelect('tailor')}>Tailor</div>
        <div className="role-card" onClick={() => handleSelect('designer')}>Designer</div>
        <div className="role-card" onClick={() => handleSelect('reseller')}>Reseller</div>
        <div className="role-card" onClick={() => handleSelect('user')}>User</div>
      </div>
    </div>
  );
};

export default RoleSelectRegister;
