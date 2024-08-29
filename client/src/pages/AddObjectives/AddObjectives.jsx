import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import AddObjectivesCard from '../../components/AddObjectives/AddObjectivesCard';
import User from '../../components/common/user/User';
import './AddObjectives.css';
import { getObjectivesByUserToken, getObjectiveById, deleteObjectiveById } from "../../services/objectiveService";
import { getUserById } from "../../services/userService";

const AddObjectives = () => {
  const { userId } = useParams();
  const [selectedRecommendedObjective, setSelectedRecommendedObjective] = useState(null);
  const [selectedExistingObjective, setSelectedExistingObjective] = useState(null);
  const [newObjectiveName, setNewObjectiveName] = useState("");
  const [userObjectives, setUserObjectives] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserObjectives = async () => {
      try {
        const userObjectiveIds = await getObjectivesByUserToken(userId);
        if (Array.isArray(userObjectiveIds)) {
          const userObjectives = await Promise.all(userObjectiveIds.map(async (id) => {
            const objective = await getObjectiveById(id);
            return objective;
          }));
          setUserObjectives(userObjectives);
        } else {
          console.error("Received invalid data for user objectives");
          setUserObjectives([]);
        }
      } catch (error) {
        console.error("Error fetching user objectives:", error);
        setUserObjectives([]);
      }
    };
    fetchUserObjectives();
  }, [userId]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await getUserById(userId);
        setUserName(`${user.firstName} ${user.lastName}`);
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName('Unknown User');
      }
    };
    fetchUserName();
  }, [userId]);

  const objectivesData = [
    {
        title: "Recommended Objectives",
        content: ["Objective 1", "Objective 2", "Objective 3"]
    },
    {
        title: "Existing Objectives",
        content: ["Objective 4", "Objective 5", "Objective 6"]
    }
  ]

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

  const handleNewObjectiveNameChange = (e) => {
    setNewObjectiveName(e.target.value);
  };

  const handleCreateObjective = () => {
    // Logic to create a new objective
    console.log("Creating new objective:", newObjectiveName);
    setNewObjectiveName("");
  };

  const handleDeleteObjective = async () => {
    if (selectedExistingObjective !== null) {
      const objectiveToDelete = userObjectives[selectedExistingObjective];
      console.log("Deleting objective:", objectiveToDelete);
      await deleteObjectiveById(objectiveToDelete.id); // Ensure this call waits for the deletion
      setUserObjectives(userObjectives.filter((_, index) => index !== selectedExistingObjective));
      setSelectedExistingObjective(null); // Reset the selection
    }
  };

  return (
    <div className="add-objectives-container">
      <Background/>
      <User />
      <div className="content-wrapper">
        <div className="user-info">User selected: {userName}</div>
        <div className="main-content">
          <div className="cards-container">
            <AddObjectivesCard 
              title={objectivesData[0].title} 
              content={objectivesData[0].content.map((objective, index) => (
                <div 
                  key={index} 
                  onClick={() => handleRecommendedObjectiveClick(index)}
                  className={`objective-item ${index === selectedRecommendedObjective ? 'selected' : ''}`}
                >
                  {objective}
                </div>
              ))} 
            />
            <AddObjectivesCard 
              title='Existing Objectives' 
              content={userObjectives.map((objective, index) => (
                <div 
                  key={index} 
                  onClick={() => handleExistingObjectiveClick(index)}
                  className={`objective-item ${index === selectedExistingObjective ? 'selected' : ''}`}
                >
                  {objective.title}
                </div>
              ))} 
            />
          </div>
          <div className="decision-container">
            <div className="actions-container">
              {selectedRecommendedObjective !== null && (
                <button className="action-button">Assign Objective</button>
              )}
              {selectedExistingObjective !== null && (
                <>
                  <button className="action-button">Edit Subobjectives</button>
                  <button className="action-button delete-button" onClick={handleDeleteObjective}>Delete Objective</button>
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
      <Navbar/>
    </div>
  );
};

export default AddObjectives;
