import React from 'react';
import UserTable from '../../components/users/UserTable';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserTable />
    </div>
  );
};

export default UserDashboard;