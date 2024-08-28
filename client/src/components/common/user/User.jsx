import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfilePicHeader from '../../../images/ProfilePicHeader.png';
import ProfilePictureHeader from '../../../images/ProfilePictureHeader.png';
import './User.css';
import { getUserById } from '../../../services/userService';

const User = () => {
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
            setUserData(JSON.parse(cachedUserData));
            setIsLoading(false);
        }

        const fetchUserData = async () => {
            try {
                const user = await getUserById();
                if (JSON.stringify(user) !== cachedUserData) {
                    setUserData(user);
                    localStorage.setItem('userData', JSON.stringify(user));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

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
            <div className="user-username-container">
                {isLoading ? (
                    <div className="username-skeleton"></div>
                ) : userData ? (
                    <h3 className="user-username">{`${userData.firstName} ${userData.lastName}`}</h3>
                ) : (
                    <div className="username-error">Error loading user data</div>
                )}
            </div>
        </div>
    );
};

export default User;