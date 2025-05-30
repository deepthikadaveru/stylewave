import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">Stylewave</Link>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>

        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/register">Join</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
            <li>
              <Link to="/account">My Account</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
