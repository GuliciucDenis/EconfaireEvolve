import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import { getObjectiveById } from "../../services/objectiveService";
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
        
        // Filter objectives to include only active ones
        const activeObjectives = objectives.filter(
          (objective) => objective && objective.status !== 'completed' && 
          objective.subObjectives && objective.subObjectives.some(sub => sub.gradeAdmin <= 1 || sub.gradeEmployee <= 1)
        );
        setUserObjectives(activeObjectives);
        
        // If there are active objectives, fetch subobjectives for the first one
        if (activeObjectives.length > 0) {
          const subobjectivesData = await getSubobjectivesByObjectiveId(activeObjectives[0].id);
          setSubobjectives(subobjectivesData);
          setSelectedObjective(0);
        }
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
      const updatedObjective = await gradeSubobjectiveByObjectiveId(
        userObjectives[selectedObjective]?.id,
        subobjectiveToGrade.title,
        grade,
        userRole
      );
      
      // Update local state
      setSubobjectives(updatedObjective.subObjectives);
      setUserObjectives(prevObjectives => 
        prevObjectives.map(obj => 
          obj.id === updatedObjective.id ? updatedObjective : obj
        )
      );
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
    setSelectedSubobjective(null);
    setIsGradeSubobjectivePopupOpen(false);
  };

  const formatGrade = (grade) => {
    if (grade === "-" || isNaN(Number(grade)) || Number(grade) <= 1) {
      return "-/10";
    }
    return `${Number(grade).toFixed(2)}/10`;
  };

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

  const getStatusContent = () => {
    if (selectedObjective === null || !userObjectives[selectedObjective]) {
      return "Select an objective to view status";
    }
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];

    const renderObjectiveGrades = () => {
      const adminGrade = calculateAverageGrade('gradeAdmin');
      const employeeGrade = calculateAverageGrade('gradeEmployee');
      return (
        <>
          <p key="admin">Admin grade: {formatGrade(adminGrade)}</p>
          <p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>
        </>
      );
    };

    const renderSubobjectiveGrades = () => {
      if (!subobjective) return null;
      return (
        <>
          <p key="admin">Admin grade: {formatGrade(subobjective.gradeAdmin)}</p>
          <p key="employee">Employee grade: {formatGrade(subobjective.gradeEmployee)}</p>
        </>
      );
    };

    return (
      <>
        <p>Description: {objective.description || 'No description available'}</p>
        <p>Deadline: {objective.deadline ? new Date(objective.deadline).toLocaleDateString() : 'No deadline set'}</p>
        {renderObjectiveGrades()}
        {selectedSubobjective !== null && subobjective && (
          <>
            <h2>Subobjective status</h2>
            <p>Description: {subobjective.description || 'No description available'}</p>
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
        <div className="user-info-seeobjectives">
          {currentUser ? (
            <>Selected user: {currentUser.firstName} {currentUser.lastName}</>
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
