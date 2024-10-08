import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import "./CreateUserForm.css";

const CreateUserForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 6 characters long, include an uppercase letter and a digit"
      );
      return;
    }
    try {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        role,
      };
      console.log(newUser);
      const response = await createUser(newUser);
      console.log("User created:", response);
      setSuccessMessage("User successfully created!");
      setPasswordError(""); // Clear any existing error messages
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      setSuccessMessage("");
      setPasswordError("Failed to create user. Please try again.");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("user");
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value.slice(0, 15);
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value.slice(0, 15);
    setLastName(value);
  };

  return (
    <div className="create-user-form-container">
      {successMessage && (
        <div className="message success">{successMessage}</div>
      )}
      {passwordError && <div className="message error">{passwordError}</div>}
      <div className="form-header">
        <h2 className="title">User Role</h2>
        <div className="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="employee">Employee</option>
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
            onChange={handleLastNameChange}
            required
            placeholder="Last Name"
            maxLength={15}
          />
        </div>
        <div className="form-row">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            required
            placeholder="First Name"
            maxLength={15}
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
        <div className="form-row password-row">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            required
            placeholder="Password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="form-row button-row">
          <button type="button" onClick={() => navigate("/user-dashboard")}>
            Go back
          </button>
          <button type="button" onClick={resetForm}>
            Clear
          </button>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
