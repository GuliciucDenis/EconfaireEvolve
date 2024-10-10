import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import { getObjectiveById, updateObjectiveStatus} from "../../services/objectiveService";
import { getSubobjectivesByObjectiveId, gradeSubobjectiveByObjectiveId } from "../../services/subobjectiveService";
import GradeSubobjectivePopup from "../../components/common/GradeSubobjectivePopup/GradeSubobjectivePopup";
import "./Objectives.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/language-selector";

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
  const {t}=useTranslation();

  // Fetch user data and objectives
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log("Fetching user data...");
        const user = await getUserById(userId);
        if (user) {
          setCurrentUser(user);
          setUserRole(user.role);
          // console.log("User fetched:", user);
        }
        const userObjectiveIds = user.objectiveList;
        const objectives = await Promise.all(userObjectiveIds.map(getObjectiveById));

        // Filter objectives to exclude those fully graded
        const activeObjectives = objectives.filter(
          (objective) =>
          (objective.subObjectives.length === 0 ||
            objective.subObjectives?.some(sub => sub.gradeAdmin <= 1 || sub.gradeEmployee <= 1) )
        );

        setUserObjectives(activeObjectives);
      } catch (error) {
        // console.error("Failed to fetch user or objectives:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle clicking on an objective
  const handleObjectiveClick = async (index) => {
    if (index === selectedObjective) {
      setSelectedObjective(null);
      setSubobjectives([]);
      return;
    }

    setSelectedObjective(index);
    setSelectedSubobjective(null);
    try {
      const subobjectivesData = await getSubobjectivesByObjectiveId(userObjectives[index].id);
      // console.log("Fetched Subobjectives: ",subobjectivesData);
      setSubobjectives(subobjectivesData);
    } catch (error) {
      // console.error("Failed to fetch subobjectives:", error);
    }
  };

  // Handle clicking on a subobjective
  const handleSubobjectiveClick = (index) => {
    setSelectedSubobjective(index);
  };

  // Handle grading a subobjective
  const handleGradeSubobjective = async (grade) => {
    if (selectedSubobjective === null) return;

    // Ensure currentUser is properly set before using
    if (!currentUser?.id) {
      // console.error("Current user not set correctly:", currentUser);
      return;
    }

    try {
      const subobjectiveToGrade = subobjectives[selectedSubobjective];
      // console.log("Grading subobjective with current user ID:", currentUser.id);
      
      const updatedObjective = await gradeSubobjectiveByObjectiveId(
        userObjectives[selectedObjective]?.id,
        subobjectiveToGrade.title,
        grade,
        userRole,
        currentUser.id // Ensure currentUser.id is correctly passed
      );

      // Update local state with new subobjectives and objectives
      setSubobjectives(updatedObjective.subObjectives);
      setUserObjectives(prevObjectives =>
        prevObjectives.map(obj =>
          obj.id === updatedObjective.id ? updatedObjective : obj
        )
      );

      const isAdmin = userRole === "admin";
      const isEmployee = userRole === "employee";

      const allSubobjectivesGraded = updatedObjective.subObjectives.every(sub => {
        if (isAdmin) {
          return sub.gradeAdmin > 1 && sub.gradeEmployee !== 1;
        } else if (isEmployee) {
          return sub.gradeAdmin > 1 && sub.gradeEmployee > 1;
        } else {
          return false;
        }
      });

      // console.log(updatedObjective);
      // If all subobjectives are graded, then update the objective's status
      if (allSubobjectivesGraded) {
        await updateObjectiveStatus(updatedObjective.id, 'completed');
        setUserObjectives(prevObjectives =>
          prevObjectives.filter(obj => obj.id !== updatedObjective.id)
        );

        // Clear selected objective and subobjectives after completion
        setSelectedObjective(null);
        setSubobjectives([]);
      }
      else
      {
        await updateObjectiveStatus(updatedObjective.id, "new");
      }
    } catch (error) {
      // console.error("Failed to grade subobjective:", error);
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
    if (selectedObjective === null) return t('objectives.selectObjectiveToViewStatus');
    const objective = userObjectives[selectedObjective];
    const subobjective = subobjectives[selectedSubobjective];

    const renderObjectiveGrades = () => {
      const adminGrade = calculateAverageGrade('gradeAdmin');
      const content = [<p key="admin">{t('objectives.adminGrade')}: {formatGrade(adminGrade)}</p>];
      if (userRole === 'employee') {
        const employeeGrade = calculateAverageGrade('gradeEmployee');
        content.push(<p key="employee">{t('objectives.employeeGrade')}: {formatGrade(employeeGrade)}</p>);
      }
      return content;
    };

    const renderSubobjectiveGrades = () => {
      if (!subobjective) return null;
      const content = [<p key="admin">{t('objectives.adminGrade')}: {formatGrade(subobjective.gradeAdmin)}</p>];
      if (userRole === 'employee') {
        content.push(<p key="employee">{t('objectives.employeeGrade')}: {formatGrade(subobjective.gradeEmployee)}</p>);
      }
      return content;
    };

    return (
      <div className="objective-status">
        <p className="objective-status-container">{t('objectives.description')}: {objective.description}</p>
        <p>{t('objectives.deadline')}: {new Date(objective.deadline).toLocaleDateString()}</p>
        {renderObjectiveGrades()}
        {selectedSubobjective !== null && (
          <>
            <h2 className="subobjective-status-title">{t('objectives.subobjectiveStatus')}</h2>
            <p className="subobjective-description-container">{t('objectives.description')}: {subobjective.description}</p>
            {renderSubobjectiveGrades()}
          </>
        )}
      </div>
    );
  };

  // Render the main objectives component
  return (
    <div className="objectives-container">
      <Background />
      <User />
      <LanguageSelector />
      <div className="content-wrapper">
        <div className="objectives-title-container">
          <h1 className="objectives-title">{t('objectives.title')}</h1>
        </div>
        <div className="user-info">
          {currentUser ? (
            <>
              {t('objectives.selectedUser')}: {currentUser.firstName} {currentUser.lastName}
            </>
          ) : (
            <>{t('objectives.loadingUserInformation')}</>
          )}
        </div>
        <div className="cardboard-container">
          <Cardboard
            title={t('objectives.currentObjectives')}
            content={userObjectives.map((objective, index) => (
              <div
                key={objective.id}
                onClick={() => handleObjectiveClick(index)}
                onKeyDown={(e) => e.key === 'Enter' && handleObjectiveClick(index)}
                tabIndex={0}
                className={`objective-item ${
                  index === selectedObjective ? "selected" : ""
                }`}
              >
                {objective.title}
              </div>
            ))}
          />
          <Cardboard
            title={t('objectives.currentSubobjectives')}
            content={subobjectives.map((subobjective, index) => (
              <div
                key={subobjective.id}
                className={`subobjective-item ${
                  index === selectedSubobjective ? "selected" : ""
                }`}
                onClick={() => handleSubobjectiveClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSubobjectiveClick(index);
                  }
                }}
                tabIndex={0}
              >
                {subobjective.title}
              </div>
            ))}
          />
          <Cardboard title={t('objectives.objectiveStatus')} content={getStatusContent()} />
        </div>
        <div className="action-buttons-container">
          <button 
            onClick={() => setIsGradeSubobjectivePopupOpen(true)} 
            className="grade-button"
            disabled={selectedSubobjective === null}
          >
            {t('objectives.gradeSubobjective')}
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
