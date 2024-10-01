import React, { useState, useEffect } from "react";
import './SetDeadlinePopup.css';
import { createObjective } from "../../../services/objectiveService";
import { useTranslation } from "react-i18next";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import i18n from "../../../i18n";

const SetDeadlinePopup = ({ isOpen, onClose, onSubmit, title, userId }) => {
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [description, setDescription] = useState("");
  const {t}=useTranslation();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setDeadline("");
    setMessage({ type: "", text: "" });
    setDescription("");
  };

  const validateForm = () => {
    if (!description.trim()) {
      setMessage({ type: "error", text: t('setDeadlinePopup.error1') });
      return false;
    }
    if (description.length > 250) {
      setMessage({ type: "error", text: t('setDeadlinePopup.error2') });
      return false;
    }
    if (!deadline) {
      setMessage({ type: "error", text: t('setDeadlinePopup.error3') });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    try {
      const newObjective = {
        title: title,
        description: description,
        deadline: deadline,
        assignedTo: userId,
        gradeAdmin: 1,
        status: "new",
        subObjectives: [],
      };

      const response = await createObjective(newObjective);
      onSubmit(response);

      setMessage({ type: "success", text: t('setDeadlinePopup.success') });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Error assigning objective:", err);
      setMessage({
        type: "error",
        text: err.message || t('setDeadlinePopup.error4'),
      });
    }
  };

  const handleDeadlineChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate < today) {
      setMessage({ type: "error", text: t('setDeadlinePopup.error5') });
      setDeadline("");
    } else {
      setMessage({ type: "", text: "" });
      setDeadline(e.target.value);
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <div className="set-deadline-popup-overlay">
      <div className="set-deadline-popup-container">
        <h2 className="set-deadline-popup-title">{t('setDeadlinePopup.title')}</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('setDeadlinePopup.objectiveDescription')}
            maxLength="250" // Limit to 50 characters
            required
          />
          <CustomCalendar
            selectedDate={deadline}
            onChange={(date) => {
              setDeadline(date);
              handleDeadlineChange({ target: { value: date } });
            }}
            min={today}
            required
            className="custom-datepicker"
            locale={(i18n.language === "ro")?("ro"):("en")}
            placeholderText={(i18n.language === "ro")?("Selectează o dată"):("Select a date")}
          />
          <div className="set-deadline-popup-buttons">
            <button
              type="button"
              className="set-deadline-popup-button cancel"
              onClick={onClose}
            >
              {t('setDeadlinePopup.cancel')}
            </button>
            <button
              type="submit"
              className="set-deadline-popup-button confirm"
            >
              {t('setDeadlinePopup.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetDeadlinePopup;
