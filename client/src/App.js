import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import LogIn from './components/LogIn/LogIn';
import Home from './pages/Home/Home';
import UserDashboard from './pages/UserDashboard/UserDashboard';

function App() {
  return (
    <NextUIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogIn/>} />
          <Route path='/home' element={<Home/>}/>
          <Route path='/users' element={<UserDashboard/>}/>
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;