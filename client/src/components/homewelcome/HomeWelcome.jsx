import React from 'react';
import './HomeWelcome.css';
import DecoratieColtVerde from '../../images/DecoratieColtVerde.png';

const HomeWelcome = () => {
  return (
    <div className="home-welcome-container">
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeStanga" />
      <h1 className="home-welcome-title">Start today with eVolve and turn your potential into performance!</h1>
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeDreapta" />
    </div>
  );
};

export default HomeWelcome;