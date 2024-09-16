import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Snippet } from "@nextui-org/react";
import { deleteUser, getUsers } from "../../services/userService";
import "./UserTable.css";
import { useNavigate } from "react-router-dom";
import DeleteUserPopup from "../common/DeleteUserPopup/DeleteUserPopup";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchObjective, setSearchObjective] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "id", label: "Id", minWidth: "280px", maxWidth: "280px" },
    { key: "firstName", label: "First Name", minWidth: "175px", maxWidth: "200px" },
    { key: "lastName", label: "Last Name", minWidth: "175px", maxWidth: "200px" },
    { key: "email", label: "Email", minWidth: "175px", maxWidth: "200px" },
    { key: "actions", label: "Actions", minWidth: " px", maxWidth: "280px" },
  ];

  const handleSelectionChange = (keys) => {
    // Convert keys to an array if it's not already an array
    const selectedKeysArray = Array.from(keys);
    // Map the keys to corresponding user IDs
    const selectedIds = selectedKeysArray.map((key) =>
      users.find((user) => user.email === key)?.id
    );
    setSelectedUsers(selectedIds.filter(Boolean)); // Set only valid IDs
  };
  

  // Function to handle deletion of selected users
const deleteSelectedUsers = async () => {
  try {
    await Promise.all(
      selectedUsers.map(async (userId) => {
        console.log("ID-ul este: ", userId);
        await deleteUser(userId);
      })
    );
    // Correctly use `selectedUsers` instead of `setSelectedUsers`
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    setSelectedKeys([]);
    // alert("User(s) deleted successfully");
  } catch (error) {
    console.error("Error deleting users:", error);
    alert("An error occurred while deleting user(s)");
  }
};


  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchObjectiveChange = (e) => {
    setSearchObjective(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleUserDeleted = (deletedUserId) => {
    setUsers(users.filter((user) => user.id !== deletedUserId));
  };

  return (
    <div className="user-table-container">
      <div className="flex justify-between items-center mb-5 user-table">
        <div>
          <Input
            clearable
            underlined
            labelPlaceholder="Search name"
            value={searchName}
            onChange={handleSearchNameChange}
            placeholder="Search name"
            className="w-[330px]" 
          />
        </div>
        <div className="flex gap-2">
          {/* <Button auto shadow>
            Filter
          </Button> */}
          <Button
            auto
            shadow
            color="primary"
            onClick={() => {
              navigate("/create-user");
            }}
          >
            Add New User
          </Button>
          {selectedUsers.length > 0 ? (
            //Button to delete a selected user
            selectedUsers.length === 1 ? (
              <Button
                auto
                shadow
                color="danger"
                onClick={deleteSelectedUsers}
                onUserDeleted={handleUserDeleted}
              >
                Delete User
              </Button>
            ) : (
              <Button
                auto
                shadow
                color="danger"
                onClick={deleteSelectedUsers}
                onUserDeleted={handleUserDeleted}
              >
                Delete Users
              </Button>
            )
          ) : (
            <Button
            auto
            shadow
            color="danger"
            onClick={() => setIsDeletePopupOpen(true)}
            >
              Delete User By Id
            </Button>
          )}
        </div>
      </div>
      <Table
        isHeaderSticky
        aria-label="User table"
        selectionMode="multiple"
        selectedKeys={selectedKeys} // Bind the selection state to control the selection visually
        onSelectionChange={(keys) => {
          const selectedKeysArray = Array.from(keys);
          setSelectedKeys(selectedKeysArray); // Update table's visual selection state
          handleSelectionChange(keys); // Update the IDs to be used for deletion
        }}
        selectionBehavior="toggle"
        classNames={{
          base: "max-h-[380px] overflow-hidden",
          table: "overflow-scroll min-w-[1000px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn 
              key={column.key} 
              style={{ 
                minWidth: column.minWidth, 
                maxWidth: column.maxWidth,
                width: `clamp(${column.minWidth}, auto, ${column.maxWidth})`
              }}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredUsers}
          loadingContent={
            <div className="text-center py-4">Loading users...</div>
          }
          emptyContent={<div className="text-center py-4">No users found</div>}
          isLoading={loading}
        >
          {(user) => (
            <TableRow key={user.email} value={user.email}>
              {(columnKey) => (
                <TableCell
                  style={{
                    minWidth: columns.find(col => col.key === columnKey)?.minWidth,
                    maxWidth: columns.find(col => col.key === columnKey)?.maxWidth,
                    width: `clamp(${columns.find(col => col.key === columnKey)?.minWidth}, auto, ${columns.find(col => col.key === columnKey)?.maxWidth})`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {columnKey === "id" ? (
                    <Snippet disableTooltip hideSymbol variant="bordered" color="default">
                      {user.id}
                    </Snippet>
                  ) : columnKey === "actions" ? (
                    <div className="flex gap-2">
                      <Button
                        auto
                        shadow
                        color="primary"
                        onClick={() => {
                          navigate(`/edit-objectives/${user.id}`);
                        }}
                      >
                        Edit Objectives
                      </Button>
                      <Button
                        auto
                        shadow
                        color="success"
                        style={{ color: "white" }}
                        onClick={() => navigate(`/see-objectives/${user.id}`)}
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
      <DeleteUserPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
};

export default UserTable;