import React, { useState } from "react";
import "./CreateUserForm.css";

const CreateUserForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

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
        <h2>Tip utilizator</h2>
        <div className="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
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
            placeholder="Nume"
          />
        </div>
        <div className="form-row">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Prenume"
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
            placeholder="Parola"
          />
        </div>
        <div className="form-row button-row">
          <button type="submit">Creeaza</button>
          <button type="button" onClick={resetForm}>
            Renunta
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
