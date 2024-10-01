import React, { useState, useEffect } from "react";
import "./GradeSubobjectivePopup.css"; // New CSS file for grading popup styles
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const GradeSubobjectivePopup = ({ isOpen, onClose, onSubmit, subobjective }) => {
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const {t}=useTranslation();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setGrade("");
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const gradeValue = parseInt(grade, 10);
    if (isNaN(gradeValue) || gradeValue < 1 || gradeValue > 10) {
      setMessage({ type: "error", text: t('gradeSubobjectivePopup.error') });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    onSubmit(grade);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="grade-subobjective-popup-overlay">
      <div className="grade-subobjective-popup-container">
        <h2 className="grade-subobjective-popup-title">{t('gradeSubobjectivePopup.title')}: {subobjective}</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder={t('gradeSubobjectivePopup.placeholder')}
            min="1"
            max="10"
            required
            onInvalid={(e) => e.target.setCustomValidity((i18n.language==="ro") ? 'Introduceți un număr între 1 și 10': 'Enter a number between 1 and 10')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
          <div className="grade-subobjective-popup-buttons">
            <button
              type="button"
              className="grade-subobjective-popup-button cancel"
              onClick={onClose}
            >
              {t('gradeSubobjectivePopup.cancel')}
            </button>
            <button
              type="submit"
              className="grade-subobjective-popup-button confirm"
            >
              {t('gradeSubobjectivePopup.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubobjectivePopup;
