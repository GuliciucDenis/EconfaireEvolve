import React from "react";
import ProfilePic from '../../images/ProfilePic.png';
import Background from '../../components/background/Background.jsx';
import './Profile.css';
import Navbar from "../../components/common/navbar/Navbar";

const Profile = () => {
  return (
    <div className="profile-page">
      <Background />
      <Navbar/>
      <div className="content">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-content">
          <div className="image-and-modify-container">
            <div className="profile-container">
              <img className="profile-image" src={ProfilePic} alt="Profile Image" />
            </div>
            <div className="modify-password-container">
              <button className="modify-password-button">Modify password</button>
            </div>
          </div>
          <div className="profile-table-container">
            <div className="profile-table">
              <table>
                <tbody>
                  <tr><td>First name</td><td>Prenume</td></tr>
                  <tr><td>Last name</td><td>Nume</td></tr>
                  <tr><td>Email</td><td>ecf@econfaire.ro</td></tr>
                  <tr><td>Password</td><td>PAROLA</td></tr>
                  <tr><td>Department</td><td>HR</td></tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;