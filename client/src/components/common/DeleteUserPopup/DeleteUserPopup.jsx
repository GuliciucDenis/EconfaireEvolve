import React, { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import "./DeleteUserPopup.css";

const DeleteUserPopup = ({ isOpen, onClose, onUserDeleted }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch users. Please try again.",
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
        setMessage({ type: "success", text: "User deleted successfully." });
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 2000);
      } catch (error) {
        console.error("Error deleting user:", error);
        setMessage({
          type: "error",
          text: "Failed to delete user. Please try again.",
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
        <h2>Delete User</h2>
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <input
          type="text"
          placeholder="Search by ID"
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
            Delete Selected User
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserPopup;
