import React, { useState } from "react";
import "./UserDashboard.css";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import UserTable from "../../components/users/UserTable";
import CreateUserForm from "../CreateUserForm/CreateUserForm";

function UserDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="user-dashboard">
      <Background />
      <div className="content">
        <Navbar />
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="toggle-form-button"
        >
          {showCreateForm ? "Hide Create User Form" : "Show Create User Form"}
        </button>
        {showCreateForm && <CreateUserForm />}
        <UserTable />
      </div>
    </div>
  );
}

export default UserDashboard;
