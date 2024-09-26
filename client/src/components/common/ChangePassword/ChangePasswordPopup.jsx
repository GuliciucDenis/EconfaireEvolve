import React, { useState, useEffect } from "react";
import "./ChangePasswordPopup.css";
import { updateUser } from "../../../services/userService";
import LanguageSelector from "../../language-selector";
import { useTranslation } from "react-i18next";

const ChangePasswordPopup = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {t}=useTranslation();
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage({ type: "", text: "" });
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    return minLength && hasUpperCase && hasDigit;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validatePassword(newPassword)) {
      setMessage({
        type: "error",
        text: t('changePasswordPopup.error-text1'),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: t('changePasswordPopup.error-text2') });
      return;
    }

    try {
      const updatedUser = {
        oldPassword: oldPassword,
        password: newPassword,
      };
      await updateUser(updatedUser);
      setMessage({ type: "success", text: t('changePasswordPopup.success') });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Error updating password:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          t('changePasswordPopup.error-text3'),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-popup-overlay">
      <div className="change-password-popup-container">
        <h2 className="change-password-popup-title">{t('changePasswordPopup.title')}</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <div className="password-input-container">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder={t('changePasswordPopup.oldPassword')}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-profile"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? t('changePasswordPopup.hide') : t('changePasswordPopup.show')}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={t('changePasswordPopup.newPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
            <button
              type="button"
              className="toggle-password-profile"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? t('changePasswordPopup.hide') : t('changePasswordPopup.show')}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('changePasswordPopup.confirmNewPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-profile"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? t('changePasswordPopup.hide') : t('changePasswordPopup.show')}
            </button>
          </div>
          <div className="change-password-popup-buttons">
            <button
              type="button"
              className="change-password-popup-button cancel"
              onClick={onClose}
            >
              {t('changePasswordPopup.cancel')}
            </button>
            <button
              type="submit"
              className="change-password-popup-button confirm"
            >
              {t('changePasswordPopup.changePassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
