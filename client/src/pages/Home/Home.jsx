import React from 'react';
import './Home.css';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import ProgressMeter from '../../components/progressMeter/progressMeter';
import HomeWelcome from '../../components/homewelcome/HomeWelcome';
import User from '../../components/common/user/User';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/language-selector';

function Home() {
  const {t}=useTranslation();
  return (
    <div className="home-container">
      <Background />
      <div className='home-title-container'>
          <h1 className='home-title'>{t('home.title')}</h1>
        </div>
      <div className='home-content'>
        <User />
        <LanguageSelector />
        <Navbar />
        <HomeWelcome/>
        <ProgressMeter />
      </div>
    </div>
  );
}

export default Home;