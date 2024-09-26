import React, { useState, useEffect } from "react";
import "./AddObjectivesPopup.css";
import { createObjective } from "../../../services/objectiveService";

const AddObjectivesPopup = ({ isOpen, onClose, onSubmit, userId }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [description, setDescription] = useState("");
  
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDeadline("");
    setMessage({ type: "", text: "" });
    setDescription("");
  };

  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter an objective title." });
      return false;
    }
    if (!title.trim() > 30) {
      setMessage({ type: "error", text: "Title must be 30 characters or less." });
      return false;
    }
    if (!description.trim()) {
      setMessage({ type: "error", text: "Please enter an objective description." });
      return false;
    }
    if (description.length > 250) {
      setMessage({ type: "error", text: "Description must be 250 characters or less." });
      return false;
    }
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

      setMessage({ type: "success", text: "Objective created successfully!" });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Error creating objective:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to create objective. Please try again.",
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
    <div className="add-objectives-popup-overlay">
      <div className="add-objectives-popup-container">
        <h2 className="add-objectives-popup-title">Create New Objective</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Objective Title"
            maxLength="30"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objective Description"
            maxLength="250" // Limit to 50 characters
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
            min={today}
            required
          />
          <div className="add-objectives-popup-buttons">
            <button
              type="button"
              className="add-objectives-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-objectives-popup-button confirm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddObjectivesPopup;
