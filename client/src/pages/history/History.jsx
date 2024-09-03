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
import "./History.css";

const History = () => {
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
    // Fetch user and objectives when component mounts
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        console.log(user);
        setCurrentUser(user);
        setUserRole(user.role);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(
          userObjectiveIds.map(getObjectiveById)
        );
        const filteredObjectives = objectives.filter(
          (objective) => objective.gradeAdmin > 1 && objective.gradeEmployee > 1
        );
        setUserObjectives(filteredObjectives);
      } catch (error) {
        console.error("Failed to fetch user or objectives:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    // Fetch subobjectives whenever a new objective is selected
    const fetchSubobjectives = async () => {
      if (selectedObjective !== null) {
        try {
          const selectedObjectiveId = userObjectives[selectedObjective].id;
          const subobjectivesData = await getSubobjectivesByObjectiveId(
            selectedObjectiveId
          );
          console.log(subobjectivesData);
          setSubobjectives(subobjectivesData);
        } catch (error) {
          console.error("Failed to fetch subobjectives:", error);
        }
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
    if (selectedObjective !== null && selectedSubobjective !== null) {
      setIsGradePopupOpen(true);
    }
  };

  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];
    
    const formatGrade = (grade) => typeof grade === 'number' ? `${grade}/10` : grade;

    const calculateAverageAdminGrade = () => {
      if (subobjectives.length === 0) return "-";
      const validGrades = subobjectives.filter(sub => sub.gradeAdmin > 1).map(sub => sub.gradeAdmin);
      if (validGrades.length === 0) return "-";
      const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
      return average.toFixed(2);
    };

    const renderGrades = () => {
      return <p>Admin grade: {calculateAverageAdminGrade()}</p>;
    };

    const renderSubobjectiveGrades = () => {
      return <p>Admin grade: {formatGrade(subobjective.gradeAdmin)}</p>;
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
      <div className="objectives-title-container">
          <h1 className="objectives-title">History</h1>
        </div>
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
      </div>
      <Navbar />
    </div>
  );
};

export default History;
