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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        setUserRole(user.role);
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(userObjectiveIds.map(getObjectiveById));
        const activeObjectives = objectives.filter(
          (objective) => objective.gradeAdmin <= 1 || objective.gradeEmployee <= 1
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

  // Definirea funcției fetchSubobjectives la nivelul componentei
  const fetchSubobjectives = async () => {
    if (selectedObjective !== null && userObjectives.length > 0) {
      try {
        const selectedObjectiveId = userObjectives[selectedObjective].id;
        const subobjectivesData = await getSubobjectivesByObjectiveId(selectedObjectiveId);
        setSubobjectives(subobjectivesData);
      } catch (error) {
        console.error("Failed to fetch subobjectives:", error);
      }
    } else {
      setSubobjectives([]);
    }
  };

  useEffect(() => {
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
      await gradeSubobjectiveByObjectiveId(
        userObjectives[selectedObjective]?.id,
        subobjectiveToGrade.title,
        grade,
        userRole // Use the user's role instead of hardcoding "admin"
      );

      // Update local subobjectives to reflect the change
      const updatedSubobjectives = subobjectives.map((sub, index) =>
        index === selectedSubobjective
          ? { ...sub, [userRole === 'admin' ? 'gradeAdmin' : 'gradeEmployee']: grade }
          : sub
      );
      setSubobjectives(updatedSubobjectives);

      // Refetch to ensure you have the most recent data
      await fetchSubobjectives();
    } catch (error) {
      console.error("Failed to grade subobjective:", error);
    }
    setSelectedSubobjective(null);
    setIsGradeSubobjectivePopupOpen(false);
  };

  const formatGrade = (grade) => {
    if (typeof grade !== 'number' || isNaN(grade)) {
      return "-/10";
    }
    return `${grade.toFixed(2)}/10`;
  };

  const calculateAverageGrade = (gradeType) => {
    if (subobjectives.length === 0) return "-";
    const validGrades = subobjectives
      .map(sub => Number(sub[gradeType])) // Conversie la număr
      .filter(grade => !isNaN(grade)); // Filtrare grade valide (elimină null sau grade nevalide)
    if (validGrades.length === 0) return "-";
    const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
    return average.toFixed(2); // Formatează media cu două zecimale
  };
  // const calculateAverageGrade = (gradeType) => {
  //   if (subobjectives.length === 0) return "-";
  //   const validGrades = subobjectives
  //     .map(sub => Number(sub[gradeType]))
  //     .filter(grade => grade > 1 && !isNaN(grade));
  //   if (validGrades.length === 0) return "-";
  //   const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
  //   return average.toFixed(2);
  // };

  const getStatusContent = () => {
    if (selectedObjective === null) return "Select an objective to view status";
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];


    const renderObjectiveGrades = () => {
      const adminGrade = calculateAverageGrade('gradeAdmin');
    
      // Verifică dacă toate subobiectivele sunt notate
      const allGraded = subobjectives.every(sub => !isNaN(sub.gradeAdmin) && sub.gradeAdmin > 0);
    
      // Dacă toate subobiectivele sunt notate, mută obiectivul în istoric
      if (allGraded) {
        moveObjectiveToHistory(userObjectives[selectedObjective]?.id);
      }
    
      const content = [<p key="admin">Admin grade: {adminGrade}/10</p>];
      if (userRole === 'employee') {
        const employeeGrade = calculateAverageGrade('gradeEmployee');
        content.push(<p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>);
      }
      return content;
    };
    
    // const renderObjectiveGrades = () => {
    //   const adminGrade = calculateAverageGrade('gradeAdmin'); // Calcularea mediei pentru Admin grade
    //   const content = [<p key="admin">Admin grade: {adminGrade}/10</p>]; // Afișează media ca Admin grade
    //   if (userRole === 'employee') {
    //     const employeeGrade = calculateAverageGrade('gradeEmployee');
    //     content.push(<p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>);
    //   }
    //   return content;
    // };

    // const renderObjectiveGrades = () => {
    //   const adminGrade = calculateAverageGrade('gradeAdmin');
    //   const content = [<p key="admin">Admin grade: {formatGrade(adminGrade)}</p>];
    //   if (userRole === 'employee') {
    //     const employeeGrade = calculateAverageGrade('gradeEmployee');
    //     content.push(<p key="employee">Employee grade: {formatGrade(employeeGrade)}</p>);
    //   }
    //   return content;
    // };

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

  const moveObjectiveToHistory = async (objectiveId) => {
    try {
      // Logică pentru mutarea obiectivului în istoric
      // Exemplu: apelare API pentru a actualiza starea obiectivului ca fiind finalizată
      console.log(`Objective ${objectiveId} moved to history.`);
      // Aici poți adăuga un apel la API pentru a marca obiectivul ca fiind complet și a-l muta în istoric
    } catch (error) {
      console.error("Failed to move objective to history:", error);
    }
  };
  

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
