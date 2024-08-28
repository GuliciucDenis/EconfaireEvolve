import React, { useState, useEffect } from "react";
import "./ChangePasswordPopup.css";
import { updateUser } from "../../../services/userService";

const ChangePasswordPopup = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        text: "Password must be at least 6 characters long, include an uppercase letter and a digit.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      const updatedUser = {
        oldPassword: oldPassword,
        password: newPassword,
      };
      await updateUser(updatedUser);
      setMessage({ type: "success", text: "Password changed successfully!" });
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
          "Failed to change password. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-popup-overlay">
      <div className="change-password-popup-container">
        <h2 className="change-password-popup-title">Change Password</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <div className="password-input-container">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-profile"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password (min 6 characters)"
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
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-profile"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="change-password-popup-buttons">
            <button
              type="button"
              className="change-password-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="change-password-popup-button confirm"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
