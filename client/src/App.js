import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import Home from './pages/Home/Home';
import FAQs from './pages/FAQs/FAQs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn/>} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/faqs' element={<FAQs/>}/>
      </Routes>
    </Router>
  );
}

export default App;