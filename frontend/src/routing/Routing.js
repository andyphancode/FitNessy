import React from 'react'
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import Workouts from '../components/Workouts';
import {Routes, Route} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';


function Routing() {

  const {login, signup} = useAuth();

  return (
    <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/register" element={<Register signup={signup} />} />
        <Route path="/workouts" element={<ProtectedRoute><Workouts/></ProtectedRoute>} />
        <Route exact path="*" element={<div>Nothing here! Error 404.</div>} />
    </Routes>
  )
}

export default Routing;