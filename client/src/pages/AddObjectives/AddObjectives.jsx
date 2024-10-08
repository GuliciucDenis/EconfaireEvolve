import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import AddObjectivesCard from '../../components/AddObjectives/AddObjectivesCard';
import User from '../../components/common/user/User';
import './AddObjectives.css';
import { getObjectivesByUserId, getObjectiveById, deleteObjectiveById, createObjective} from "../../services/objectiveService";
import {getUser, getUserById} from "../../services/userService";
import AddObjectivesPopup from "../../components/common/AddObjectivesPopup/AddObjectivesPopup";
import SetDeadlinePopup from "../../components/common/SetDeadlinePopup/SetDeadlinePopup";
import { useNavigate } from "react-router-dom";
// import ViewObjectives from "../../components/ViewObjectives/ViewObjectives";
// import EditObjectives from "../../components/EditObjectives/EditObjectives";

const AddObjectives = () => {
  const [selectedRecommendedObjective, setSelectedRecommendedObjective] = useState(null);
  const [selectedExistingObjective, setSelectedExistingObjective] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isSetDeadlinePopupOpen, setIsSetDeadlinePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { id  } = useParams();
  const userId = id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserObjectives = async () => {
      const userObjectiveIds = await getObjectivesByUserId(userId);
      const userObjectives = await Promise.all(userObjectiveIds.map(async (id) => {
        const objective = await getObjectiveById(id);
        return objective;
      }));
      setUserObjectives(userObjectives);
    };
    const fetchCurrentUser = async () => {
      const user = await getUserById(userId);
      setCurrentUser(user);
      console.log("Current user:", currentUser);
    };
    fetchUserObjectives();
    fetchCurrentUser();
  }, []);

  const objectivesData = [
  {
    "title": "Perseverance",
    "description": "Maintain a consistent effort towards achieving long-term goals despite challenges.",
    "deadline": "2024-08-28",
    "assignedTo": "0",
    "gradeAdmin": 1,
    "status": "new",
    "subObjectives": []
  },
  {
    "title": "Creativity",
    "description": "Encourage innovative thinking and the generation of new ideas.",
    "deadline": "2024-08-28",
    "assignedTo": "0",
    "gradeAdmin": 1,
    "status": "new",
    "subObjectives": []
  },
  {
    "title": "Time Management",
    "description": "Effectively prioritize tasks to make the best use of available time.",
    "deadline": "2024-08-28",
    "assignedTo": "0",
    "gradeAdmin": 1,
    "status": "new",
    "subObjectives": []
  },
  {
    "title": "Adaptability",
    "description": "Demonstrate flexibility and the ability to adjust to new situations and changes.",
    "deadline": "2024-08-28",
    "assignedTo": "0",
    "gradeAdmin": 1,
    "status": "new",
    "subObjectives": []
  },
  {
    "title": "Continuous Learning",
    "description": "Engage in ongoing education and skill development to stay current and improve.",
    "deadline": "2024-08-28",
    "assignedTo": "0",
    "gradeAdmin": 1,
    "status": "new",
    "subObjectives": []
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

  const handleCreateObjective = () => {
    setIsCreatePopupOpen(true);
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

  const handleAssignObjective = async () => {
    if (selectedRecommendedObjective !== null) {
      setIsSetDeadlinePopupOpen(true);
    }
  };

  return (
    <div className="add-objectives-container">
      <Background/>
      <User />
      <div className="content-wrapper">
        <div className="user-info">{currentUser ? (
            <>Selected user: {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>Loading user information...</>
          )}</div>
        <div className="main-content">
          <div className="cards-container">
            <AddObjectivesCard 
              title='Recommended Objectives' 
              content={objectivesData.map((objective, index) => (
                <div 
                  key={index} 
                  onClick={() => handleRecommendedObjectiveClick(index)}
                  className={`objective-item ${index === selectedRecommendedObjective ? 'selected' : ''}`}
                >
                  {objective.title}
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
                <button className="action-button" onClick={handleAssignObjective}>Assign Objective</button>
              )}
              {selectedExistingObjective !== null && (
                <>
                  <button className="action-button" onClick={() => navigate(`/edit-subobjectives/${userObjectives[selectedExistingObjective].id}`)}>Edit Subobjectives</button>
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
      <Navbar />
      <AddObjectivesPopup
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onSubmit={async (newObjective) => {
          // Here you would typically call an API to create the objective
          setIsCreatePopupOpen(false);
          setUserObjectives([...userObjectives, newObjective]);
          // After successfully creating the objective, you might want to refresh the list of objectives
        }}
        userId={userId}     />
        <SetDeadlinePopup
          isOpen={isSetDeadlinePopupOpen}
          onClose={() => setIsSetDeadlinePopupOpen(false)}
          onSubmit={async (newObjective) => {
            setIsSetDeadlinePopupOpen(false);
            setUserObjectives([...userObjectives, newObjective]);
          }}
          title={objectivesData[selectedRecommendedObjective] ? objectivesData[selectedRecommendedObjective].title : ""}
          userId={userId}
        />
    </div>
  );
};

export default AddObjectives;