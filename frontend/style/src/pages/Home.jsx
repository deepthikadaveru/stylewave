import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

// Sample images for demonstration
const heroImages = [
  { url: '/slider1.jpg', text: 'Tailors: Precision & Craftsmanship' },
  { url: '/slider2.jpg', text: 'Designers: Creativity & Innovation' },
  { url: '/slider3.jpg', text: 'Resellers: Style & Reach' }
];

const user1 = '/tailor.jpg';
const user2 = '/designer.jpg';
const user3 = '/reseller.jpg';

function AppLayout({ children }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];

    const isPublic = publicRoutes.includes(location.pathname);
    if (!isLoggedIn && !isPublic) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [location.pathname, isLoggedIn]);

  return (
    <>
      {children}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

const Home = () => {
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/designers');
        const data = await response.json();
        setDesigners(data);
      } catch (error) {
        console.error('Error fetching designers:', error);
      }
    };
    fetchDesigners();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const featuredUsers = [
    { name: "Tailors", type: "", image: user1, link: "/tailors" },
    { name: "Designers", type: "", image: user2, link: "/designers" },
    { name: "Resellers", type: "", image: user3, link: "/resellers" }
  ];

  return (
    <div className="page-container">
      {/* Hero Slider */}
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {heroImages.map((img, i) => (
            <div key={i} className="hero-slide">
              <div className="slide-bg-blur" style={{
                backgroundImage: `url(${img.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '60vh',
                position: 'relative'
              }}></div>
              <div className="slide-text">
                <h2>{img.text}</h2>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Featured Creators */}
      <h2 className="section-title">🌟 Featured Creators</h2>
      <div className="card-container">
        {featuredUsers.map((user, index) => (
          <div key={index}>
            <Link to={user.link} className="card-link">
              <div className="user-card">
                <img src={user.image} alt={user.name} />
                <h3>{user.name}</h3>
                <p>{user.type}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Motto */}
      <section className="motto-section">
        <div className="motto-content">
          <h2>Our Motto</h2>
          <p>
            Empowering fashion creators to shine online. Stylewave is your digital runway,
            where tailors, designers, and resellers come together to collaborate, showcase
            their unique creations, and inspire the world. Whether you’re a tailor crafting
            custom pieces, a designer pushing the boundaries of style, or a reseller offering
            the latest trends, Stylewave is the place to connect, create, and grow your
            business. Join us today and be part of the fashion revolution.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"Stylewave has transformed my business. The exposure is incredible!"</p>
            <h4>- Alex, Designer</h4>
          </div>
          <div className="testimonial-card">
            <p>"Connecting with clients has never been easier. Highly recommend!"</p>
            <h4>- Maria, Tailor</h4>
          </div>
          <div className="testimonial-card">
            <p>"A fantastic platform for resellers. My sales have doubled!"</p>
            <h4>- Raj, Reseller</h4>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        :root {
          --bg-color: #ffffff;
          --text-color: #000000;
          --card-bg: #f9f9f9;
          --btn-primary-bg: #000000;
          --btn-primary-text: #ffffff;
          --btn-outline-bg: transparent;
          --btn-outline-text: #000000;
          --btn-outline-border: #000000;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: Arial, sans-serif;
        }

        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 1000;
        }

        .slider-wrapper { position: relative; }

        .hero-slide {
          position: relative;
          width: 100%;
          height: 60vh;
          overflow: hidden;
          
        }

        .slide-bg-blur {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(10px);
          transform: scale(1.3);
          z-index: 1;
          height: 100%;
          object-fit: cover;
        }

        .slide-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          color: #fff;
          font-family: 'Tisa', serif;
          font-size: 3rem;
          font-weight: 600;
          text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .section-title {
          text-align: center;
          margin: 40px 0 20px;
          color: #333;
        }

        .card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .user-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          width: 250px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
           transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
          .user-card h3, .user-card p {
  color: #000; /* Set text color to black */
}
 

        .user-card img {
          width: 100%;
          border-radius: 10px;
        }

        .user-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

        .creator-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.creator-card:hover {
  transform: scale(1.05); /* Slight zoom */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}


        .motto-section {
          padding: 40px 20px;
          text-align: center;
        }

        .motto-section h2 {
          font-size: 28px;
          margin-bottom: 24px;
          color: #4a2c2a;
        }

        .motto-content {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          padding: 24px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          font-size: 17px;
          color:rgb(0, 0, 0);
          font-family: Arial, sans-serif;
        }

        .testimonials-section {
          padding: 40px 0;
        }

        .testimonials-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .testimonial-card {
          background-color: var(--card-bg);
          padding: 20px;
          border-radius: 10px;
          width: 300px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .testimonial-card p {
          font-style: italic;
          color: #333;
        }

        .testimonial-card h4 {
          margin-top: 10px;
          font-weight: bold;
          color: #4a2c2a;
        }
      `}</style>
    </div>
  );
};

export default Home;
