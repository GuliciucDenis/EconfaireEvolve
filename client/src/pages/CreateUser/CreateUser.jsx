import React from "react";
import "./CreateUser.css";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import CreateUserForm from "../../components/CreateUserForm/CreateUserForm";

function CreateUser() {
  return (
    <div className="create-user-page">
      <Background />
      <div className="content">
        <Navbar />
        <CreateUserForm />
      </div>
    </div>
  );
}

export default CreateUser;