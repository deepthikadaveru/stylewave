import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Explore = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, d, r] = await Promise.all([
          axios.get("http://localhost:5000/api/explore/tailors"),
          axios.get("http://localhost:5000/api/explore/designers"),
          axios.get("http://localhost:5000/api/explore/resellers"),
        ]);
        setCreators([...t.data, ...d.data, ...r.data].sort(() => 0.5 - Math.random()));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  

  const buildUrl = (creator, src) =>
    src.startsWith("/images/")
      ? `http://localhost:5000${src}`
      : `http://localhost:5000/images/${creator.type.toLowerCase()}s/${src}`;

  const styles = {
    page: { background: "#fff", padding: "20px", fontFamily: "Arial, sans-serif" },
    title: { textAlign: "center", margin: "0 0 20px", color: "#222" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
      gap: 30,
    },
    card: {
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: "10px 15px",
      borderBottom: "1px solid #eee",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: 10,
      border: "2px solid #ddd",
    },
    name: { fontWeight: "bold", fontSize: "1rem", margin: 0 },
    slider: {
      display: "flex",
      overflowX: "auto",
      scrollSnapType: "x mandatory",
    },
    slideImg: {
      flex: "0 0 100%",
      maxHeight: 500,
      objectFit: "cover",
      scrollSnapAlign: "center",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 15px",
      borderTop: "1px solid #eee",
    },
    role: { color: "#555", fontSize: "0.9rem" },
    link: {
      textDecoration: "none",
      padding: "6px 12px",
      background: "#28a745",
      color: "#fff",
      borderRadius: 5,
      fontSize: "0.9rem",
    },
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Discover Creators</h1>
      <div style={styles.grid}>
        {creators.map((c) => {
          const headerImg = buildUrl(c, c.profilePicture);
          // pick up to 5 images for the slider
          const imgs = (c.portfolioImages || c.images || []).slice(0, 5);

          return (
            <div key={c._id} style={styles.card}>
              {/* Header */}
              <div style={styles.header}>
                <img
                  src={headerImg}
                  alt={c.name}
                  onError={(e) => (e.currentTarget.src = "http://localhost:5000/images/default.jpeg")}
                  style={styles.avatar}
                />
                <p style={styles.name}>{c.name}</p>
              </div>

              {/* Slider */}
              <div style={styles.slider}>
                {imgs.map((src, i) => (
                  <img
                    key={i}
                    src={buildUrl(c, src)}
                    alt={`${c.name} ${i + 1}`}
                    onError={(e) => (e.currentTarget.src = "http://localhost:5000/images/default.jpeg")}
                    style={styles.slideImg}
                  />
                ))}
                {!imgs.length && (
                  <div
                    style={{
                      ...styles.slideImg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                    }}
                  >
                    No portfolio images
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={styles.footer}>
                <span style={styles.role}>{c.role}</span>
                <Link to={`/${c.type.toLowerCase()}/${c._id}`} style={styles.link}>
                  View Profile
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
