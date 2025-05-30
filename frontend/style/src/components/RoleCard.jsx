// src/components/RoleCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RoleCard = ({ role, image, description, link }) => {
  return (
    <div className="role-card">
      <img src={image} alt={role} />
      <h3>{role}</h3>
      <p>{description}</p>
      <Link to={link}>Register as {role}</Link>
    </div>
  );
};

export default RoleCard;
