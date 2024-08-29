import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";
import { getUsers } from '../../services/userService';
import './UserTable.css';
import { useNavigate } from "react-router-dom"

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchObjective, setSearchObjective] = useState('');

  const navigate = useNavigate()

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

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="user-table-container">
      <div className="flex justify-around items-center mb-5 user-table">
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
          <Button auto shadow color="primary" onClick={() => {
            navigate('/create-user');
          }}>Add New User</Button>
        </div>
      </div>
      <Table
        isHeaderSticky
        aria-label="User table"
        selectionMode="multiple"
        selectionBehavior="toggle"
        classNames={{
          base: "max-h-[380px] overflow-hidden",
          table: "overflow-scroll min-w-[1000px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody
          items={filteredUsers}
          loadingContent={<div className="text-center py-4">Loading users...</div>}
          emptyContent={<div className="text-center py-4">No users found</div>}
          isLoading={loading}
        >
          {(user) => (
            <TableRow key={user.email}>
              {(columnKey) => (
                <TableCell className={columnKey === 'actions' ? 'max-w-[400px]' : 'max-w-[200px]'} >
                  {columnKey === 'actions' ? (
                    <div className="flex gap-2">
                      <Button auto shadow color="primary" onClick={() => {
                        navigate(`/edit-objectives/${user.id}`);
                      }}>Edit Objectives</Button>
                      <Button
                        auto
                        shadow
                        color="success"
                        style={{ color: 'white' }}
                        onClick={() => navigate(`/objectives/${user.id}`)}
                      >
                        See Objectives
                      </Button>
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
