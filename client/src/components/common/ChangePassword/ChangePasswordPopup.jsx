import React, { useState, useEffect } from "react";
import "./ChangePasswordPopup.css";
import { updateUser, validateOldPassword } from "../../../services/userService";
import LanguageSelector from "../../language-selector";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

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

    try {
      // 1. Verifică dacă parola veche este corectă
      const isValidOldPassword = await validateOldPassword(oldPassword);
      console.log(isValidOldPassword); // Vezi dacă primești boolean sau altceva

      // Dacă parola veche nu este validă, setează mesajul de eroare
      if (!isValidOldPassword) {
        setMessage({
          type: "error",
          text: t('changePasswordPopup.error-textOldPasswordInvalid'),
        });
        return;
      }
  
      // 2. Validare parolă nouă
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
  
      // 3. Actualizare parolă
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
        text: err.response?.data?.message || t('changePasswordPopup.error-text3'),
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
              onInvalid={(e) => e.target.setCustomValidity(
                i18n.language === 'ro'
                  ? 'Vă rugăm să introduceți parola veche'
                  : 'Please enter your old password'
              )}
              onInput={(e) => e.target.setCustomValidity('')}
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
              onInvalid={(e) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Vă rugăm completați acest câmp'
                      : 'Please fill in this field'
                  );
                } else if (e.target.validity.tooShort) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? `Vă rugăm să introduceți o parolă de cel puțin 6 caractere (în prezent folosiți ${e.target.value.length} caractere).`
                      : `Please enter a password of at least 6 characters (you are currently using ${e.target.value.length} characters).`
                  );
                } else if (e.target.validity.tooLong) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? `Parola nu poate depăși 20 de caractere.`
                      : `Password cannot exceed 20 characters.`
                  );
                } else if (e.target.validity.patternMismatch) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? `Parola trebuie să conțină cel puțin o literă mare, o cifră și un caracter special.`
                      : `Password must contain at least one uppercase letter, one number, and one special character.`
                  );
                } else {
                  e.target.setCustomValidity('');
                }
              }}
              onInput={(e) => e.target.setCustomValidity('')}
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
              onInvalid={(e) => e.target.setCustomValidity(
                i18n.language === 'ro'
                  ? 'Vă rugăm să confirmați parola nouă'
                  : 'Please confirm your new password'
              )}
              onInput={(e) => e.target.setCustomValidity('')}
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
