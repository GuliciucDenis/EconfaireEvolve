import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import {
  getObjectivesByUserId,
  getObjectiveById,
} from "../../services/objectiveService";
import { getSubobjectivesByObjectiveId } from "../../services/subobjectiveService";
import GradePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import "./Objectives.css";

const Objectives = () => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [subobjectives, setSubobjectives] = useState([]);
  const [isGradePopupOpen, setIsGradePopupOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { id } = useParams();
  const userId = id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(
          userObjectiveIds.map(getObjectiveById)
        );
        setUserObjectives(objectives);
      } catch (error) {
        console.error("Failed to fetch user or objectives:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchSubobjectives = async () => {
      if (selectedObjective !== null) {
        try {
          const selectedObjectiveId = userObjectives[selectedObjective].id;
          const subobjectivesData = await getSubobjectivesByObjectiveId(
            selectedObjectiveId
          );
          setSubobjectives(subobjectivesData);
        } catch (error) {
          console.error("Failed to fetch subobjectives:", error);
        }
      } else {
        setSubobjectives([]);
      }
    };

    fetchSubobjectives();
  }, [selectedObjective, userObjectives]);

  const handleObjectiveClick = (index) => {
    setSelectedObjective(index);
    setSelectedSubobjective(null);
  };

  const handleSubobjectiveClick = (index) => {
    setSelectedSubobjective(index);
  };

  const handleGradeSubobjective = () => {
    if (selectedSubobjective !== null) {
      setIsGradePopupOpen(true);
    } else {
      alert("Please select a subobjective to grade.");
    }
  };

  const handleGradeSubmit = (subobjective, grade) => {
    console.log(
      `Submitting grade ${grade} for subobjective ${subobjective.id}`
    );
    // Here you would typically call an API to update the grade
    // Update your state or make an API call here
    setIsGradePopupOpen(false);
  };

  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];
    if (selectedSubobjective === null) {
      return (
        <>
          <p>Description: {objective.description}</p>
          <p>Admin grade: {objective.gradeAdmin}/10</p>
          <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>
        </>
      );
    } else {
      return (
        <>
          <p>Description: {objective.description}</p>
          <p>Admin grade: {objective.gradeAdmin}/10</p>
          <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>

          <h2>Subobjective status</h2>
          <p>Description: {subobjective.description}</p>
          <p>Admin grade: {subobjective.gradeAdmin}/10</p>
          <p>User grade: {subobjective.gradeUser}/10</p>
        </>
      );
    }
  };

  return (
    <div className="objectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        <div className="user-info">
          {currentUser ? (
            <>
              Selected user: {currentUser.firstName} {currentUser.lastName}
            </>
          ) : (
            <>Loading user information...</>
          )}
        </div>
        <div className="cardboard-container">
          <Cardboard
            title="Current Objectives"
            content={userObjectives.map((objective, index) => (
              <div
                key={index}
                onClick={() => handleObjectiveClick(index)}
                className={`objective-item ${
                  index === selectedObjective ? "selected" : ""
                }`}
              >
                {objective.title}
              </div>
            ))}
          />
          <Cardboard
            title="Current SubObjectives"
            content={subobjectives.map((subobjective, index) => (
              <div
                key={index}
                onClick={() => handleSubobjectiveClick(index)}
                className={`subobjective-item ${
                  index === selectedSubobjective ? "selected" : ""
                }`}
              >
                {subobjective.title}
              </div>
            ))}
          />
          <Cardboard title="Objective Status" content={getStatusContent()} />
        </div>
        <div className="action-buttons-container">
          <button 
            onClick={handleGradeSubobjective} 
            className="grade-button"
            disabled={selectedSubobjective === null}
          >
            Grade Subobjective
          </button>
        </div>
      </div>
      <Navbar />
      {userRole === 'employee' && (
        <GradePopup
          isOpen={isGradePopupOpen}
          onClose={() => setIsGradePopupOpen(false)}
          subobjective={selectedSubobjective !== null ? subobjectives[selectedSubobjective] : null}
          onSubmit={handleGradeSubmit}
        />
      )}
      <GradePopup
        isOpen={isGradePopupOpen}
        onClose={() => setIsGradePopupOpen(false)}
        subobjective={
          selectedSubobjective !== null
            ? subobjectives[selectedSubobjective]
            : null
        }
        onSubmit={handleGradeSubmit}
      />
      <Navbar />
      
    </div>
  );
};

export default Objectives;
