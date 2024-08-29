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
import LogoutPopup from "./components/common/logout/LogoutPopup";
import ModifyPassword from "./pages/modifypassword/ModifyPassword";
import ChangePasswordPopup from "./components/common/ChangePassword/ChangePasswordPopup";
import AddObjectives from "./pages/AddObjectives/AddObjectives";
import EditObjectives from "./components/EditObjectives/EditObjectives";
import ViewObjectives from "./components/ViewObjectives/ViewObjectives";
import DeleteUserPopup from "./components/common/DeleteUserPopup/DeleteUserPopup";
import GradePopup from "./components/common/GradePopup/GradePopup";

function App() {
  return (
    <NextUIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/objectives/:id" element={<Objectives />} />
          <Route path="/help" element={<Help />} />
          <Route path="/history" element={<History />} />
          <Route path="/logout" element={<LogOut />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/faq" element={<FAQs />} />
          <Route path="/logout-popup" element={<LogoutPopup />} />
          <Route path="/modifypassword" element={<ModifyPassword />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route
            path="/change-password-popup"
            element={<ChangePasswordPopup />}
          />
          <Route path="/edit-objectives/:id" element={<AddObjectives />} />
          <Route path="/delete-user-popup" element={<DeleteUserPopup />} />
          <Route path="/grade-subobjective-popup" element={<GradePopup />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;
