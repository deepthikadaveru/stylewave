import React from 'react';
import { Link } from 'react-router-dom';

const roles = [
  {
    name: 'Tailor',
    image: `${process.env.PUBLIC_URL}/tselect.jpg`,
    description: 'Skilled in fabric and garment creation.',
    link: '/register/tailor',
  },
  {
    name: 'Designer',
    image: `${process.env.PUBLIC_URL}/dselect.jpg`,
    description: 'Creative mind behind fashion collections.',
    link: '/register/designer',
  },
  {
    name: 'Reseller',
    image: `${process.env.PUBLIC_URL}/rselect.jpg`,
    description: 'Distributor and seller of fashion products.',
    link: '/register/reseller',
  },
  {
    name: 'User',
    image: `${process.env.PUBLIC_URL}/uselect.jpg`,
    description: 'A fashion enthusiast and shopper.',
    link: '/register/user',
  },
];

const RoleSelectRegister = () => {
  return (
    <div className="page-container">
      <section className="hero-overlay-top">
        <h1>Choose Your Role</h1>
        <p>Select the role that best fits your fashion journey.</p>
        <p className="tagline">Empower your fashion identity – one role at a time.</p>
      </section>

      <div className="grid-container">
        {roles.map((role, index) => (
          <Link to={role.link} key={index} className="role-card-link">
            <div className="role-card">
              <img src={role.image} alt={role.name} className="role-image" />
              <h3>{role.name}</h3>
              <p>{role.description}</p>
              <button className="btn">Register as {role.name}</button>
            </div>
          </Link>
        ))}
      </div>

      <div className="why-choose">
        <div className="why-item">
          <span role="img" aria-label="design">👗</span>
          <p>Custom Styles</p>
        </div>
        <div className="why-item">
          <span role="img" aria-label="fast">🚀</span>
          <p>24/7 Assistance</p>
        </div>
        <div className="why-item">
          <span role="img" aria-label="chat">💬</span>
          <p>Direct Chat</p>
        </div>
      </div>

      <footer className="footer-note">
        Already a member? <Link to="/login">Log in here</Link>
      </footer>

      <style>{`
        :root {
          --bg-color: #ffffff;
          --text-color: #000000;
          --card-bg: #fefefe;
          --btn-color: #222;
          --btn-hover-bg: #000;
          --btn-hover-text: #fff;
        }

        [data-theme='dark'] {
          --bg-color: #121212;
          --text-color: #ffffff;
          --card-bg: rgb(105, 101, 101);
          --btn-color: #ffffff;
        }

        .page-container {
          background: var(--bg-color) url('/bg-pattern.png') repeat;
          background-size: contain;
          color: var(--text-color);
          padding: 20px 4%;
          min-height: 100vh;
        }

        .hero-overlay-top {
          background: linear-gradient(135deg, #151515, #292929);
          color: white;
          padding: 8px 15px;
          text-align: center;
          border-radius: 16px;
          margin-bottom: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .tagline {
          font-style: italic;
          margin-top: 8px;
          font-size: 1rem;
          color: #ccc;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .role-card-link {
          text-decoration: none;
        }

        .role-card {
          background: var(--card-bg);
          padding: 18px 16px;
          border-radius: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .role-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
        }

        .role-image {
          width: 100%;
          height: 250px;
          max-width: 320px;
          border-radius: 12px;
          margin-bottom: 14px;
          object-fit: cover;
        }

        .role-card h3 {
  margin: 8px 0 6px;
  font-size: 1.2rem;
  color: var(--text-color); /* Use the theme text color */
}

.role-card p {
  font-size: 0.95rem;
  margin: 0 0 12px;
  color: #444; /* Dark text color */
}

.role-card a {
  color: var(--text-color); /* Ensure link text is using the theme text color */
}

.role-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.role-card h3, .role-card p {
  color: var(--text-color); /* Ensure all text inside the card is consistent */
}


        h3 {
          margin: 8px 0 6px;
          font-size: 1.2rem;
        }

        p {
          font-size: 0.95rem;
          margin: 0 0 12px;
          color: white;
        }

        .btn {
          margin-top: auto;
          padding: 10px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          border: 2px solid var(--btn-color);
          background: transparent;
          color: var(--btn-color);
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 200px;
        }

        .btn:hover {
          background: var(--btn-hover-bg);
          color: var(--btn-hover-text);
        }

        .why-choose {
          display: flex;
          justify-content: space-around;
          margin-top: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .why-item {
          text-align: center;
          width: 120px;
        }

        .why-item span {
          font-size: 2rem;
        }

        .why-item p {
          margin-top: 8px;
          font-size: 0.95rem;
          color: #555;
        }

        .footer-note {
          margin-top: 40px;
          text-align: center;
          font-size: 0.9rem;
          color: #888;
        }

        .footer-note a {
          color: var(--btn-color);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RoleSelectRegister;
