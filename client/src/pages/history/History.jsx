import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import { getObjectiveById } from "../../services/objectiveService";
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
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        setUserRole(user.role);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(
          userObjectiveIds.map(getObjectiveById)
        );
        // Filter completed objectives (those that are fully evaluated)
        const completedObjectives = objectives.filter(objective => 
          objective.gradeAdmin > 1 && objective.gradeEmployee > 1
        );
        setUserObjectives(completedObjectives);
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

  const formatGrade = (grade) => {
    const numericGrade = Number(grade); // Convertim la număr pentru siguranță
    if (isNaN(numericGrade) || numericGrade <= 1) {
      return "-/10"; // Returnăm fallback dacă grade nu este un număr valid sau este mai mic sau egal cu 1
    }
    return `${numericGrade.toFixed(2)}/10`; // Formatează grade dacă este un număr valid
  };

  const calculateAverageGrade = (gradeType) => {
    if (subobjectives.length === 0) return "-";
    const validGrades = subobjectives
      .map(sub => Number(sub[gradeType])) // Conversie la număr
      .filter(grade => !isNaN(grade) && grade > 1); // Filtrare grade valide
    if (validGrades.length === 0) return "-";
    const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
    return average.toFixed(2); // Formatează media cu două zecimale
  };

  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];

    const renderObjectiveGrades = () => {
      const adminGrade = calculateAverageGrade('gradeAdmin');
      const content = [<p key="admin">Admin grade: {formatGrade(adminGrade)}</p>];
      if (userRole !== 'admin') {
        const employeeGrade = calculateAverageGrade('gradeEmployee');
        content.push(<p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>);
      }
      return content;
    };

    const renderSubobjectiveGrades = () => {
      if (!subobjective) return null;
      const content = [<p key="admin">Admin grade: {formatGrade(subobjective.gradeAdmin)}</p>];
      if (userRole !== 'admin') {
        content.push(<p key="employee">Employee grade: {formatGrade(subobjective.gradeEmployee)}</p>);
      }
      return content;
    };

    return (
      <>
        <p>Description: {objective.description}</p>
        <p>Deadline: {new Date(objective.deadline).toLocaleDateString()}</p>
        {renderObjectiveGrades()}
        {selectedSubobjective !== null && (
          <>
            <h2>Subobjective status</h2>
            <p>Description: {subobjective.description}</p>
            {renderSubobjectiveGrades()}
          </>
        )}
      </>
    );
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
            title="Past Objectives"
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
            title="Past SubObjectives"
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
