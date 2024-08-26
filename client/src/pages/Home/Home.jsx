import React from 'react';
import './Home.css';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import ProgressMeter from '../../components/progressMeter/progressMeter';
import HomeWelcome from '../../components/homewelcome/HomeWelcome';

function Home() {
  return (
    <div className="home-container">
      <Background />
      <div className='home-content'>
        <Navbar />
        <HomeWelcome/>
        <ProgressMeter />
      </div>
    </div>
  );
}

export default Home;