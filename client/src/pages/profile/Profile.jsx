import React from "react";
import ProfilePic from "../../images/ProfilePic.png";
import Background from "../../components/background/Background.jsx";
import Navbar from "../../components/common/navbar/Navbar";
import ProfileTable from "../../components/profile/ProfileTable";
import User from "../../components/common/user/User";
import "./Profile.css";

const Profile = () => {
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
            onClick={() => {
              window.location.href = "/modifypassword";
            }}
          >
            Modify password
          </button>
        </div>
        <div className="profile-table-container">
          <ProfileTable />
        </div>
      </div>
    </div>
  );
};

export default Profile;
