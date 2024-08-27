import React from 'react';
import './User.css';
import ProfilePictureHeader from '../../../images/ProfilePicHeader.png';

const User = () => {
    return (
        <div className="user-container">
                <img src={ProfilePictureHeader} alt="Profile Picture Header" className="user-profile-pic" />
        </div>
    );
};

export default User;