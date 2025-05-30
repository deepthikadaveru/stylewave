import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CategoryProfiles = () => {
  const { role } = useParams();  // Getting the role from the URL params
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Fetch profiles based on role
    const fetchProfiles = async () => {
      const response = await fetch(`/api/users/role/${role}`);
      const data = await response.json();
      setProfiles(data);  // Store the fetched profiles
    };

    fetchProfiles();
  }, [role]);

  return (
    <div className="category-profiles-container">
      <h1>{role} Profiles</h1>
      <div className="profiles-grid">
        {profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <div key={index} className="profile-card">
              <img src={profile.image || "https://source.unsplash.com/300x300/?fashion"} alt={profile.name} />
              <h3>{profile.name}</h3>
              <p>{profile.bio}</p>
              <span className="badge">{profile.category}</span>
            </div>
          ))
        ) : (
          <p>No profiles found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProfiles;
