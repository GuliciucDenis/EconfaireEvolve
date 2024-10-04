import React, { useState, useEffect } from "react";
import "./AddSubobjectivePopup.css";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const AddSubobjectivePopup = ({ isOpen, onClose, onSubmit, objectiveId }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [description, setDescription] = useState("");
  const {t}=useTranslation();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setMessage({ type: "", text: "" });
    setDescription("");
  };

  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: t('addSubobjectivePopup.error1') });
      return false;
    }
    if (!title.trim() > 30) {
      setMessage({ type: "error", text: t('addSubobjectivePopup.error2') });
      return false;
    }
    if (!description.trim()) {
      setMessage({ type: "error", text: t('addSubobjectivePopup.error3') });
      return false;
    }
    if (description.length > 250) {
      setMessage({ type: "error", text: t('addSubobjectivePopup.error4') });
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

    onSubmit({title,description});
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="add-subobjective-popup-overlay">
      <div className="add-subobjective-popup-container">
        <h2 className="add-subobjective-popup-title">{t('addSubobjectivePopup.title')}</h2>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if(e.target.value.length<=30){
                e.target.setCustomValidity(''); 
                setMessage({ type: "", text: "" });
              }
            }}
            onBlur={(e) => {
              if(!e.target.value.trim()){
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Titlul obiectivului este obligatoriu'
                    : 'The objective title is required'
                );
              } else if (e.target.value.length > 30) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Titlul trebuie să aibă cel mult 30 de caractere'
                    : 'The title must be no more than 30 characters'
                );
              } else {
                e.target.setCustomValidity('');
              }
            }}
            onInvalid={(e) => {
              if(!e.target.value.trim()){
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Titlul obiectivului este obligatoriu'
                    : 'The objective title is required'
                );
              } else if (e.target.value.length > 30) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Titlul trebuie să aibă cel mult 30 de caractere'
                    : 'The title must be no more than 30 characters'
                );
              }
            }}
            placeholder={t('addSubobjectivePopup.subobjectiveTitle')}
            maxLength="30"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length <= 250) {
                e.target.setCustomValidity(''); 
                setMessage({ type: "", text: "" });
              }
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Descrierea obiectivului este obligatorie'
                    : 'The objective description is required'
                );
              } else if (e.target.value.length > 250) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Descrierea trebuie să aibă cel mult 250 de caractere'
                    : 'The description must be no more than 250 characters'
                );
              } else {
                e.target.setCustomValidity('');
              }
            }}
            onInvalid={(e) => {
              if (!e.target.value.trim()) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Descrierea obiectivului este obligatorie'
                    : 'The objective description is required'
                );
              } else if (e.target.value.length > 250) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Descrierea trebuie să aibă cel mult 250 de caractere'
                    : 'The description must be no more than 250 characters'
                );
              }
            }}
            placeholder={t('addSubobjectivePopup.subobjectiveDescription')}
            maxLength="250" // Limit to 50 characters
            required
          />
          <div className="add-subobjective-popup-buttons">
            <button
              type="button"
              className="add-subobjective-popup-button cancel"
              onClick={onClose}
            >
              {t('addSubobjectivePopup.cancel')}
            </button>
            <button
              type="submit"
              className="add-subobjective-popup-button confirm"
            >
              {t('addSubobjectivePopup.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubobjectivePopup;