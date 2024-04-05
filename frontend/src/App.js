
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Routing from './routing/Routing';
import FitNessyApi from './api/api';
import {jwtDecode} from "jwt-decode";
import useLocalStorage from "./useLocalStorage";
import 'bootstrap/dist/css/bootstrap.css';
import { useAuth } from './context/AuthContext';

function App() {


  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    async function fetchAndStoreExercises() {
      try {
        const exercises = await FitNessyApi.getExercises();
        localStorage.setItem('exercises', JSON.stringify(exercises));
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        // handle the error in UI
      }
    };
    fetchAndStoreExercises();    
  }, [])


  return (
    <Router>
      <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '20px' }}>
            <Routing />
          </main>
      </div>
    </Router>
  );
}

export default App;
