import React from "react";
import { Button } from "@nextui-org/react";
import './ConfirmDeletePopup.css';
import { useTranslation } from "react-i18next";

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm }) => {
  const {t}=useTranslation();
  if (!isOpen) return null;
  
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">{t('confirmDeletePopup.title')}</h3>
        <p className="popup-message1">
        {t('confirmDeletePopup.message1')} 
        </p>
        <p className="popup-message2">{t('confirmDeletePopup.message2')}</p>
        <div className="popup-actions">
          <Button auto flat className="popup-btn-cancel" onClick={onClose}>
          {t('confirmDeletePopup.cancel')}
          </Button>
          <Button auto className="popup-btn-confirm" onClick={onConfirm}>
          {t('confirmDeletePopup.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
