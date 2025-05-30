import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-details-container">
      <h2>{profile.name}</h2>
      <p>{profile.role} • {profile.category}</p>
      <p><strong>Location:</strong> {profile.location}</p>
      <p>{profile.bio}</p>

      <h3>Previous Work</h3>
      <div className="gallery">
        {profile.works.map((img, index) => (
          <img key={index} src={img} alt={`Work ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
