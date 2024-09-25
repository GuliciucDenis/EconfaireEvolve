import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import './language-selector.css';

const languages = [
    {code: "en", lang: "English"},
    {code: "ro", lang: "Română"}
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const changeLanguage = () => {
        const newLanguage = currentLanguage === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage); // Actualizăm limba curentă în state
    };


    return (
        <div className="btn-container">
            <button onClick={changeLanguage}>
                {currentLanguage === 'ro' ? 'English' : 'Română'}
            </button>
        </div>
    );
};

export default LanguageSelector;
