import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import "./CreateUserForm.css";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

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
  const {t}=useTranslation();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(
        t('crateUser.error')
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
      setSuccessMessage(t('createUser.sucess'));
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      setPasswordError(""); // Clear any existing error messages
      resetForm();
      }catch (error) {
        console.error("Error creating user:", error);
        if (error.response && error.response.data && error.response.data.message) {
            setPasswordError(`Failed to create user: ${error.response.data.message}`);
        } else {
            setPasswordError(t('createUser.error2'));
        }
        setSuccessMessage("");
    }  
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
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
        <h2 className="title">{t('createUser.userRole')}</h2>
        <div className="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="employee">{t('createUser.employee')}</option>
            <option value="admin">{t('createUser.administrator')}</option>
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
            placeholder={t('createUser.lastName')}
            maxLength={15}
            onInvalid={(e) => e.target.setCustomValidity(
              i18n.language === 'ro'
                ? 'Vă rugăm să introduceți numele de familie'
                : 'Please enter the last name'
            )}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>
        <div className="form-row">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            required
            placeholder={t('createUser.firstName')}
            maxLength={15}
            onInvalid={(e) => e.target.setCustomValidity(
              i18n.language === 'ro'
                ? 'Vă rugăm să introduceți prenumele'
                : 'Please enter the first name'
            )}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>
        <div className="form-row">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              
              if (!e.target.value.includes("@")) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Adresa de email trebuie să conțină un @'
                    : 'Please include an @ in the email address'
                );
              } else {
                const emailParts = e.target.value.split("@");
                if (emailParts.length > 1 && emailParts[1].trim() === "") {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Vă rugăm să completați partea de după "@"'
                      : 'Please enter a part following "@"'
                  );
                } else {
                  e.target.setCustomValidity('');
                }
              }
            }}
            required
            placeholder={t('createUser.email')}
            onInvalid={(e) => {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Vă rugăm să introduceți emailul'
                    : 'Please enter the email'
                );
            }}
            onBlur={(e) => {
              if (!email.includes("@")) {
                e.target.setCustomValidity(
                  i18n.language === 'ro'
                    ? 'Adresa de email trebuie să conțină un @'
                    : 'Please include an @ in the email address'
                );
              } else {
                const emailParts = e.target.value.split("@");
                if (emailParts.length > 1 && emailParts[1].trim() === "") {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Vă rugăm să completați partea de după "@"'
                      : 'Please enter a part following "@"'
                  );
                } else {
                  e.target.setCustomValidity('');
                }
              }
            }}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>
        <div className="form-row password-row">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              const passwordValue = e.target.value;
              setPassword(passwordValue);
              setPasswordError('');
        
              if (!validatePassword(passwordValue)) {
                if (passwordValue.length < 6) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Parola trebuie să aibă cel puțin 6 caractere'
                      : 'Password must be at least 6 characters long'
                  );
                }
                else if (!/[A-Z]/.test(passwordValue)) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Parola trebuie să conțină cel puțin o literă mare'
                      : 'Password must contain at least one uppercase letter'
                  );
                }
                else if (!/\d/.test(passwordValue)) {
                  e.target.setCustomValidity(
                    i18n.language === 'ro'
                      ? 'Parola trebuie să conțină cel puțin o cifră'
                      : 'Password must contain at least one digit'
                  );
                }
              } else {
                e.target.setCustomValidity('');
              }
            }}
            onInvalid={(e) => {
              e.target.setCustomValidity(
                i18n.language === 'ro'
                  ? 'Vă rugăm să introduceți o parolă validă'
                  : 'Please enter a valid password'
              );
            }}
            onInput={(e) => e.target.setCustomValidity('')}
            required
            placeholder={t('createUser.password')}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? t('createUser.hide') : t('createUser.show')}
          </button>
        </div>
        <div className="form-row button-row">
          <button type="button" onClick={() => navigate("/user-dashboard")}>
            {t('createUser.goBack')}
          </button>
          <button type="button" onClick={resetForm}>
          {t('createUser.clear')}
          </button>
          <button type="submit">{t('createUser.add')}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
