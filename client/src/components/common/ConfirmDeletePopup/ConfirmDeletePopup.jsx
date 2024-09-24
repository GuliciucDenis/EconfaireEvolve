import React from "react";
import { Button } from "@nextui-org/react";
import './ConfirmDeletePopup.css';

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Confirm Delete</h3>
        <p className="popup-message1">
          Are you sure you want to delete the selected user(s)? 
        </p>
        <p className="popup-message2">This action cannot be undone.</p>
        <div className="popup-actions">
          <Button auto flat className="popup-btn-cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button auto className="popup-btn-confirm" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
