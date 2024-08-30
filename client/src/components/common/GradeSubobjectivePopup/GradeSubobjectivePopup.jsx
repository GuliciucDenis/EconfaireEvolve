import React, { useState, useEffect } from "react";
import "./GradeSubobjectivePopup.css"; // New CSS file for grading popup styles

const GradeSubobjectivePopup = ({ isOpen, onClose, onSubmit, subobjective }) => {
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

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
      setMessage({ type: "error", text: "Please enter a grade between 1 and 10." });
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
        <h2 className="grade-subobjective-popup-title">Grade Subobjective: {subobjective}</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter grade (1-10)"
            min="1"
            max="10"
            required
          />
          <div className="grade-subobjective-popup-buttons">
            <button
              type="button"
              className="grade-subobjective-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="grade-subobjective-popup-button confirm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubobjectivePopup;
