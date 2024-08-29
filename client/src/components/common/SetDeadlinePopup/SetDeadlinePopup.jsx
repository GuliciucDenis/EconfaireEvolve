import React, { useState, useEffect } from "react";
import './SetDeadlinePopup.css';
import { createObjective } from "../../../services/objectiveService";

const SetDeadlinePopup = ({ isOpen, onClose, onSubmit, title, userId }) => {
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setDeadline("");
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!deadline) {
      setMessage({ type: "error", text: "Please select a deadline." });
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
        title : title,
        description : "Brief description of the objective",
        deadline : deadline,
        assignedTo: userId,
        gradeAdmin: 1,
        status: "new",
        subObjectives: []
      };

      const response = await createObjective(newObjective);
      onSubmit(response);

      setMessage({ type: "success", text: "Objective assigned successfully!" });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Error assigning objective:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to assign objective. Please try again.",
      });
    }
  };

  const handleDeadlineChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate < today) {
      setMessage({ type: "error", text: "Please select a future date." });
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
        <h2 className="set-deadline-popup-title">Set a deadline for this objective</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
            min={today}
            required
          />
          <div className="set-deadline-popup-buttons">
            <button
              type="button"
              className="set-deadline-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="set-deadline-popup-button confirm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetDeadlinePopup;

