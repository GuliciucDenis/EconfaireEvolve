import React from 'react';
import ProfilePicture from '../../images/ProfilePicture.jpg';
import './ProfileImage.css'; // Importă fișierul CSS
import Background from '../background/Background'; // Import corect pentru Background

const ProfileImage = () => {
  return (
    <div>
      <Background />
      <div className="profile-image-container">
        <img src={ProfilePicture} alt="Profile" className="profile-image" />
      </div>
    </div>
  );
};

export default ProfileImage;
