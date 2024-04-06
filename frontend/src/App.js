
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Routing from './routing/Routing';
import FitNessyApi from './api/api';
import 'bootstrap/dist/css/bootstrap.css';
import LogoutRedirector from './components/LogoutRedirector';

function App() {


  const [currentUser, setCurrentUser] = useState(null);


  return (
    <Router>
      <LogoutRedirector/>
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
