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
} from "../../services/subobjectiveService";
import { getObjectiveById } from "../../services/objectiveService";
import AddSubobjectivePopup from "../../components/common/AddSubobjectivePopup/AddSubobjectivePopup";
import GradeSubobjectivePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import "./EditSubobjectives.css";

const EditSubobjectives = () => {
  const { id } = useParams(); // Objective ID from URL
  const [objective, setObjective] = useState(null);
  const [subobjectives, setSubobjectives] = useState([]);
  const [selectedSubobjectiveIndex, setSelectedSubobjectiveIndex] = useState(null); // Track selected subobjective
  const [isAddSubobjectivePopupOpen, setIsAddSubobjectivePopupOpen] = useState(false); // Popup state
  const [isGradeSubobjectivePopupOpen, setIsGradeSubobjectivePopupOpen] = useState(false); // Grade popup state
  const [loading, setLoading] = useState(true); // Loading state

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

  const handleAddSubobjective = async (newSubobjectiveTitle) => {
    if (newSubobjectiveTitle.trim() === "") return;
    try {
      const newSubobjective = { title: newSubobjectiveTitle };
      await addSubobjectiveByObjectiveId(id, newSubobjective);
      await fetchSubobjectives(); // Refetch the subobjectives list
    } catch (error) {
      console.error("Failed to add subobjective:", error);
    }
  };

  const handleRemoveSubobjective = async () => {
    if (selectedSubobjectiveIndex === null) return;
    try {
      const subobjectiveToRemove = subobjectives[selectedSubobjectiveIndex]?.title;
      await removeSubobjectiveByObjectiveId(id, subobjectiveToRemove);
      await fetchSubobjectives(); // Refetch the subobjectives list
      setSelectedSubobjectiveIndex(null); // Reset selected subobjective after removal
    } catch (error) {
      console.error("Failed to remove subobjective:", error);
    }
  };

  const handleGradeSubobjective = async (grade) => {
    if (selectedSubobjectiveIndex === null) return;
    try {
      const subobjectiveToGrade = subobjectives[selectedSubobjectiveIndex];
      await gradeSubobjectiveByObjectiveId(id, subobjectiveToGrade.title, grade, "admin");
      await fetchSubobjectives(); // Refetch the subobjectives list
      setSelectedSubobjectiveIndex(null); // Reset selected subobjective after grading
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
  };

  const handleSubobjectiveClick = (index) => {
    if (selectedSubobjectiveIndex === index) {
      setSelectedSubobjectiveIndex(null); // Deselect if clicked again
    } else {
      setSelectedSubobjectiveIndex(index); // Select if a different subobjective is clicked
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }

  return (
    <div className="edit-subobjectives-container">
      <Background />
      <User />
      <div className="edit-subobjectives-content-wrapper">
        <div className="cardboard-container">
          <Cardboard
            title="Subobjectives"
            content={subobjectives.map((sub, index) => (
              <div
                key={index}
                className={`subobjective-item ${index === selectedSubobjectiveIndex ? "selected" : ""}`} // Highlight if selected
                onClick={() => handleSubobjectiveClick(index)} // Use the new function
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
            Add subobjective
          </button>
          {selectedSubobjectiveIndex !== null && (
            <>
              <button
                onClick={handleRemoveSubobjective}
                className="action-button delete-button"
              >
                Remove subobjective
              </button>
              <button
                onClick={() => setIsGradeSubobjectivePopupOpen(true)}
                className="action-button grade-button"
              >
                Grade subobjective
              </button>
            </>
          )}
        </div>
      </div>
      <Navbar />
      <AddSubobjectivePopup
        isOpen={isAddSubobjectivePopupOpen}
        onClose={() => setIsAddSubobjectivePopupOpen(false)}
        onSubmit={(title) => {
          handleAddSubobjective(title);
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
        subobjective={subobjectives[selectedSubobjectiveIndex]?.title}
        objectiveId={id}
      />
    </div>
  );
};

export default EditSubobjectives;
