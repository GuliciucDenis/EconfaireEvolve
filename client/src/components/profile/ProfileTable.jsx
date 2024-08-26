import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getUserById } from '../../services/userService';

const ProfileTable = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById();
        console.log(user);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-[#6296CD]">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center py-4 text-[#6296CD]">No user data available</div>;
  }

  return (
    <Table 
        aria-label="User profile information"
      className="max-w-md bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <TableHeader>
        <TableColumn className="bg-[#6296CD] text-white">Personal information</TableColumn>
        <TableColumn className="bg-[#6296CD] text-white">Value</TableColumn>  
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell className="font-semibold text-[#6296CD]">First name</TableCell>
          <TableCell>{userData.firstName}</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell className="font-semibold text-[#6296CD]">Last name</TableCell>
          <TableCell>{userData.lastName}</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell className="font-semibold text-[#6296CD]">Email</TableCell>
          <TableCell>{userData.email}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProfileTable;