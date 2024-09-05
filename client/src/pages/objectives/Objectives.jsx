import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import { getObjectiveById, updateObjectiveStatus } from "../../services/objectiveService";
import { getSubobjectivesByObjectiveId, gradeSubobjectiveByObjectiveId } from "../../services/subobjectiveService";
import GradeSubobjectivePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import "./Objectives.css";

const Objectives = () => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [subobjectives, setSubobjectives] = useState([]);
  const [isGradeSubobjectivePopupOpen, setIsGradeSubobjectivePopupOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { id } = useParams();
  const userId = id;

  // Fetch user data and objectives
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        setUserRole(user.role);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(userObjectiveIds.map(getObjectiveById));
        
        // Filter objectives to exclude those fully graded
        const activeObjectives = objectives.filter(
          (objective) => 
            objective.subObjectives?.some(sub => sub.gradeAdmin <= 1 || sub.gradeEmployee <= 1)
        );

        setUserObjectives(activeObjectives);

        if (activeObjectives.length > 0) {
          const subobjectivesData = await getSubobjectivesByObjectiveId(activeObjectives[0].id);
          setSubobjectives(subobjectivesData);
        }
      } catch (error) {
        console.error("Failed to fetch user or objectives:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle clicking on an objective
  const handleObjectiveClick = async (index) => {
    setSelectedObjective(index);
    setSelectedSubobjective(null);
    try {
      const subobjectivesData = await getSubobjectivesByObjectiveId(userObjectives[index].id);
      setSubobjectives(subobjectivesData);
    } catch (error) {
      console.error("Failed to fetch subobjectives:", error);
    }
  };

  // Handle clicking on a subobjective
  const handleSubobjectiveClick = (index) => {
    setSelectedSubobjective(index);
  };

  // Handle grading a subobjective
  const handleGradeSubobjective = async (grade) => {
    if (selectedSubobjective === null) return;
    try {
      const subobjectiveToGrade = subobjectives[selectedSubobjective];
      const updatedObjective = await gradeSubobjectiveByObjectiveId(
        userObjectives[selectedObjective]?.id,
        subobjectiveToGrade.title,
        grade,
        userRole
      );

      // Update local state with new subobjectives and objectives
      setSubobjectives(updatedObjective.subObjectives);
      setUserObjectives(prevObjectives =>
        prevObjectives.map(obj =>
          obj.id === updatedObjective.id ? updatedObjective : obj
        )
      );

      // Check if all subobjectives are graded by both admin and employee
      const allSubobjectivesGraded = updatedObjective.subObjectives.every(
        sub => sub.gradeAdmin > 1 && sub.gradeEmployee > 1
      );

      // If all subobjectives are graded, then update the objective's status
      if (allSubobjectivesGraded) {
        await updateObjectiveStatus(updatedObjective.id, 'completed');
        setUserObjectives(prevObjectives =>
          prevObjectives.filter(obj => obj.id !== updatedObjective.id)
        );
        setSelectedObjective(null);
      }
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
    setSelectedSubobjective(null);
    setIsGradeSubobjectivePopupOpen(false);
  };

  // Format the grade display
  const formatGrade = (grade) => {
    const numericGrade = Number(grade);
    if (isNaN(numericGrade) || numericGrade <= 1) {
      return "-/10";
    }
    return `${numericGrade.toFixed(2)}/10`;
  };

  // Calculate average grade for a specific type (admin or employee)
  const calculateAverageGrade = (gradeType) => {
    if (subobjectives.length === 0) return "-";
    const validGrades = subobjectives
      .map(sub => Number(sub[gradeType]))
      .filter(grade => !isNaN(grade) && grade > 1);
    if (validGrades.length !== subobjectives.length) return "-"; // If any subobjective is not graded
    if (validGrades.length === 0) return "-";
    const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
    return average.toFixed(2);
  };

  // Render the status content of objectives
  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];

    const renderObjectiveGrades = () => {
      const adminGrade = calculateAverageGrade('gradeAdmin');
      const content = [<p key="admin">Admin grade: {formatGrade(adminGrade)}</p>];
      if (userRole === 'employee') {
        const employeeGrade = calculateAverageGrade('gradeEmployee');
        content.push(<p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>);
      }
      return content;
    };

    const renderSubobjectiveGrades = () => {
      if (!subobjective) return null;
      const content = [<p key="admin">Admin grade: {formatGrade(subobjective.gradeAdmin)}</p>];
      if (userRole === 'employee') {
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

  // Render the main objectives component
  return (
    <div className="objectives-container">
      <Background />
      <User />
      <div className="content-wrapper">
        <div className="objectives-title-container">
          <h1 className="objectives-title">My objectives</h1>
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
        <div className="action-buttons-container">
          <button 
            onClick={() => setIsGradeSubobjectivePopupOpen(true)} 
            className="grade-button"
            disabled={selectedSubobjective === null}
          >
            Grade Subobjective
          </button>
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

export default Objectives;
