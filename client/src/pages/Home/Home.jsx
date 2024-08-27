import React from 'react';
import './Home.css';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import ProgressMeter from '../../components/progressMeter/progressMeter';
import HomeWelcome from '../../components/homewelcome/HomeWelcome';
import User from '../../components/common/user/User';

function Home() {
  return (
    <div className="home-container">
      <Background />
      <div className='home-content'>
        <User />
        <Navbar />
        <HomeWelcome/>
        <ProgressMeter />
      </div>
    </div>
  );
}

export default Home;