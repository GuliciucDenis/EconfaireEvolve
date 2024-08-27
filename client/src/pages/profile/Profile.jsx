import React from "react";
import ProfilePic from '../../images/ProfilePic.png';
import Background from '../../components/background/Background.jsx';
import './Profile.css';
import Navbar from "../../components/common/navbar/Navbar";
import ProfilePicHeader from '../../images/ProfilePicHeader.png';
import ProfileTable from '../../components/profile/ProfileTable';
import User from '../../components/common/user/User';

const Profile = () => {
  return (
    <div className="profile-page">
      <Background />
      <img src={ProfilePicHeader} alt="Profile Pic Header" className="profile-pic-header" onClick={() => {window.location.href = '/profile';}}/>
      <Navbar className="navbar"/>
      <h3 className="profile-username" onClick={() => {window.location.href = '/profile';}}>Username</h3>
      <h1 className="profile-title">Profile</h1>
      <div className="profile-content">
        <div className="image-and-modify-container">
            <img className="profile-image" src={ProfilePic} alt="Profile Image" />
            <button className="modify-password-button" onClick={() => {window.location.href = '/modifypassword';}}>Modify password</button>
        </div>
        <ProfileTable/>
    </div>
    </div>
  );
};

export default Profile;