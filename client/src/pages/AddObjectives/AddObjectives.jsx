import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import AddObjectivesCard from '../../components/AddObjectives/AddObjectivesCard';
import User from '../../components/common/user/User';
import './AddObjectives.css';
import { getObjectivesByUserId, getObjectiveById, deleteObjectiveById, createObjective} from "../../services/objectiveService";
import {getUserById} from "../../services/userService";
import AddObjectivesPopup from "../../components/common/AddObjectivesPopup/AddObjectivesPopup";
import SetDeadlinePopup from "../../components/common/SetDeadlinePopup/SetDeadlinePopup";
import { useNavigate } from "react-router-dom";

const AddObjectives = () => {
  const [selectedRecommendedObjective, setSelectedRecommendedObjective] = useState(null);
  const [selectedExistingObjective, setSelectedExistingObjective] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isSetDeadlinePopupOpen, setIsSetDeadlinePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const userId = id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserObjectives = async () => {
      try {
        const userObjectiveIds = await getObjectivesByUserId(userId);
        const objectives = await Promise.all(userObjectiveIds.map(async (id) => {
          const objective = await getObjectiveById(id);
          return objective;
        }));
        
        // Filter objectives to include only active ones
        const activeObjectives = objectives.filter(
          (objective) => objective.status !== 'completed' &&
          (objective.subObjectives.length === 0 || 
          objective.subObjectives.some(sub => sub.gradeAdmin <= 1 || sub.gradeEmployee <= 1) )
        );
        setUserObjectives(activeObjectives);
      } catch (error) {
        console.error("Failed to fetch user objectives:", error);
      }
    };
    const fetchCurrentUser = async () => {
      const user = await getUserById(userId);
      setCurrentUser(user);
    };
    fetchUserObjectives();
    fetchCurrentUser();
  }, [userId]);

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
  ];

  const handleRecommendedObjectiveClick = (index) => {
    setSelectedExistingObjective(null);
    setSelectedRecommendedObjective(index === selectedRecommendedObjective ? null : index);
  };

  const handleExistingObjectiveClick = (index) => {
    setSelectedRecommendedObjective(null);
    setSelectedExistingObjective(index === selectedExistingObjective ? null : index);
  };

  const handleCreateObjective = () => {
    setIsCreatePopupOpen(true);
  };

  const handleDeleteObjective = async () => {
    if (selectedExistingObjective !== null) {
      const objectiveToDelete = userObjectives[selectedExistingObjective];
      await deleteObjectiveById(objectiveToDelete.id);
      setUserObjectives(userObjectives.filter((_, index) => index !== selectedExistingObjective));
      setSelectedExistingObjective(null);
    }
  };

  const handleAssignObjective = () => {
    if (selectedRecommendedObjective !== null) {
      setIsSetDeadlinePopupOpen(true);
    }
  };

  return (
    <div className="add-objectives-container">
      <Background/>
      <User />
      <div className="content-wrapper">
        <div className="add-objectives-user-info">
          {currentUser ? (
            <>Selected user: {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>Loading user information...</>
          )}
        </div>
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
        onSubmit={(newObjective) => {
          setUserObjectives([...userObjectives, newObjective]);
          setIsCreatePopupOpen(false);
        }}
        userId={userId}     
      />
      <SetDeadlinePopup
        isOpen={isSetDeadlinePopupOpen}
        onClose={() => setIsSetDeadlinePopupOpen(false)}
        onSubmit={(newObjective) => {
          setUserObjectives([...userObjectives, newObjective]);
          setIsSetDeadlinePopupOpen(false);
        }}
        title={objectivesData[selectedRecommendedObjective]?.title || ""}
        userId={userId}
      />
    </div>
  );
};

export default AddObjectives;
