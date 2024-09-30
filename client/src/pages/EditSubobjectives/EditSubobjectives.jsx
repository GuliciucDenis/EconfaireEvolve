import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import {
  addSubobjectiveByObjectiveId,
  removeSubobjectiveByObjectiveId,
  getSubobjectivesByObjectiveId,
  gradeSubobjectiveByObjectiveId,
  updateSubobjectiveByObjectiveId,
} from "../../services/subobjectiveService";
import { getObjectiveById } from "../../services/objectiveService";
import AddSubobjectivePopup from "../../components/common/AddSubobjectivePopup/AddSubobjectivePopup";
import EditSubobjectivePopup from "../../components/common/EditSubobjectivePopup/EditSubobjectivePopup";
import GradeSubobjectivePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import { getUserById, getUserIdFromToken } from "../../services/userService";
import "./EditSubobjectives.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/language-selector";

const EditSubobjectives = () => {
  const { id } = useParams(); // Objective ID from URL
  const [objective, setObjective] = useState(null);
  const [subobjectives, setSubobjectives] = useState([]);
  const [selectedSubobjectives, setSelectedSubobjectives] = useState([]); // Multiple selections
  const [isAddSubobjectivePopupOpen, setIsAddSubobjectivePopupOpen] = useState(false); // Popup state
  const [isGradeSubobjectivePopupOpen, setIsGradeSubobjectivePopupOpen] = useState(false); // Grade popup state
  const [loading, setLoading] = useState(true); // Loading state
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditSubobjectivePopupOpen, setIsEditSubobjectivePopupOpen] = useState(false);
  const [subobjectiveToEdit, setSubobjectiveToEdit] = useState(null);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isEnabledMultiSelectButton, setIsEnabledMultiSelectButton] = useState(false);
  const {t}=useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getUserIdFromToken(); // Obține ID-ul utilizatorului din token
        if (!userId) {
          console.error("User ID is null or undefined.");
          return;
        }

        console.log("Fetching user with ID:", userId); // Log pentru a verifica ID-ul corect
        const user = await getUserById(userId);

        if (!user) {
          console.error("User not found or response is null.");
          return;
        }

        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchObjectiveAndSubobjectives = async () => {
      setLoading(true);
      try {
        const objectiveData = await getObjectiveById(id);
        setObjective(objectiveData);

        const subobjectivesData = await getSubobjectivesByObjectiveId(id);
        setSubobjectives(subobjectivesData);
      } catch (error) {
        console.error("Failed to fetch objective or subobjectives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchObjectiveAndSubobjectives();
  }, [id]);

  const fetchSubobjectives = async () => {
    try {
      const subobjectivesData = await getSubobjectivesByObjectiveId(id);
      setSubobjectives(subobjectivesData);
    } catch (error) {
      console.error("Failed to fetch subobjectives:", error);
    }
  };

  const handleAddSubobjective = async (newSubobjective) => {
    if (!newSubobjective.title.trim() || !newSubobjective.description.trim()) return;
    try {
      // Crează un obiect cu titlul și descrierea subobiectivului
      await addSubobjectiveByObjectiveId(id, newSubobjective);
      await fetchSubobjectives(); // Reîncarcă lista de subobiective
    } catch (error) {
      console.error("Failed to add subobjective:", error);
    }
  };

  const handleRemoveSubobjective = async () => {
    if (selectedSubobjectives.length === 0) return;
    try {
      const subobjectiveToRemove = selectedSubobjectives.map(index => subobjectives[index].title);
      for (const subobjectiveTitle of subobjectiveToRemove) {
        await removeSubobjectiveByObjectiveId(id, subobjectiveTitle);
      }
      await fetchSubobjectives(); // Refetch the subobjectives list
      setSelectedSubobjectives([]); // Reset selected subobjective after removal
    } catch (error) {
      console.error("Failed to remove subobjective:", error);
    }
  };

  const handleGradeSubobjective = async (grade) => {
    if (selectedSubobjectives.length === 0 || !currentUser) return;

    try {
      const subobjectiveToGrade = subobjectives[selectedSubobjectives[0]]; // Assuming only one subobjective is graded at a time
      await gradeSubobjectiveByObjectiveId(id, subobjectiveToGrade.title, grade, "admin", currentUser.id);
      await fetchSubobjectives(); // Refresh the subobjectives after grading
      setSelectedSubobjectives([]); // Clear the selection after grading
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
  };

  const handleSubobjectiveClick = (index) => {
    if (isMultiSelectEnabled) {
      setSelectedSubobjectives((prevSelected) => {
        if (prevSelected.includes(index)) {
          return prevSelected.filter(i => i !== index); // Deselect if clicked again
        } else {
          return [...prevSelected, index]; // Select if a different subobjective is clicked
        }
      });
    } else {
      setSelectedSubobjectives([index]); // Single selection
    }
  };

  const handleEditSubobjective = async (updatedSubobjective) => {
    if (!subobjectiveToEdit) return;

    try {
      await updateSubobjectiveByObjectiveId(id, subobjectiveToEdit.title, updatedSubobjective);
      await fetchSubobjectives();
      setSelectedSubobjectives([]); // Clear selection after editing
    } catch (error) {
      console.error("Failed to edit subobjective:", error);
    }
  };

  const handleSelectAll = () => {
    const allIndexes = subobjectives.map((_, index) => index);
    setSelectedSubobjectives(allIndexes);
  };

  const handleUnselectAll = () => {
    setSelectedSubobjectives([]);
  };

  const handleSelectingSubobjectives = () => {
    setIsMultiSelectEnabled((prev) => !prev); // Toggle multi-select mode
    setIsEnabledMultiSelectButton((prev) => !prev); // Toggle the visibility of the buttons
  };

  if (loading) {
    return <div>{t('editSubobjectives.loading')}</div>; // Display a loading indicator while data is being fetched
  }

  return (
    <div className="edit-subobjectives-container">
      <Background />
      <User />
      <LanguageSelector />
      <div className="edit-subobjectives-content-wrapper">
        <div className="cardboard-container">
          <Cardboard
            title={t('editSubobjectives.cardTitle')}
            content={subobjectives.map((sub, index) => (
              <div
                key={index}
                className={`subobjective-item ${selectedSubobjectives.includes(index) ? "selected" : ""}`} // Highlight if selected
                onClick={() => handleSubobjectiveClick(index)}
              >
                {sub?.title} &rarr; {sub?.gradeAdmin}/10
              </div>
            ))}
          />
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => setIsAddSubobjectivePopupOpen(true)}
            className="action-button add-button"
          >
            {t('editSubobjectives.addSubobjective')}
          </button>
          {selectedSubobjectives.length > 0 && (
          <>
            {selectedSubobjectives.length > 1 ? (
              <button
                onClick={handleRemoveSubobjective}
                className="action-button delete-button"
              >
                {t('editSubobjectives.removeSubobjectives')}
              </button>
            ) : (
              <>
                <button
                  onClick={handleRemoveSubobjective}
                  className="action-button delete-button"
                >
                  {t('editSubobjectives.removeSubobjective')}
                </button>
                <button
                  onClick={() => setIsGradeSubobjectivePopupOpen(true)}
                  className="action-button grade-button"
                >
                  {t('editSubobjectives.gradeSubobjective')}
                </button>
                <button
                  onClick={() => {
                    setSubobjectiveToEdit(subobjectives[selectedSubobjectives[0]]);
                    setIsEditSubobjectivePopupOpen(true);
                  }}
                  className="action-button edit-button"
                >
                  {t('editSubobjectives.editExistingSubobjective')}
                </button>
              </>
            )}
          </>
        )}
          <div className="select-subobjectives-container">
            <h2>{t('editSubobjectives.selectExistingSubobjectives')}</h2>
            <button onClick={handleSelectingSubobjectives}>
              {isMultiSelectEnabled ? t('editSubobjectives.disableMultiSelect') : t('editSubobjectives.enableMultiSelect')}
            </button>
            {isEnabledMultiSelectButton && (
              <div className="multi-select-buttons">
                <button onClick={handleSelectAll}>{t('editSubobjectives.selectAll')}</button>
                <button onClick={handleUnselectAll}>{t('editSubobjectives.unselectAll')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Navbar />
      <AddSubobjectivePopup
        isOpen={isAddSubobjectivePopupOpen}
        onClose={() => setIsAddSubobjectivePopupOpen(false)}
        onSubmit={({ title, description }) => {
          handleAddSubobjective({ title, description });
          setIsAddSubobjectivePopupOpen(false);
        }}
        objectiveId={id}
      />
      <GradeSubobjectivePopup
        isOpen={isGradeSubobjectivePopupOpen}
        onClose={() => setIsGradeSubobjectivePopupOpen(false)}
        onSubmit={(grade) => {
          handleGradeSubobjective(grade);
          setIsGradeSubobjectivePopupOpen(false);
        }}
        subobjective={subobjectives[selectedSubobjectives[0]]?.title}
        objectiveId={id}
      />
      <EditSubobjectivePopup
        isOpen={isEditSubobjectivePopupOpen}
        onClose={() => setIsEditSubobjectivePopupOpen(false)}
        onSubmit={(updatedSubobjective) => {
          handleEditSubobjective(updatedSubobjective);
          setIsEditSubobjectivePopupOpen(false); // Close popup after saving
        }}
        subobjective={subobjectiveToEdit}
      />
    </div>
  );
};

export default EditSubobjectives;
