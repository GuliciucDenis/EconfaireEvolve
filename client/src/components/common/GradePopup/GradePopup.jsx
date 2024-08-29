import React, { useState } from "react";
import "./GradePopup.css";

const GradePopup = ({ isOpen, onClose, subobjective, onSubmit }) => {
  const [grade, setGrade] = useState("");

  const resetForm = () => {
    setGrade("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(subobjective.id, parseFloat(grade));
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="grade-subobjective-popup-overlay">
      <div className="grade-subobjective-popup-container">
        <h2 className="grade-subobjective-popup-title">Grade Subobjective</h2>
        <p>{subobjective.title}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            max="10"
            step="0.1"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter grade (1-10)"
            required
          />
          <div className="grade-subobjective-popup-buttons">
            <button type="button" className="grade-subobjective-popup-button cancel" onClick={() => {
              onClose();
              resetForm();
            }}>
              Cancel
            </button>
            <button type="submit" className="grade-subobjective-popup-button confirm">
              Submit Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradePopup;
