import React from 'react';
import './Background.css';
import CustomShape from './RectangleUp.jsx';
import WaveShape from './RectangleDown.jsx';
import eVolveLogo from '../../../src/images/eVolvelogo.png';

const Background = () => {
  return (
    <div className="styled-container">
      <CustomShape />
      <img src={eVolveLogo} alt="eVolve Logo" className="evolve-logo" />
      <WaveShape />
    </div>
  );
};

export default Background;