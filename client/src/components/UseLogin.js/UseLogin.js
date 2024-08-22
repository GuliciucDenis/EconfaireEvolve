import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
       
        localStorage.setItem('token', data.token); 
        navigate('/home'); 
      } else {
        
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
