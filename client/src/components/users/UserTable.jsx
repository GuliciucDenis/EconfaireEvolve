import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import {getUsers} from '../../services/userService';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <Table 
      aria-label="User table"
      classNames={{
        base: "max-w-full",
        table: "min-w-full",
        th: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
        td: "text-gray-800 dark:text-gray-200",
      }}
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
            {(columnKey) => <TableCell>{user[columnKey]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;