import React, { useState, useEffect } from "react";
import "./EditSubobjectivePopup.css";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const EditSubobjectivePopup = ({ isOpen, onClose, onSubmit, subobjective }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const {t}=useTranslation();

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
      setMessage({ type: "error", text: t('editSubobjectivePopup.error1') });
      return false;
    }
    if (!title.trim() > 30) {
      setMessage({ type: "error", text: t('editSubobjectivePopup.error2') });
      return false;
    }
    if (!description.trim()) {
      setMessage({ type: "error", text: t('editSubobjectivePopup.error3') });
      return false;
    }
    if (description.length > 250) {
      setMessage({ type: "error", text: t('editSubobjectivePopup.error4') });
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
      setMessage({ type: "success", text: t('editSubobjectivePopup.success') });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: t('editSubobjectivePopup.error5'),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-subobjective-popup-overlay">
      <div className="edit-subobjective-popup-container">
        <h2 className="edit-subobjective-popup-title">{t('editSubobjectivePopup.title')}</h2>
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
            placeholder={t('editSubobjectivePopup.subobjectiveTitle')}
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
            placeholder={t('editSubobjectivePopup.subobjectiveDescription')}
            maxLength="250"
            required
          />
          <div className="edit-subobjective-popup-buttons">
            <button
              type="button"
              className="edit-subobjective-popup-button cancel"
              onClick={onClose}
            >
              {t('editSubobjectivePopup.cancel')}
            </button>
            <button
              type="submit"
              className="edit-subobjective-popup-button confirm"
            >
              {t('editSubobjectivePopup.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubobjectivePopup;
