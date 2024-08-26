import React from 'react';
import './HomeWelcome.css';
import DecoratieColtVerde from '../../images/DecoratieColtVerde.png';

const HomeWelcome = () => {
  return (
    <div className="home-welcome-container">
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeStanga" />
      <h1 className="home-welcome-title">Începe astăzi cu eVolve și transformă-ți potențialul în performanță!</h1>
      <img src={DecoratieColtVerde} alt="Decoratie Colt Verde" className="decoratie-colt-verdeDreapta" />
    </div>
  );
};

export default HomeWelcome;