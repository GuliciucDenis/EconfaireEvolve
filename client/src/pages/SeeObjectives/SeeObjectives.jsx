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
import { getSubobjectivesByObjectiveId, gradeSubobjectiveByObjectiveId } from "../../services/subobjectiveService";
import GradeSubobjectivePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import "./SeeObjectives.css";

const SeeObjectives = () => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [subobjectives, setSubobjectives] = useState([]);
  const [isGradeSubobjectivePopupOpen, setIsGradeSubobjectivePopupOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { id } = useParams();
  const userId = id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        setUserRole(user.role);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(
          userObjectiveIds.map(getObjectiveById)
        );
        // Filtrează obiectivele active (cele care nu sunt complet evaluate)
        const activeObjectives = objectives.filter(objective => 
          objective.gradeAdmin <= 1 || objective.gradeEmployee <= 1
        );
        setUserObjectives(activeObjectives);
      } catch (error) {
        console.error("Failed to fetch user or objectives:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const fetchSubobjectives = async () => {
      if (selectedObjective !== null && userObjectives.length > 0) {
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

  const handleGradeSubobjective = async (grade) => {
    if (selectedSubobjective === null) return;
    try {
      const subobjectiveToGrade = subobjectives[selectedSubobjective];
      await gradeSubobjectiveByObjectiveId(userObjectives[selectedObjective]?.id, subobjectiveToGrade.title, grade, "employee");
      
      // Actualizăm starea locală
      const updatedSubobjectives = subobjectives.map((sub, index) => 
        index === selectedSubobjective ? { ...sub, gradeEmployee: grade } : sub
      );
      setSubobjectives(updatedSubobjectives);

      // Recalculăm nota obiectivului
      const updatedObjective = await getObjectiveById(userObjectives[selectedObjective]?.id);
      setUserObjectives(prevObjectives => 
        prevObjectives.map((obj, index) => 
          index === selectedObjective ? updatedObjective : obj
        )
      );
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
    setSelectedSubobjective(null);
    setIsGradeSubobjectivePopupOpen(false);
  };

  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];
    
    const formatGrade = (grade) => grade > 1 ? `${grade}/10` : "-";

    const renderGrades = () => {
      return (
        <>
          <p>Admin grade: {formatGrade(objective.gradeAdmin)}</p>
          {userRole !== 'admin' && (
            <p>Employee grade: {formatGrade(objective.gradeEmployee)}</p>
          )}
        </>
      );
    };

    const renderSubobjectiveGrades = () => {
      return (
        <>
          <p>Admin grade: {formatGrade(subobjective.gradeAdmin)}</p>
          {userRole !== 'admin' && (
            <p>Employee grade: {formatGrade(subobjective.gradeEmployee)}</p>
          )}
        </>
      );
    };

    if (selectedSubobjective === null) {
      return (
        <>
          <p>Description: {objective.description}</p>
          <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>
          {renderGrades()}
        </>
      );
    } else {
      return (
        <>
          <p>Description: {objective.description}</p>
          <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>
          {renderGrades()}

          <h2>Subobjective status</h2>
          <p>Description: {subobjective.description}</p>
          {renderSubobjectiveGrades()}
        </>
      );
    }
  };

  return (
    <div className="objectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        <div className="user-info-seeobjectives">
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
      </div>
      <Navbar />
      <GradeSubobjectivePopup
        isOpen={isGradeSubobjectivePopupOpen}
        onClose={() => setIsGradeSubobjectivePopupOpen(false)}
        onSubmit={(grade) => {
          handleGradeSubobjective(grade);
          setIsGradeSubobjectivePopupOpen(false);
        }}
        subobjective={subobjectives[selectedSubobjective]?.title}
        objectiveId={userObjectives[selectedObjective]?.id}
      />
    </div>
  );
};

export default SeeObjectives;
