import React, { useState } from "react";
import ProfilePic from "../../images/ProfilePic.png";
import Background from "../../components/background/Background.jsx";
import Navbar from "../../components/common/navbar/Navbar";
import ProfileTable from "../../components/profile/ProfileTable";
import User from "../../components/common/user/User";
import "./Profile.css";
import ChangePasswordPopup from "../../components/common/ChangePassword/ChangePasswordPopup";

const Profile = () => {
  const [isChangePasswordPopupOpen, setIsChangePasswordPopupOpen] =
    useState(false);

  return (
    <div className="profile-page">
      <Background />
      <User />
      <Navbar />
      <h1 className="profile-title">Profile</h1>
      <div className="profile-content">
        <div className="image-and-modify-container">
          <img className="profile-image" src={ProfilePic} alt="Profile Image" />
          <button
            className="modify-password-button"
            onClick={() => setIsChangePasswordPopupOpen(true)}
          >
            Modify password
          </button>
        </div>
        <div className="profile-table-container">
          <ProfileTable className="profile-table"/>
          <ChangePasswordPopup
            isOpen={isChangePasswordPopupOpen}
            onClose={() => setIsChangePasswordPopupOpen(false)}
            onChangePassword={(oldPassword, newPassword) => {
              // Implement the password change logic here
              console.log("Changing password", oldPassword, newPassword);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
