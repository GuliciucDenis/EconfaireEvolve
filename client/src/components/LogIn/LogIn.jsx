import React, { useState } from 'react';
import './LogIn.css';
import Dots from '../../images/DecoratieColt.png';
import EvolveLogo from '../../images/eVolvelogo.png';
import LogInImage from '../../images/man.png';
import useLogin from '../UseLogin.js/UseLogin';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../language-selector';

const LogIn = () => {
  const {t}=useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="login-page-container">
      <div className="login-background">
        <div className="login-content">
          <header>
            <img src={Dots} className='dots-upwards' alt="Decorative Dots" />
            <div className='change-language-container'>
              <LanguageSelector />
            </div>
            <img src={EvolveLogo} className='evolve-logo' alt="Evolve Logo" />
            <div className='first-blob'></div>
          </header>
          <main>
            <img src={LogInImage} className='man-ladder' alt="Man on ladder" />
            <div className='second-blob'></div>
            <div className='wrapper'>
              <form className='login-form' onSubmit={handleSubmit}>
                <div className='input-box'>
                  <p>{t('login.email')}</p>
                  <input 
                    type='email' 
                    placeholder={t('login.emailPlaceholder')} 
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className='input-box'>
                  <p>{t('login.password')}</p>
                  <input 
                    type='password' 
                    placeholder={t('login.passwordPlaceholder')} 
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <button type="submit" className='login-button' disabled={loading}>
                  {loading ? t('login.loggingIn') : t('login.loginButton')}
                </button>
                {error && <p className="error-message">{t('login.error')}</p>}
              </form>
            </div>
          </main>
          <footer>
            <img src={Dots} className='dots-down' alt="Decorative Dots" />
          </footer>
        </div>
      </div>
    </div>
  );
}

export default LogIn;