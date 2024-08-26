import React, { useState, useEffect } from 'react';
import './Navbar.css';
import home from '../../../images/home (3).png';
import target from '../../../images/target.png';
import history from '../../../images/icons8-history-90.png';
import help from '../../../images/icons8-help-100.png';
import logout from '../../../images/logout 1.png';
import searchUser from '../../../images/userDashboard.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const getIconClass = (path) => {
    return location.pathname === path ? 'icon-container active' : 'icon-container';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="home-link">
          <div className={getIconClass('/home')}>
            <img src={home} className="home-icon" alt="Home" />
          </div>
        </Link>
        <Link to="/user-dashboard" className="home-link">
          <div className={getIconClass('/user-dashboard')}>
            <img src={searchUser} className="search-icon" alt="User Dashboard" />
          </div>
        </Link>
        <Link to="/objectives" className="home-link">
          <div className={getIconClass('/objectives')}>
            <img src={target} className="target-icon" alt="Objectives" />
          </div>
        </Link>
        <Link to="/history" className="home-link">
          <div className={getIconClass('/history')}>
            <img src={history} className="history-icon" alt="History" />
          </div>
        </Link>
        <Link to="/faqs" className="home-link">
          <div className={getIconClass('/faqs')}>
            <img src={help} className="help-icon" alt="Help" />
          </div>
        </Link>
        <Link to="/logout" className="home-link">
          <div className={getIconClass('/logout')}>
            <img src={logout} className="logout-icon" alt="Logout" />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
