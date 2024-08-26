import React from 'react';
import './Home.css';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';

function Home() {
  return (
    <div className="home-container">
      <Background />
      <Navbar />
    </div>
  );
}

export default Home;