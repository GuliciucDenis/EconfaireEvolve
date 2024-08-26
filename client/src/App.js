import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LogIn from "./components/LogIn/LogIn";
import Home from "./pages/Home/Home";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Objectives from "./pages/objectives/Objectives";
import Help from "./pages/help/Help";
import History from "./pages/history/History";
import LogOut from "./pages/logout/logout";
import Profile from "./pages/profile/Profile";
import CreateUser from "./pages/CreateUser/CreateUser";
import FAQs from "./pages/FAQs/FAQs";




function App() {
  return (
    <NextUIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/help" element={<Help />} />
          <Route path="/history" element={<History />} />
          <Route path="/logout" element={<LogOut />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/faq" element={<FAQs />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;
