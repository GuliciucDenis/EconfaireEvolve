import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getUser } from '../../services/userService';
import LanguageSelector from '../language-selector';
import { useTranslation } from 'react-i18next';

const ProfileTable = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {t}=useTranslation();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
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
    return <div className="text-center py-4 text-[#6296CD]">{t('profileTable.loading')}</div>;
  }

  if (!userData) {
    return <div className="text-center py-4 text-[#6296CD]">{t('profileTable.userData')}</div>;
  }

  return (
    <Table 
        aria-label="User profile information"
      className="max-w-md bg-white overflow-hidden"
    >
      <TableHeader>
        <TableColumn className="bg-[#6296CD] text-white">{t('profileTable.personalInfo')}</TableColumn>
        <TableColumn className="bg-[#6296CD] text-white"></TableColumn>  
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell className="font-semibold text-[#6296CD]">{t('profileTable.firstName')}</TableCell>
          <TableCell>{userData.firstName}</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell className="font-semibold text-[#6296CD]">{t('profileTable.lastName')}</TableCell>
          <TableCell>{userData.lastName}</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell className="font-semibold text-[#6296CD]">{t('profileTable.email')}</TableCell>
          <TableCell>{userData.email}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProfileTable;