import React from 'react';
import './LogIn.css';
import Dots from '../../images/DecoratieColt.png';
import EvolveLogo from '../../images/eVolvelogo.png';
import LogInImage from '../../images/man.png';

function LogIn() {
  return (
    <div className="login-background">
      <div className="login-content">
        <header>
          <img src={Dots} className='dots-up' alt="Decorative Dots" />
          <img src={EvolveLogo} className='evolve-logo' alt="Evolve Logo" />
          <div className='first-blob'></div>
        </header>
        <main>
          <img src={LogInImage} className='man-ladder' alt="Man on ladder" />
          <div className='second-blob'></div>
          <div className='wrapper'>
            <form className='login-form'>
              <div className='input-box'>
                <p>Name:</p>
                <input type='text' placeholder='Name' required />
              </div>
              <div className='input-box'>
                <p>Surname:</p>
                <input type='text' placeholder='Surname' required />
              </div>
              <div className='input-box'>
                <p>Email:</p>
                <input type='email' placeholder='Email' required />
              </div>
              <div className='input-box'>
                <p>Password:</p>
                <input type='password' placeholder='Password' required />
              </div>
              <button className='login-button'>Log In</button>
            </form>
          </div>
        </main>
        <footer>
          <img src={Dots} className='dots-down' alt="Decorative Dots" />
        </footer>
      </div>
    </div>
  );
}

export default LogIn;
