import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import AddObjectivesCard from '../../components/AddObjectives/AddObjectivesCard';
import User from '../../components/common/user/User';
import './AddObjectives.css';
import { getObjectivesByUserId, getObjectiveById, deleteObjectiveById, updateObjectiveStatus } from "../../services/objectiveService";
import { getUserById } from "../../services/userService";
import AddObjectivesPopup from "../../components/common/AddObjectivesPopup/AddObjectivesPopup";
import SetDeadlinePopup from "../../components/common/SetDeadlinePopup/SetDeadlinePopup";
import { useNavigate } from "react-router-dom";
import EditObjectivesPopup from "../../components/common/EditObjectivesPopup/EditObjectivesPopup";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/language-selector";

const AddObjectives = () => {
  const [selectedRecommendedObjective, setSelectedRecommendedObjective] = useState(null);
  const [selectedExistingObjective, setSelectedExistingObjective] = useState(null); // Single selection
  const [selectedExistingObjectives, setSelectedExistingObjectives] = useState([]); // Multiple selections
  const [userObjectives, setUserObjectives] = useState([]);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isSetDeadlinePopupOpen, setIsSetDeadlinePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const userId = id;
  const navigate = useNavigate();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState(null);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isEnabledMultiSelectButton,setIsEnabledMultiSelectButton] = useState(false);
  const [objectiveUpdated, setObjectiveUpdated] = useState(false);
  const {t}=useTranslation();

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
              objective.subObjectives.some(sub => sub.gradeAdmin <= 1 || sub.gradeEmployee <= 1))
        );
        // Check for inactive objectives and update their status to 'completed'
        const inactiveObjectives = objectives.filter(
          (objective) =>
            !activeObjectives.includes(objective) && objective.status !== 'completed'
        );

        // Update the status of inactive objectives to 'completed'
        for (const inactiveObjective of inactiveObjectives) {
          await updateObjectiveStatus(inactiveObjective.id, 'completed');
        }
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
    setObjectiveUpdated(false);
  }, [userId, objectiveUpdated]);

  const objectivesData = [
    {
      "title": t('editObjectives.perseverance'),
      "description": "Maintain a consistent effort towards achieving long-term goals despite challenges.",
      "deadline": "2024-08-28",
      "assignedTo": "0",
      "gradeAdmin": 1,
      "status": "new",
      "subObjectives": []
    },
    {
      "title": t('editObjectives.creativity'),
      "description": "Encourage innovative thinking and the generation of new ideas.",
      "deadline": "2024-08-28",
      "assignedTo": "0",
      "gradeAdmin": 1,
      "status": "new",
      "subObjectives": []
    },
    {
      "title": t('editObjectives.timeManagement'),
      "description": "Effectively prioritize tasks to make the best use of available time.",
      "deadline": "2024-08-28",
      "assignedTo": "0",
      "gradeAdmin": 1,
      "status": "new",
      "subObjectives": []
    },
    {
      "title": t('editObjectives.adaptability'),
      "description": "Demonstrate flexibility and the ability to adjust to new situations and changes.",
      "deadline": "2024-08-28",
      "assignedTo": "0",
      "gradeAdmin": 1,
      "status": "new",
      "subObjectives": []
    },
    {
      "title": t('editObjectives.continuousLearning'),
      "description": "Engage in ongoing education and skill development to stay current and improve.",
      "deadline": "2024-08-28",
      "assignedTo": "0",
      "gradeAdmin": 1,
      "status": "new",
      "subObjectives": []
    }
  ];

  const handleRecommendedObjectiveClick = (index) => {
    setSelectedExistingObjective(null); // Clear single selection
    setSelectedExistingObjectives([]); // Clear multiple selections
    setSelectedRecommendedObjective(index === selectedRecommendedObjective ? null : index);
  };

  const handleExistingObjectiveClick = (index) => {
    setSelectedRecommendedObjective(null); // Clear recommended selection
  
    if (isMultiSelectEnabled) {
      // If multi-select is enabled, toggle the selection of the clicked objective
      setSelectedExistingObjectives((prevSelected) => {
        if (prevSelected.includes(index)) {
          return prevSelected.filter((i) => i !== index);
        } else {
          return [...prevSelected, index];
        }
      });
    } else {
      // If multi-select is not enabled, only allow one selection
      setSelectedExistingObjective(index === selectedExistingObjective ? null : index);
      setSelectedExistingObjectives([index]); // Ensure a single selection
    }
  };
  

  const handleCreateObjective = () => {
    setIsCreatePopupOpen(true);
  };

  const handleDeleteObjective = async () => {
    if (selectedExistingObjectives.length > 0) {
      const objectivesToDelete = selectedExistingObjectives.map((index) => userObjectives[index]);

      // Delete each selected objective
      for (const objective of objectivesToDelete) {
        await deleteObjectiveById(objective.id);
      }

      // Update the state to remove deleted objectives
      setUserObjectives((prevObjectives) =>
        prevObjectives.filter((_, index) => !selectedExistingObjectives.includes(index))
      );

      // Clear the selected objectives
      setSelectedExistingObjectives([]);
    }
  };

  const handleAssignObjective = () => {
    if (selectedRecommendedObjective !== null) {
      setIsSetDeadlinePopupOpen(true);
    }
  };

  const handleEditObjective = () => {
    if (selectedExistingObjectives.length === 1) {
      const objective = userObjectives[selectedExistingObjectives[0]];
      setObjectiveToEdit(objective);
      setIsEditPopupOpen(true);
    }
  };
  
  const handleSelectAll = () => {
    const allIndexes = userObjectives.map((_, index) => index);
    setSelectedExistingObjectives(allIndexes);
  };
  
  const handleUnselectAll = () => {
    setSelectedExistingObjectives([]);
  };
  

  // pentru butonul de selectare
  // const handleExistingObjectivesClickSelectButton = (index) => {
  //   setSelectedRecommendedObjective(null);

  //   // Toggle the selection of the clicked objective
  //   setSelectedExistingObjectives((prevSelected) => {
  //     if (prevSelected.includes(index)) {
  //       // Remove the index if it's already selected
  //       return prevSelected.filter((i) => i !== index);
  //     } else {
  //       // Add the index to the selected list
  //       return [...prevSelected, index];
  //     }
  //   });
  // };

  const handleSelectingObjectives = () => {
    setIsMultiSelectEnabled((prev) => !prev); // Toggle multi-select mode
    setIsEnabledMultiSelectButton((prev) => !prev); // Toggle the visibility of the buttons
  };  


  return (
    <div className="add-objectives-container">
      <Background />
      <User />
      <LanguageSelector />
      <div className="content-wrapper">
        <div className="add-objectives-user-info">
          {currentUser ? (
            <>{t('editObjectives.selectedUser')} {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>{t('editObjectives.loadingInformation')}</>
          )}
        </div>
        <div className="main-content">
          <div className="cards-container">
            <AddObjectivesCard 
              title={t('editObjectives.recommendedObjectives')} 
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
              title={t('editObjectives.existingObjectives')} 
              content={userObjectives.map((objective, index) => (
                <div 
                  key={index} 
                  onClick={() => handleExistingObjectiveClick(index)}
                  className={`objective-item ${selectedExistingObjectives.includes(index) ? 'selected' : ''}`}
                >
                  {objective.title}
                </div>
              ))} 
            />
          </div>
          <div className="decision-container">
            <div className="actions-container">
              {selectedRecommendedObjective !== null && (
                <button className="action-button" onClick={handleAssignObjective}>{t('editObjectives.assign')}</button>
              )}
              {selectedExistingObjectives.length === 1 && (
                <button className="action-button" onClick={handleEditObjective}>
                  {t('editObjectives.editObjective')}
                </button>
              )}
              {selectedExistingObjectives.length === 1 && (
                <button
                  className="action-button"
                  onClick={() => navigate(`/edit-subobjectives/${userObjectives[selectedExistingObjectives[0]].id}`)}
                >
                  {t('editObjectives.editSubobjectives')}
                </button>
              )}
              {selectedExistingObjectives.length > 0 && (
                <button 
                  className="action-button delete-button" 
                  onClick={handleDeleteObjective}
                >
                  {selectedExistingObjectives.length === 1 ? t('editObjectives.deleteObjective') : t('editObjectives.deleteObjectives')}
                </button>
              )}
            </div>
            <div className="create-objective-container">
              <h2>{t('editObjectives.addNewObjective')}</h2>
              <button onClick={handleCreateObjective}>{t('editObjectives.createObjective')}</button>
            </div>
            <div className="select-objectives-container">
              <h2>{t('editObjectives.selectObjectives')}</h2>
              <button onClick={handleSelectingObjectives}>
                {isMultiSelectEnabled ? t('editObjectives.disableMultiSelect') : t('editObjectives.enableMultiSelect')}
              </button>
              {isEnabledMultiSelectButton && (
                <div className="multi-select-buttons">
                  <button onClick={handleSelectAll}>{t('editObjectives.selectAll')}</button>
                  <button onClick={handleUnselectAll}>{t('editObjectives.unselectAll')}</button>
                </div>
              )}
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
      <EditObjectivesPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onSubmit={(updatedObjective) => {
          setUserObjectives((prevObjectives) =>
            prevObjectives.map((obj) =>
              obj.id === updatedObjective.id ? updatedObjective : obj
            )
          );
          setIsEditPopupOpen(false);
          setObjectiveUpdated(true);
        }}
        objective={objectiveToEdit}
      />
    </div>
  );
};

export default AddObjectives;
