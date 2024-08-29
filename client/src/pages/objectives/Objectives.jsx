import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import Navbar from '../../components/common/navbar/Navbar'
import Background from '../../components/background/Background';
import Cardboard from '../../components/cardboard/Cardboard';
import User from '../../components/common/user/User';
import { getUserById } from "../../services/userService";
import { getObjectivesByUserId, getObjectiveById} from "../../services/objectiveService";
import { getSubobjectivesByObjectiveId } from "../../services/subobjectiveService";
import './Objectives.css';

const Objectives = () => {

  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userObjectives, setUserObjectives] = useState([]);
  const [subobjectives, setSubobjectives] = useState([]);
  const { id  } = useParams();
  const userId = id;

  useEffect(() => {
    const fetchUserObjectives = async () => {
      const userObjectiveIds = await getObjectivesByUserId(userId);
      const userObjectives = await Promise.all(userObjectiveIds.map(async (id) => {
        const objective = await getObjectiveById(id);
        return objective;
      }));
      setUserObjectives(userObjectives);
    };
    const fetchCurrentUser = async () => {
      const user = await getUserById(userId);
      setCurrentUser(user);
    };
    const fetchSubobjectives = async () => {
      if (selectedObjectiveId) {
      const subobjectives = await getSubobjectivesByObjectiveId(selectedObjectiveId);
      }
      setSubobjectives(subobjectives);
    };
    fetchUserObjectives();
    fetchCurrentUser();
    fetchSubobjectives();
  }, []);

  const highlightStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  };

  const handleObjectiveClick = (index) => {
    setSelectedObjective(index);
    setSelectedObjectiveId(userObjectives[index].id);
    setSelectedSubobjective(null);
  };

  const handleSubobjectiveClick = (index) => {
    setSelectedSubobjective(index);
  };

  const getStatusContent = (objectiveIndex, subobjectiveIndex) => {
    if (objectiveIndex === null) return "Select an objective to view status";
    const headerStyle = {
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '15px'
    };
    return (
      <>
        <p>Admin grade: {userObjectives[selectedObjective].adminGrade}/10</p>
      </>
    );
  };

  return (
    <div className="objectives-container">
      <Background/>
      <User />
      <div className="content-wrapper">
      {/* <div className="user-info">{currentUser ? (
            <>Selected user: {currentUser.firstName} {currentUser.lastName}</>
          ) : (
            <>Loading user information...</>
          )}</div> */}
        <div className="cardboard-container">
          <Cardboard
            title="Current Objectives"
            content={userObjectives.map((objective, index) => (
              <div
                key={index}
                onClick={() => handleObjectiveClick(index)}
                className={`objective-item ${index === selectedObjective ? 'selected' : ''}`}
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
                className={`subobjective-item ${index === selectedSubobjective ? 'selected' : ''}`}
              >
                {subobjective.title}
              </div>
            ))}
          />
          <Cardboard
            title="Objective Status"
            content={getStatusContent(selectedObjective, selectedSubobjective)}
          />
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Objectives;