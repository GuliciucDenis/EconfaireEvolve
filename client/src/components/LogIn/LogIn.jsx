import React, { useState } from 'react';
import './LogIn.css';
import Dots from '../../images/DecoratieColt.png';
import EvolveLogo from '../../images/eVolvelogo.png';
import LogInImage from '../../images/man.png';
import useLogin from '../UseLogin.js/UseLogin';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  }

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
            <form className='login-form' onSubmit={handleSubmit}>
              <div className='input-box'>
                <p>Email:</p>
                <input 
                  type='email' 
                  placeholder='Email' 
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className='input-box'>
                <p>Password:</p>
                <input 
                  type='password' 
                  placeholder='Password' 
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <button type="submit" className='login-button' disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              {error && <p className="error-message">{error}</p>}
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
