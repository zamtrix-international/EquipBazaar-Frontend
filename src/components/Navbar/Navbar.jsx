// components/Navbar/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-yellow">Equip</span>
          <span className="logo-black">Bazzar</span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/equipment" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Equipment
          </Link>
          <Link to="/#how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
        </div>

        <div className="navbar-buttons">
          {!isLoggedIn ? (
            <>
              <button 
                className="btn-outline" 
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                Login
              </button>
              <button 
                className="btn-outline" 
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="navbar-user-actions">
              <Notifications />
              <button className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;