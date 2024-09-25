import React from 'react';
import './HomeWelcome.css';
import DecoratieColtVerde from '../../images/DecoratieColtVerde.png';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/language-selector';

const HomeWelcome = () => {
  const {t}=useTranslation();
  return (
    <div className="home-welcome-container">
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeStanga" />
      <h1 className="home-welcome-title">{t('homeWelcome.welcome')}</h1>
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeDreapta" />
    </div>
  );
};

export default HomeWelcome;