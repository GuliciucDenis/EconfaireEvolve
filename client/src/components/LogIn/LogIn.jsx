import React from 'react';
import './LogIn.css';
import Dots from '../../images/DecoratieColt.png'
import EvolveLogo from '../../images/eVolvelogo.png'

function LogIn() {
  return (
    <div className="login-background">
      <div className="login-content">
        <header>
        <img src={Dots} className='dots' />
        <img src={EvolveLogo} className='evolve-logo'/>
        </header>
        <main>CONTENT</main>
        <footer>FOOTER</footer>
      </div>
    </div>
  );
}

export default LogIn;
