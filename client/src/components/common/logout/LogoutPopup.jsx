import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutPopup.css";

const LogoutPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup-container">
        <h2 className="logout-popup-title">Confirm Logout</h2>
        <p className="logout-popup-text">Are you sure you want to log out?</p>
        <div className="logout-popup-buttons">
          <button className="logout-popup-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="logout-popup-button confirm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
