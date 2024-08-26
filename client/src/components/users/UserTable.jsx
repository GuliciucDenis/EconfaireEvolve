import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Spacer } from "@nextui-org/react";
import { getUsers } from '../../services/userService';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchObjective, setSearchObjective] = useState('');

  useEffect(() => { 
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { key: "id", label: "Id" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Actions" },
  ];

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchObjectiveChange = (e) => {
    setSearchObjective(e.target.value);
  };

  return (
    <div className="user-table-container">
      <div className="flex justify-around items-center mb-5">
        <div>
          <Input 
            clearable 
            underlined 
            labelPlaceholder="Search name" 
            value={searchName} 
            onChange={handleSearchNameChange}
            placeholder="Search name"
          />
        </div>
        <div>
          <Input 
            clearable 
            underlined 
            labelPlaceholder="Search Objective" 
            value={searchObjective} 
            onChange={handleSearchObjectiveChange} 
            placeholder="Search Objective"
          />
        </div>
        <div>
          <Button auto shadow>Filter</Button>
        </div>
        <div>
          <Button auto shadow color="primary">Create User</Button>
        </div>
      </div>
      <Table 
        aria-label="User table"
        selectionMode="multiple"
        selectionBehavior="toggle"
        className="user-table shadow-lg"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody 
          items={users} 
          loadingContent={<div className="text-center py-4">Loading users...</div>}
          emptyContent={<div className="text-center py-4">No users found</div>}
          isLoading={loading}
        >
          {(user) => (
            <TableRow key={user.email}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'actions' ? (
                    <div className="flex gap-2">
                      <Button auto shadow color="primary">Add Objectives</Button>
                      <Button auto shadow color="danger">Delete Objectives</Button>
                      <Button auto shadow color="success">See Objectives</Button>
                    </div>
                  ) : (
                    user[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;