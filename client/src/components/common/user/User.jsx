import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfilePicHeader from '../../../images/ProfilePicHeader.png';
import ProfilePictureHeader from '../../../images/ProfilePictureHeader.png';
import './User.css';

const User = () => {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        setIsClicked(!isClicked);
        navigate('/profile');
    };

    const isProfileOrModifyPassword = ['/profile', '/modifypassword'].includes(location.pathname);
    const profilePicture = isProfileOrModifyPassword ? ProfilePicHeader : ProfilePictureHeader;

    return (
        <div className="user-container" onClick={handleClick}>
            <img 
                src={profilePicture} 
                alt="Profile Pic Header" 
                className={`user-profile-pic ${isClicked ? 'clicked' : ''}`} 
            />
            <h3 className="user-username">Username</h3>
        </div>
    );
};

export default User;