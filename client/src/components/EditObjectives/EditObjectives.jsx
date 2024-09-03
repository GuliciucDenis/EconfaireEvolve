import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import Cardboard from "../../components/cardboard/Cardboard";
import User from "../../components/common/user/User";
import { getUserById } from "../../services/userService";
import { getObjectiveById } from "../../services/objectiveService";
import "./EditObjectives.css";

function EditObjectives() {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [recommendedObjectives, setRecommendedObjectives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
  
        const objectives = await Promise.all(
          user.objectiveList.map(getObjectiveById)
        );
        // console.log(objectives);
        debugger;
        // Exclude obiectivele care au fost evaluate complet de admin și angajat
        const currentObjectives = objectives.filter(
          (obj) => obj.gradeAdmin <= 1 || obj.gradeEmployee <= 1
        );
        console.log(currentObjectives);
        setUserObjectives(currentObjectives);
  
        // Setarea obiectivelor recomandate
        setRecommendedObjectives([
          "Perseverance",
          "Creativity",
          "Time Management",
          "Adaptability",
          "Continuous Learning",
        ]);
      } catch (error) {
        console.error("Failed to fetch user or objectives:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId]);
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-objectives-container">
      <Background />
      <User />
      <div className="edit-objectives-content-wrapper">
        <div className="cardboard-container">
          <Cardboard
            title="Recommended Objectives"
            content={recommendedObjectives.map((obj, index) => (
              <div key={index} className="objective-item">
                {obj}
              </div>
            ))}
          />
          <Cardboard
            title="Existing Objectives"
            content={userObjectives.map((obj, index) => (
              <div key={index} className="objective-item">
                {obj.title}
              </div>
            ))}
          />
        </div>
        <div className="action-buttons-container">
          <button className="action-button add-button">
            Create Objective
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}

export default EditObjectives;
