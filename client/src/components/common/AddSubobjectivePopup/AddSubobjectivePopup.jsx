import React, { useState, useEffect } from "react";
import "./AddSubobjectivePopup.css";

const AddSubobjectivePopup = ({ isOpen, onClose, onSubmit, objectiveId }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDeadline("");
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a subobjective title." });
      return false;
    }
    if (!deadline) {
      setMessage({ type: "error", text: "Please select a deadline." });
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

    onSubmit({ title, deadline });
    resetForm();
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
    <div className="add-subobjective-popup-overlay">
      <div className="add-subobjective-popup-container">
        <h2 className="add-subobjective-popup-title">Add New Subobjective</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subobjective Title"
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
            min={today}
            required
          />
          <div className="add-subobjective-popup-buttons">
            <button
              type="button"
              className="add-subobjective-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-subobjective-popup-button confirm"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubobjectivePopup;