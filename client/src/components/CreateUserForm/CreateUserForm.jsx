import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateUserForm.css";

const CreateUserForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically call an API to create the user
    console.log({ firstName, lastName, email, password, role });
    // Reset form after submission
    resetForm();
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("user");
  };

  return (
    <div className="create-user-form-container">
      <div className="form-header">
        <h2>User Role</h2>
        <div className="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">Employee</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="create-user-form">
        <div className="form-row">
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="First Name"
          />
        </div>
        <div className="form-row">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </div>
        <div className="form-row">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className="form-row">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <div className="form-row button-row">
        <button type="button" onClick={() => navigate("/user-dashboard")}>
            Go back
          </button>
          <button type="submit">Add</button>
          <button type="button" onClick={resetForm}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;