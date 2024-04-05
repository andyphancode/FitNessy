import React, { createContext, useContext, useState, useEffect } from 'react';
import FitNessyApi from '../api/api'; 
import {jwtDecode} from "jwt-decode";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('fitnessy-token');
      if (token) {
        FitNessyApi.token = token;
        const { username } = jwtDecode(token)
        try {
          const user = await FitNessyApi.getCurrentUser(username); // Implement this method
          setCurrentUser(user);
        } catch (error) {
          console.log("Authentication token invalid:", error);
          localStorage.removeItem('fitnessy-token');
        }
      }
      setLoading(false); 
    };

    getUser();
  }, []);

  const login = async (data) => {
    try {
        const token = await FitNessyApi.login(data);
        localStorage.setItem('fitnessy-token', token);
        FitNessyApi.token = token;
        const { username } = jwtDecode(token);
        const user = await FitNessyApi.getCurrentUser(username);
        console.log(user); // Fetch user details
        setCurrentUser(user);
        return { success: true }        
    } catch (errors) {
        console.error("Login/signup failed", errors);
        return { success: false, errors };
    }
  };

  const signup = async (data) => {
    try {
        const token = await FitNessyApi.signup(data);
        localStorage.setItem('fitnessy-token', token);
        FitNessyApi.token = token;
        const { username } = jwtDecode(token);
        const user = await FitNessyApi.getCurrentUser(username); // Fetch user details
        setCurrentUser(user);
        return { success: true }        
    } catch (errors) {
        console.error("Login/signup failed", errors);
        return { success: false, errors };
    }
  }

  const logout = () => {
    localStorage.removeItem('fitnessy-token');
    setCurrentUser(null);
    FitNessyApi.token = null; // Reset the token in API helper 
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
