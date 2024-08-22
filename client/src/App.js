import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn/>} />
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;