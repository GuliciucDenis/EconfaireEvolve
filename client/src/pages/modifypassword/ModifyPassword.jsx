import React, { useState } from "react";
import Background from '../../components/background/Background.jsx';
import Navbar from "../../components/common/navbar/Navbar";
import ProfilePicHeader from '../../images/ProfilePicHeader.png';
import { updateUser } from "../../services/userService";
import './ModifyPassword.css';

const ModifyPassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            const updatedUser = {
                oldPassword,
                newPassword
            };
            const response = await updateUser(updatedUser);
            console.log("Password updated:", response);
            // Redirect to profile page or show success message
            window.location.href = '/profile';
        } catch (error) {
            console.error("Error updating password:", error);
            setError("Failed to update password. Please try again.");
        }
    };

    return (
        <div className="modify-password-page">
            <Background />
            <img src={ProfilePicHeader} alt="Profile Pic Header" className="profile-pic-header" onClick={() => {window.location.href = '/profile';}}/>
            <Navbar className="navbar"/>
            <h3 className="profile-username" onClick={() => {window.location.href = '/profile';}}>Username</h3>
            <p className="modify-title">Modify Password</p>
            <div className="modify-password-form-container">
                <form className="modify-password-form" onSubmit={handleSubmit}>
                    <h2 className="modify-password-label">Old Password:</h2>
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        className="old-password-input"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <h2 className="modify-password-label">New Password:</h2>
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        className="new-password-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <h2 className="modify-password-label">Confirm New Password:</h2>
                    <input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        className="confirm-new-password-input"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <div className="buttons-container">
                        <div className="modify-password-button-container-modifypasswordpage">
                            <button type="submit" className="modify-password-button-modifypasswordpage">Modify</button>
                        </div>
                        <div className="cancel-password-button-container-modifypasswordpage">
                            <button type="button" className="cancel-password-button-modifypasswordpage" onClick={() => {window.location.href = '/profile';}}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModifyPassword;