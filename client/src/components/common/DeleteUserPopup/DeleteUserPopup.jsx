import React, { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import "./DeleteUserPopup.css";
import { useTranslation } from "react-i18next";

const DeleteUserPopup = ({ isOpen, onClose, onUserDeleted }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState(null);
  const {t}=useTranslation();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    } else {
      // Clear the search bar when the popup is closed
      setSearchId("");
      setSelectedUser(null);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setMessage({
        type: "error",
        text: t('deleteUserPopup.error'),
      });
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setSelectedUser(null);
        onUserDeleted(selectedUser.id);
        setMessage({ type: "success", text: t('deleteUserPopup.success') });
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 2000);
      } catch (error) {
        setMessage({
          type: "error",
          text: t('deleteUserPopup.error2'),
        });
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.id.toLowerCase().includes(searchId.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="delete-user-popup">
      <div className="delete-user-popup-content">
        <h2>{t('deleteUserPopup.title')}</h2>
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <input
          type="text"
          placeholder={t('deleteUserPopup.searchId')}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className={selectedUser?.id === user.id ? "selected" : ""}
              onClick={() => setSelectedUser(user)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedUser(user);
                }
              }}
              tabIndex={0}
            >
              {user.firstName} {user.lastName} (ID: {user.id})
            </li>
          ))}
        </ul>
        <div className="button-group">
          <button
            className="delete-button"
            onClick={handleDeleteUser}
            disabled={!selectedUser}
          >
            {t('deleteUserPopup.delete')}
          </button>
          <button className="cancel-button" onClick={onClose}>
          {t('deleteUserPopup.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserPopup;
