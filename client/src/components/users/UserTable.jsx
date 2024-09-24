import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Snippet } from "@nextui-org/react";
import { deleteUser, getUsers } from "../../services/userService";
import "./UserTable.css";
import { useNavigate } from "react-router-dom";
import DeleteUserPopup from "../common/DeleteUserPopup/DeleteUserPopup";
import FilterPopup from "../common/FilterPopup/FilterPopup";
import { getObjectiveById } from "../../services/objectiveService";
import ConfirmDeletePopup from "../common/ConfirmDeletePopup/ConfirmDeletePopup";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchObjective, setSearchObjective] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredUsersByCriteria, setFilteredUsersByCriteria] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
  
      // Pentru fiecare utilizator, obținem detaliile obiectivelor pe baza ID-urilor din objectiveList
      const usersWithObjectives = await Promise.all(
        response.map(async (user) => {
          if (user.objectiveList && Array.isArray(user.objectiveList)) {
            const detailedObjectives = await Promise.all(
              user.objectiveList.map(async (objectiveId) => {
                const objectiveDetails = await fetchObjectiveDetails(objectiveId);
                return objectiveDetails; // Detaliile obiectivului preluate
              })
            );
            return { ...user, objectives: detailedObjectives };
          }
          return user;
        })
      );
  
      setUsers(usersWithObjectives);
      setFilteredUsersByCriteria(usersWithObjectives);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };  
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchObjectiveDetails = async (objectiveId) => {
    try {
      const response = await getObjectiveById(objectiveId);
      return response;
    } catch (error) {
      console.error("Error fetching objective details:", error);
      return null;
    }
  };

  const columns = [
    { key: "id", label: "Id", minWidth: "280px", maxWidth: "280px" },
    { key: "firstName", label: "First Name", minWidth: "175px", maxWidth: "200px" },
    { key: "lastName", label: "Last Name", minWidth: "175px", maxWidth: "200px" },
    { key: "email", label: "Email", minWidth: "175px", maxWidth: "200px" },
    { key: "actions", label: "Actions", minWidth: " px", maxWidth: "280px" },
  ];

  const handleSelectionChange = (keys) => {
    const selectedKeysArray = Array.from(keys);
    const selectedIds = selectedKeysArray.map((key) =>
      users.find((user) => user.email === key)?.id
    );
  
    setSelectedUsers(selectedIds.filter(Boolean));
  
    // Dacă există utilizatori selectați, schimbăm butonul la "Deselect All Users"
    if (selectedKeysArray.length > 0) {
      setIsAllSelected(true); // Activează modul "Deselect All"
    } else {
      setIsAllSelected(false); // Dacă nu sunt selectați utilizatori, revenim la "Select All"
    }
  };  

  const handleSelectAll = () => {
    const allUserEmails = users.map(user => user.email);
    setSelectedKeys(allUserEmails); // Selectează toate email-urile
    setSelectedUsers(users.map(user => user.id)); // Selectează toate ID-urile utilizatorilor
  };
  
  const handleDeselectAll = () => {
    setSelectedKeys([]); // Golește selecția
    setSelectedUsers([]); // Golește ID-urile selectate
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
      setFilteredUsersByCriteria(filteredUsersByCriteria.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setSelectedKeys([]);
      // alert("User(s) deleted successfully");
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("An error occurred while deleting user(s)");
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmDeleteOpen(true); // Afișează popup-ul când se apasă butonul
  };
  
  const handleClosePopup = () => {
    setIsConfirmDeleteOpen(false); // Închide popup-ul
  };
  
  const handleConfirmDelete = () => {
    deleteSelectedUsers(); // Șterge utilizatorii selectați
    setIsConfirmDeleteOpen(false); // Închide popup-ul după confirmare
  };  

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchObjectiveChange = (e) => {
    setSearchObjective(e.target.value);
  };

  const filteredUsersByName = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleUserDeleted = (deletedUserId) => {
    setUsers(users.filter((user) => user.id !== deletedUserId));
  };

  // Funcția care va aplica filtrul pe baza titlului obiectivului și a notelor
  const handleFilter = (criteria) => {
    if (criteria.filterType === "Objective Title" && criteria.objectiveTitle) {
      const filtered = users.filter((user) =>
        user.objectives && // Verificăm dacă utilizatorul are obiective
        Array.isArray(user.objectives) &&
        user.objectives.some(
          (objective) =>
            objective.title.toLowerCase() === criteria.objectiveTitle.toLowerCase() && // Verificăm titlul obiectivului
            // Verificăm dacă gradeAdmin sau gradeEmployee sunt 1
            (objective.gradeAdmin === 1 || objective.gradeEmployee === 1)
        )
      );

      setFilteredUsersByCriteria(filtered.length > 0 ? filtered : []);
      setIsFiltered(true);
    }
    else
      if(criteria.filterType === "Number of Objectives")
      {
        const numObjectives = parseInt(criteria.numObjectives, 10);

        // Calculăm numărul de obiective active (gradeAdmin sau gradeEmployee == 1) pentru fiecare utilizator
        const usersWithActiveObjectivesCount = users.map((user) => ({
          ...user,
          activeObjectivesCount: user.objectives
            ? user.objectives.filter((objective) => objective.gradeAdmin === 1 || objective.gradeEmployee === 1).length
            : 0,
        }));

        if (criteria.numFilterType === "exact") {
          const filtered = usersWithActiveObjectivesCount.filter((user) =>
            user.activeObjectivesCount === numObjectives
          );
          setFilteredUsersByCriteria(filtered.length > 0 ? filtered : []);
        } 
        else if (criteria.numFilterType === "ascending") {
          const sorted = [...usersWithActiveObjectivesCount].sort((a, b) =>
            a.activeObjectivesCount - b.activeObjectivesCount
          );
          setFilteredUsersByCriteria(sorted);
        } 
        else if (criteria.numFilterType === "descending") {
          const sorted = [...usersWithActiveObjectivesCount].sort((a, b) =>
            b.activeObjectivesCount - a.activeObjectivesCount
          );
          setFilteredUsersByCriteria(sorted);
        }
        setIsFiltered(true);
      }
      else
        if (criteria.filterType === "Deadline") {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Resetăm ora pentru a compara doar zilele
          let filtered = [];
        
          if (criteria.deadlineFilterType === "next-day") {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Resetăm ora la 00:00 pentru a compara doar ziua
          
            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective => {
                const objectiveDeadline = new Date(objective.deadline);
                objectiveDeadline.setHours(0, 0, 0, 0); // Resetăm ora și pentru deadline
          
                return objectiveDeadline.getTime() === tomorrow.getTime() &&
                       (objective.gradeAdmin === 1 || objective.gradeEmployee === 1);
              })
            );
          } else if (criteria.deadlineFilterType === "this-week") {
            const startOfWeek = new Date(today);
            const endOfWeek = new Date(today);

            // Setăm începutul săptămânii la luni (1) și sfârșitul săptămânii la duminică (7)
            const day = today.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day; // Dacă e duminică, setăm la -6 pentru luni
            startOfWeek.setDate(today.getDate() + diffToMonday);
            startOfWeek.setHours(0, 0, 0, 0); // Resetăm ora la începutul zilei

            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999); // Setăm sfârșitul zilei la duminică

            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective => {
                const deadline = new Date(objective.deadline);
                return deadline >= startOfWeek && deadline <= endOfWeek &&
                      (objective.gradeAdmin === 1 || objective.gradeEmployee === 1);
              })
            );
          } else if (criteria.deadlineFilterType === "this-month") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Prima zi a lunii curente
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ultima zi a lunii curente
          
            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective => {
                const deadline = new Date(objective.deadline);
                return deadline >= startOfMonth && deadline <= endOfMonth &&
                       (objective.gradeAdmin === 1 || objective.gradeEmployee === 1);
              })
            );
          } else if (criteria.deadlineFilterType === "next-week") {
            const dayOfWeek = today.getDay(); // 0 = duminică, 1 = luni, ..., 6 = sâmbătă

            // Calculăm câte zile sunt până la următoarea zi de luni
            const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

            // Creăm o variabilă care va avea valoarea zilei de luni din săptămâna viitoare
            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() + daysUntilNextMonday);

            // Setăm ora la începutul zilei pentru precizie
            nextMonday.setHours(0, 0, 0, 0);

            // Obținem ziua de duminică din săptămâna viitoare, adăugând 6 zile la luni
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + 6);
            nextSunday.setHours(23, 59, 59, 999); // Setăm ora la sfârșitul zilei
        
            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective => {
                const deadline = new Date(objective.deadline);
                return deadline >= nextMonday && deadline <= nextSunday &&
                      (objective.gradeAdmin === 1 || objective.gradeEmployee === 1);
              })
            );
          } else if (criteria.deadlineFilterType === "next-month") {
            const nextMonthStart = new Date(today);
            nextMonthStart.setMonth(today.getMonth() + 1);
            nextMonthStart.setDate(1); // Prima zi a lunii următoare
        
            const nextMonthEnd = new Date(nextMonthStart);
            nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1);
            nextMonthEnd.setDate(0); // Ultima zi a lunii următoare
            
            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective => {
                const deadline = new Date(objective.deadline);
                return deadline >= nextMonthStart && deadline <= nextMonthEnd &&
                      (objective.gradeAdmin === 1 || objective.gradeEmployee === 1);
              })
            );
          } else if (criteria.deadline) {
            // Filtrare după data setată
            filtered = users.filter(user =>
              user.objectives &&
              user.objectives.some(objective =>
                new Date(objective.deadline).toISOString().split('T')[0] === new Date(criteria.deadline).toISOString().split('T')[0] &&
                (objective.gradeAdmin === 1 || objective.gradeEmployee === 1)
              )
            );
          }
        
          setFilteredUsersByCriteria(filtered.length > 0 ? filtered : []);
          setIsFiltered(true);
        }
        else
          if(criteria.filterType === "Sort by Name")
          {
            const sortedUsers = [...users].sort((a,b) => {
              const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
              const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
              if (criteria.sortNameOrder === "asc")
                return nameA.localeCompare(nameB);
              else
                return nameB.localeCompare(nameA);
            });
            setFilteredUsersByCriteria(sortedUsers);
            setIsFiltered(true);
          }
          else
          {
            setFilteredUsersByCriteria(users); // Dacă nu se aplică filtrul, afișăm toți utilizatorii
            setIsFiltered(false);
          }
  };

  const filteredByCriteriaUsers = users.filter((user) => {
    const matchesObjectiveTitle = filterCriteria.objectiveTitle
      ? user.objectiveTitle?.toLowerCase() === filterCriteria.objectiveTitle.toLowerCase()
      : true;
    const matchesNumObjectives =
      filterCriteria.numObjectives && filterCriteria.numFilterType
        ? filterCriteria.numFilterType === "exact"
          ? user.numObjectives === parseInt(filterCriteria.numObjectives, 10)
          : filterCriteria.numFilterType === "ascending"
          ? user.numObjectives >= parseInt(filterCriteria.numObjectives, 10)
          : user.numObjectives <= parseInt(filterCriteria.numObjectives, 10)
        : true;
    const matchesDeadline = filterCriteria.deadline
      ? user.deadline === filterCriteria.deadline
      : true;
    const matchesGrades = user.objectives.some(
      (objective) => objective.gradeAdmin === 1 || objective.gradeEmployee === 1
    );

    return matchesObjectiveTitle && matchesNumObjectives && matchesDeadline && matchesGrades;
  });

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
          <Button
            auto
            shadow
            color={isAllSelected ? "secondary" : "primary"}
            onClick={() => {
              if (isAllSelected) {
                handleDeselectAll();
              } else {
                handleSelectAll();
              }
              setIsAllSelected(!isAllSelected);
            }}
          >
            {isAllSelected ? "Deselect All Users" : "Select All Users"}
          </Button>
          <Button 
            auto 
            shadow 
            onClick={() => {
              if (isFiltered) {
                setFilteredUsersByCriteria(users); // Resetează utilizatorii la lista inițială
                setIsFiltered(false); // Setează starea ca fiind nefiltrată
              } else {
                setIsFilterPopupOpen(true); // Deschide popup-ul de filtrare
              }
            }}
          >
            {isFiltered ? "Unfilter" : "Filter"}
          </Button>
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
                onClick={handleDeleteClick}
                onUserDeleted={handleUserDeleted}
              >
                Delete User
              </Button>
            ) : (
              <Button
                auto
                shadow
                color="danger"
                onClick={handleDeleteClick}
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
        items={filteredUsersByCriteria} // Folosim utilizatorii filtrați aici
        loadingContent={<div>Loading users...</div>}
        emptyContent={<div>No users found</div>}
        isLoading={loading}
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
          items={searchName ? filteredUsersByName : filteredUsersByCriteria} // Afișăm utilizatorii filtrați
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
      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={() => {
          setIsFilterPopupOpen(false);
        }}
        onFilter={handleFilter}
      />
      <ConfirmDeletePopup
        isOpen={isConfirmDeleteOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserTable;