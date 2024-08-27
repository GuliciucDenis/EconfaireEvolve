import React, { useState } from "react";
import Navbar from '../../components/common/navbar/Navbar'
import Background from '../../components/background/Background';
import Cardboard from '../../components/cardboard/Cardboard';

import './Objectives.css';

const Objectives = () => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);

  const highlightStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  };

  const objectivesData = [
    { 
      title: "Current Objectives", 
      content: [
        "1. Objective Name 1",
        "2. Objective Name 2",
        "3. Objective Name 3",
        "4. Objective Name 4",
        "5. Objective Name 5"
      ]
    },
    { title: "Current SubObjectives", content: "Select an objective to view subobjectives" },
    { title: "Objective Status", content: "Select an objective to view status" },
  ];

  const subobjectives = [
    ["1.1 SubObjective for Objective 1", "1.2 SubObjective for Objective 1"],
    ["2.1 SubObjective for Objective 2", "2.2 SubObjective for Objective 2"],
    ["3.1 SubObjective for Objective 3", "3.2 SubObjective for Objective 3"],
    ["4.1 SubObjective for Objective 4", "4.2 SubObjective for Objective 4"],
    ["5.1 SubObjective for Objective 5", "5.2 SubObjective for Objective 5"]
  ];

  const objectiveStatuses = [
    { status: "Done", adminGrade: 8, userGrade: 7, deadline: "2023-12-31", description: "Description for Objective 1" },
    { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-01-15", description: "Description for Objective 2" },
    { status: "Done", adminGrade: 9, userGrade: 8, deadline: "2023-11-30", description: "Description for Objective 3" },
    { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-02-28", description: "Description for Objective 4" },
    { status: "Done", adminGrade: 7, userGrade: 6, deadline: "2023-12-15", description: "Description for Objective 5" }
  ];

  const subobjectiveStatuses = [
    [
      { status: "Done", adminGrade: 1, userGrade: 7, deadline: "2023-12-15", description: "Description for Subobjective 1.1" },
      { status: "Undone", adminGrade: 2, userGrade: 0, deadline: "2023-12-31", description: "Description for Subobjective 1.2" },
    ],
    [
      { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-01-10", description: "Description for Subobjective 2.1" },
      { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-01-20", description: "Description for Subobjective 2.2" },
    ],
    [
      { status: "Done", adminGrade: 9, userGrade: 8, deadline: "2023-11-15", description: "Description for Subobjective 3.1" },
      { status: "Done", adminGrade: 9, userGrade: 8, deadline: "2023-11-30", description: "Description for Subobjective 3.2" },
    ],
    [
      { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-02-15", description: "Description for Subobjective 4.1" },
      { status: "Undone", adminGrade: 0, userGrade: 0, deadline: "2024-02-28", description: "Description for Subobjective 4.2" },
    ],
    [
      { status: "Done", adminGrade: 7, userGrade: 6, deadline: "2023-12-05", description: "Description for Subobjective 5.1" },
      { status: "Done", adminGrade: 7, userGrade: 6, deadline: "2023-12-15", description: "Description for Subobjective 5.2" },
    ],
  ];

  const handleObjectiveClick = (index) => {
    setSelectedObjective(index);
    setSelectedSubobjective(null);
  };

  const handleSubobjectiveClick = (index) => {
    setSelectedSubobjective(index);
  };

  const getStatusContent = (objectiveIndex, subobjectiveIndex) => {
    if (objectiveIndex === null) return "Select an objective to view status";
    
    const objectiveStatus = objectiveStatuses[objectiveIndex];
    const subobjectiveStatus = subobjectiveIndex !== null ? subobjectiveStatuses[objectiveIndex][subobjectiveIndex] : null;
  
    const headerStyle = {
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '15px'
    };
  
    return (
      <>
        
        <p>Admin grade: {objectiveStatus.adminGrade}/10</p>
        <p>User grade: {objectiveStatus.userGrade}/10</p>
        <p>Deadline: {objectiveStatus.deadline}</p>
        <p>Description: {objectiveStatus.description}</p>
  
        {subobjectiveStatus && (
          <>
            <h2 style={headerStyle}>Subobjective Status</h2>
            <p>Status: {subobjectiveStatus.status}</p>
            <p>Admin grade: {subobjectiveStatus.adminGrade}/10</p>
            <p>User grade: {subobjectiveStatus.userGrade}/10</p>
          </>
        )}
      </>
    );
  };

  return (
    <div className="objectives-container">
      <Background/>
      <div className="content-wrapper">
        <div className="user-info">User/Users selected: User 1, User 2, User 3</div>
        <div className="cardboard-container">
          <Cardboard 
            title={objectivesData[0].title} 
            content={objectivesData[0].content.map((objective, index) => (
              <div 
                key={index} 
                onClick={() => handleObjectiveClick(index)}
                className={`objective-item ${index === selectedObjective ? 'selected' : ''}`}
              >
                {objective}
              </div>
            ))} 
          />
          <Cardboard 
            title={objectivesData[1].title} 
            content={selectedObjective !== null ? subobjectives[selectedObjective].map((subobjective, index) => (
              <div 
                key={index} 
                onClick={() => handleSubobjectiveClick(index)}
                className={`subobjective-item ${index === selectedSubobjective ? 'selected' : ''}`}
              >
                {subobjective}
              </div>
            )) : objectivesData[1].content} 
          />
          <Cardboard 
            title="Objective and Subobjective Details"
            content={getStatusContent(selectedObjective, selectedSubobjective)} 
          />
        </div>
      </div>
      <Navbar/>
    </div>
  );
};

export default Objectives;