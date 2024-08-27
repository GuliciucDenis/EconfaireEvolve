import React from "react";
import ProfilePic from '../../images/ProfilePic.png';
import Background from '../../components/background/Background.jsx';
import Navbar from "../../components/common/navbar/Navbar";
import ProfilePicHeader from '../../images/ProfilePicHeader.png';
import './ModifyPassword.css';

const ModifyPassword = () => {
    return (
        <div className="modify-password-page">
            <Background />
            <img src={ProfilePicHeader} alt="Profile Pic Header" className="profile-pic-header" onClick={() => {window.location.href = '/profile';}}/>
            <Navbar className="navbar"/>
            <h3 className="profile-username" onClick={() => {window.location.href = '/profile';}}>Username</h3>
            <h1 className="profile-title">Modify Password</h1>
            <div className="modify-password-form-container">
                <div className="modify-password-form">
                    <h2 className="modify-password-label">Old Password:</h2>
                    <input type="password" placeholder="Old Password" className="old-password-input"/>
                    <h2 className="modify-password-label">New Password:</h2>
                    <input type="password" placeholder="New Password" className="new-password-input"/>
                    <h2 className="modify-password-label">Confirm New Password:</h2>
                    <input type="password" placeholder="Confirm New Password" className="confirm-new-password-input"/>
                    <div className="buttons-container">
                        <div className="modify-password-button-container-modifypasswordpage">
                            <button className="modify-password-button-modifypasswordpage" onClick={() => {window.location.href = '/profile';}}>Modify</button>
                        </div>
                        <div className="cancel-password-button-container-modifypasswordpage">
                            <button className="cancel-password-button-modifypasswordpage" onClick={() => {window.location.href = '/profile';}}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyPassword;
