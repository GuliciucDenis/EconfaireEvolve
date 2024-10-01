import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutPopup.css";
import { useTranslation } from "react-i18next";

const LogoutPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {t}=useTranslation();

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup-container">
        <h2 className="logout-popup-title">{t('logoutPopup.title')}</h2>
        <p className="logout-popup-text">{t('logoutPopup.areYouSure')}</p>
        <div className="logout-popup-buttons">
          <button className="logout-popup-button cancel" onClick={onClose}>
            {t('logoutPopup.cancel')}
          </button>
          <button
            className="logout-popup-button confirm"
            onClick={handleLogout}
          >
            {t('logoutPopup.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
