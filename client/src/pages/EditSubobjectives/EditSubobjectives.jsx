import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { addSubobjectiveByObjectiveId, removeSubobjectiveByObjectiveId, getSubobjectivesByObjectiveId } from "../../services/subobjectiveService";
import { getObjectiveById } from "../../services/objectiveService";
import AddSubobjectivePopup from "../../components/common/AddSubobjectivePopup/AddSubobjectivePopup"; // Import the popup
import './EditSubobjectives.css';

const EditSubobjectives = () => {
  const { id } = useParams(); // Objective ID from URL
  const [objective, setObjective] = useState(null);
  const [subobjectives, setSubobjectives] = useState([]);
  const [isAddSubobjectivePopupOpen, setIsAddSubobjectivePopupOpen] = useState(false); // Popup state

  useEffect(() => {
    const fetchObjectiveAndSubobjectives = async () => {
      try {
        const objectiveData = await getObjectiveById(id);
        setObjective(objectiveData);

        const subobjectivesData = await getSubobjectivesByObjectiveId(id);
        setSubobjectives(subobjectivesData);
      } catch (error) {
        console.error("Failed to fetch objective or subobjectives:", error);
      }
    };

    fetchObjectiveAndSubobjectives();
  }, [id]);

  const handleAddSubobjective = async (newSubobjectiveTitle) => {
    if (newSubobjectiveTitle.trim() === "") return;
    try {
      const newSubobjective = { title: newSubobjectiveTitle };
      await addSubobjectiveByObjectiveId(id, newSubobjective);
      setSubobjectives([...subobjectives, newSubobjective]);
    } catch (error) {
      console.error("Failed to add subobjective:", error);
    }
  };

  const handleRemoveSubobjective = async (subobjectiveId) => {
    try {
      await removeSubobjectiveByObjectiveId(id, subobjectiveId);
      setSubobjectives(subobjectives.filter(sub => sub.id !== subobjectiveId));
    } catch (error) {
      console.error("Failed to remove subobjective:", error);
    }
  };

  return (
    <div className="edit-subobjectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        {objective ? (
          <div className="objective-info">
            <h2>{objective.title}</h2>
            <p>{objective.description}</p>
            <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Loading objective information...</p>
        )}
        <div className="cardboard-container">
          <Cardboard
            title="SubObjectives"
            content={subobjectives.map((sub, index) => (
              <div key={index} className="subobjective-item">
                {sub.title}
                <button onClick={() => handleRemoveSubobjective(sub.id)} className="remove-button">
                  Remove
                </button>
              </div>
            ))}
          />
        </div>
        <div className="add-subobjective-container">
          <button onClick={() => setIsAddSubobjectivePopupOpen(true)} className="add-button">
            Add Subobjective
          </button>
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
    </div>
  );
};

export default EditSubobjectives;
