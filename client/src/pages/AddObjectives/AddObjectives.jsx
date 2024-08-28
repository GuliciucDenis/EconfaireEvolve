import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import AddObjectivesCard from "../../components/AddObjectives/AddObjectivesCard";
import User from "../../components/common/user/User";
import "./AddObjectives.css";
import {
  getObjectivesByUserToken,
  getObjectiveById,
  deleteObjectiveById,
} from "../../services/objectiveService";
import AddObjectivesPopup from "../../components/common/AddObjectivesPopup/AddObjectivesPopup";

const AddObjectives = () => {
  const [selectedRecommendedObjective, setSelectedRecommendedObjective] =
    useState(null);
  const [selectedExistingObjective, setSelectedExistingObjective] =
    useState(null);
  const [newObjectiveName, setNewObjectiveName] = useState("");
  const [userObjectives, setUserObjectives] = useState([]);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  useEffect(() => {
    const fetchUserObjectives = async () => {
      const userObjectiveIds = await getObjectivesByUserToken();
      const userObjectives = await Promise.all(
        userObjectiveIds.map(async (id) => {
          const objective = await getObjectiveById(id);
          return objective;
        })
      );
      setUserObjectives(userObjectives);
    };
    fetchUserObjectives();
  }, []);

  const objectivesData = [
    {
      title: "Recommended Objectives",
      content: ["Objective 1", "Objective 2", "Objective 3"],
    },
    {
      title: "Existing Objectives",
      content: ["Objective 4", "Objective 5", "Objective 6"],
    },
  ];

  const handleRecommendedObjectiveClick = (index) => {
    // Reset existing objective selection
    setSelectedExistingObjective(null);
    if (index === selectedRecommendedObjective) {
      setSelectedRecommendedObjective(null);
    } else {
      setSelectedRecommendedObjective(index);
    }
  };

  const handleExistingObjectiveClick = (index) => {
    // Reset recommended objective selection
    setSelectedRecommendedObjective(null);
    if (index === selectedExistingObjective) {
      setSelectedExistingObjective(null);
    } else {
      setSelectedExistingObjective(index);
    }
  };

  const handleCreateObjective = () => {
    setIsCreatePopupOpen(true);
  };

  const handleDeleteObjective = async () => {
    if (selectedExistingObjective !== null) {
      const objectiveToDelete = userObjectives[selectedExistingObjective];
      console.log("Deleting objective:", objectiveToDelete);
      await deleteObjectiveById(objectiveToDelete.id); // Ensure this call waits for the deletion
      setUserObjectives(
        userObjectives.filter((_, index) => index !== selectedExistingObjective)
      );
      setSelectedExistingObjective(null); // Reset the selection
    }
  };

  const handleAssignObjective = async () => {
    if (selectedRecommendedObjective !== null) {
      const objectiveToAssign = objectivesData[selectedRecommendedObjective];
      console.log("Assigning objective:", objectiveToAssign);
      objectiveToAssign.assignedTo = userId;
      const assignedObjective = await createObjective(objectiveToAssign);
      setUserObjectives([...userObjectives, assignedObjective]);
    }
  };

  return (
    <div className="add-objectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        <div className="user-info">User selected: Id Username</div>
        <div className="main-content">
          <div className="cards-container">
            <AddObjectivesCard
              title={objectivesData[0].title}
              content={objectivesData[0].content.map((objective, index) => (
                <div
                  key={index}
                  onClick={() => handleRecommendedObjectiveClick(index)}
                  className={`objective-item ${
                    index === selectedRecommendedObjective ? "selected" : ""
                  }`}
                >
                  {objective.title}
                </div>
              ))}
            />
            <AddObjectivesCard
              title="Existing Objectives"
              content={userObjectives.map((objective, index) => (
                <div
                  key={index}
                  onClick={() => handleExistingObjectiveClick(index)}
                  className={`objective-item ${
                    index === selectedExistingObjective ? "selected" : ""
                  }`}
                >
                  {objective.title}
                </div>
              ))}
            />
          </div>
          <div className="decision-container">
            <div className="actions-container">
              {selectedRecommendedObjective !== null && (
                <button className="action-button" onClick={handleAssignObjective}>Assign Objective</button>
              )}
              {selectedExistingObjective !== null && (
                <>
                  <button className="action-button">Edit Subobjectives</button>
                  <button
                    className="action-button delete-button"
                    onClick={handleDeleteObjective}
                  >
                    Delete Objective
                  </button>
                </>
              )}
            </div>

            <div className="create-objective-container">
              <h2>Add a new objective</h2>
              <button onClick={handleCreateObjective}>Create Objective</button>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <AddObjectivesPopup
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onSubmit={async (newObjective) => {
          // Here you would typically call an API to create the objective
          console.log("Creating new objective:", newObjective);
          setIsCreatePopupOpen(false);
          // After successfully creating the objective, you might want to refresh the list of objectives
        }}
      />
    </div>
  );
};

export default AddObjectives;
