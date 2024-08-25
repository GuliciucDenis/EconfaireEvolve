import React from 'react';
import UserTable from '../../components/users/UserTable';
import './UserDashboard.css';
import Navbar from '../../components/common/navbar/Navbar';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <Navbar />
      <div className="content">
        <div className="title-container">
          <h1 className="title">User Management</h1>
        </div>
        <UserTable />
      </div>
    </div>
  );
};

export default UserDashboard;