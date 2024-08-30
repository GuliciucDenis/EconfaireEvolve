import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import CardBoardSubObjective from "../../components/common/cardboardsubobjective/CardBoardSubObjective";
import User from "../../components/common/user/User";
import { addSubobjectiveByObjectiveId, removeSubobjectiveByObjectiveId, getSubobjectivesByObjectiveId } from "../../services/subobjectiveService";
import { getObjectiveById } from "../../services/objectiveService";
import AddSubobjectivePopup from "../../components/common/AddSubobjectivePopup/AddSubobjectivePopup";
import GradePopup from "../../components/common/GradePopup/GradePopup";
import './EditSubobjectives.css';

const EditSubobjectives = () => {
  const { id } = useParams(); // Objective ID from URL
  const [objective, setObjective] = useState(null);
  const [subobjectives, setSubobjectives] = useState([]);
  const [isAddSubobjectivePopupOpen, setIsAddSubobjectivePopupOpen] = useState(false);
  const [isGradePopupOpen, setIsGradePopupOpen] = useState(false);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchObjectiveAndSubobjectives = async () => {
      try {
        const objectiveData = await getObjectiveById(id);
        console.log("Fetched objective:", objectiveData);
        setObjective(objectiveData);

        const subobjectivesData = await getSubobjectivesByObjectiveId(id);
        console.log("Fetched subobjectives:", subobjectivesData);
        setSubobjectives(subobjectivesData);
      } catch (error) {
        console.error("Failed to fetch objective or subobjectives:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchObjectiveAndSubobjectives();
  }, [id]);

  const handleAddSubobjective = async (newSubobjectiveData) => {
    try {
      const newSubobjective = await addSubobjectiveByObjectiveId(id, newSubobjectiveData);
      setSubobjectives(prevSubobjectives => [...prevSubobjectives, newSubobjective]);
    } catch (error) {
      console.error("Failed to add subobjective:", error);
      setError("Failed to add subobjective. Please try again.");
    }
  };

  const handleRemoveSubobjective = async (subobjectiveId) => {
    try {
      await removeSubobjectiveByObjectiveId(id, subobjectiveId);
      setSubobjectives(prevSubobjectives => prevSubobjectives.filter(sub => sub.id !== subobjectiveId));
    } catch (error) {
      console.error("Failed to remove subobjective:", error);
      setError("Failed to remove subobjective. Please try again.");
    }
  };

  const handleSubobjectiveClick = (index) => {
    console.log("Subobjective clicked:", subobjectives[index]);
    setSelectedSubobjective(subobjectives[index]);
  };

  return (
    <div className="edit-subobjectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        {error && <div className="error-message">{error}</div>}
        {objective && (
          <div className="objective-info">
            <h2>{objective.title}</h2>
          </div>
        )}
        <div className="cardboard-container">
          {objective && (
            <CardBoardSubObjective
            title={objective.title}
            objectiveDescription={objective.description}
            objectiveDeadline={objective.deadline}
            subobjectives={subobjectives}
            onItemClick={handleSubobjectiveClick}
            selectedSubobjective={selectedSubobjective}
          />
          )}
        </div>
        <div className="action-buttons-container">
          <button onClick={() => setIsAddSubobjectivePopupOpen(true)} className="add-button">
            Add Subobjective
          </button>
          <button 
            onClick={() => setIsGradePopupOpen(true)} 
            className="grade-button"
            disabled={!selectedSubobjective}
          >
            Grade Subobjective
          </button>
        </div>
      </div>
      <Navbar />
      <AddSubobjectivePopup
        isOpen={isAddSubobjectivePopupOpen}
        onClose={() => setIsAddSubobjectivePopupOpen(false)}
        onSubmit={handleAddSubobjective}
        objectiveId={id}
      />
      <GradePopup
        isOpen={isGradePopupOpen}
        onClose={() => setIsGradePopupOpen(false)}
        subobjective={selectedSubobjective}
      />
    </div>
  );
};

export default EditSubobjectives;