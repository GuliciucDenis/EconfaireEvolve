import React, { useState, useEffect } from "react";
import "./EditSubobjectivePopup.css";

const EditSubobjectivePopup = ({ isOpen, onClose, onSubmit, subobjective }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Initializează formularul cu datele subobiectivului existent
    if (subobjective && isOpen) {
      setTitle(subobjective.title);
      setDescription(subobjective.description);
    } else {
      resetForm();
    }
  }, [subobjective, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a subobjective title." });
      return false;
    }
    if (!title.trim() > 30) {
      setMessage({ type: "error", text: "Title must be 30 characters or less." });
      return false;
    }
    if (!description.trim()) {
      setMessage({ type: "error", text: "Please enter a subobjective description." });
      return false;
    }
    if (description.length > 250) {
      setMessage({ type: "error", text: "Description must be 250 characters or less." });
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
      const updatedSubobjective = {
        ...subobjective,
        title,
        description,
      };

      onSubmit(updatedSubobjective);  // Trimite datele actualizate
      setMessage({ type: "success", text: "Subobjective updated successfully!" });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to update subobjective. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-subobjective-popup-overlay">
      <div className="edit-subobjective-popup-container">
        <h2 className="edit-subobjective-popup-title">Edit Subobjective</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subobjective Title"
            maxLength="30"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Subobjective Description"
            maxLength="250" // Limit to 50 characters
            required
          />
          <div className="edit-subobjective-popup-buttons">
            <button
              type="button"
              className="edit-subobjective-popup-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-subobjective-popup-button confirm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubobjectivePopup;
