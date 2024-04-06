import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutRedirector = () => {
  const navigate = useNavigate();
  const { hasLoggedOut, resetLogoutFlag } = useAuth();


  useEffect(() => {
    if (hasLoggedOut) {
      navigate('/');
      resetLogoutFlag(); 
    }
  }, [hasLoggedOut, navigate, resetLogoutFlag]);

  return null; 
};

export default LogoutRedirector;