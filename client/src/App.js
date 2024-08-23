import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import Home from './pages/Home/Home';
import Objectives from './pages/objectives/Objectives';
import Help from './pages/help/Help';
import History from './pages/history/History';
import LogOut from './pages/logout/logout';
import SearchUser from './pages/searchUser/SearchUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn/>} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/objectives' element={<Objectives/>}/>
        <Route path='/help' element={<Help/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/logout' element={<LogOut/>}/>
        <Route path='/searchUser' element={<SearchUser/>}/>
      </Routes>
    </Router>
  );
}

export default App;