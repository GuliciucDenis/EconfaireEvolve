import React, { useState } from "react";
import Navbar from '../../components/common/navbar/Navbar'
import Background from '../../components/background/Background';
import User from '../../components/common/user/User';
import Cardboard from '../../components/cardboard/Cardboard';
import './History.css';

const History = () => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedSubobjective, setSelectedSubobjective] = useState(null);

  const objectivesData = [
    { 
      title: "Past Objectives", 
      content: [
        "1. Completed Objective 1",
        "2. Completed Objective 2",
        "3. Completed Objective 3",
        "4. Completed Objective 4",
        "5. Completed Objective 5"
      ]
    },
    { title: "Past SubObjectives", content: "Select an objective to view past subobjectives" },
    { title: "Objective and Subobjective Details", content: "Select an objective to view status" },
  ];

  const subobjectives = [
    ["1.1 Completed SubObjective for Objective 1", "1.2 Completed SubObjective for Objective 1"],
    ["2.1 Completed SubObjective for Objective 2", "2.2 Completed SubObjective for Objective 2"],
    ["3.1 Completed SubObjective for Objective 3", "3.2 Completed SubObjective for Objective 3"],
    ["4.1 Completed SubObjective for Objective 4", "4.2 Completed SubObjective for Objective 4"],
    ["5.1 Completed SubObjective for Objective 5", "5.2 Completed SubObjective for Objective 5"]
  ];

  const objectiveStatuses = [
    { status: "Completed", adminGrade: 8, userGrade: 7, completionDate: "2023-12-31", description: "Description for Completed Objective 1" },
    { status: "Completed", adminGrade: 9, userGrade: 8, completionDate: "2024-01-15", description: "Description for Completed Objective 2" },
    { status: "Completed", adminGrade: 7, userGrade: 6, completionDate: "2023-11-30", description: "Description for Completed Objective 3" },
    { status: "Completed", adminGrade: 10, userGrade: 9, completionDate: "2024-02-28", description: "Description for Completed Objective 4" },
    { status: "Completed", adminGrade: 8, userGrade: 7, completionDate: "2023-12-15", description: "Description for Completed Objective 5" }
  ];

  const subobjectiveStatuses = [
    [
      { status: "Done", adminGrade: 8, userGrade: 7, completionDate: "2023-12-15"},
      { status: "Done", adminGrade: 8, userGrade: 7, completionDate: "2023-12-31"},
    ],
    [
      { status: "Done", adminGrade: 9, userGrade: 8, completionDate: "2024-01-10"},
      { status: "Done", adminGrade: 9, userGrade: 8, completionDate: "2024-01-20"},
    ],
    [
      { status: "Done", adminGrade: 7, userGrade: 6, completionDate: "2023-11-15"},
      { status: "Done", adminGrade: 7, userGrade: 6, completionDate: "2023-11-30"},
    ],
    [
      { status: "Done", adminGrade: 10, userGrade: 9, completionDate: "2024-02-15"},
      { status: "Done", adminGrade: 10, userGrade: 9, completionDate: "2024-02-28"},
    ],
    [
      { status: "Done", adminGrade: 8, userGrade: 7, completionDate: "2023-12-05"},
      { status: "Done", adminGrade: 8, userGrade: 7, completionDate: "2023-12-15"},
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
        <p>Status: {objectiveStatus.status}</p>
        <p>Admin grade: {objectiveStatus.adminGrade}/10</p>
        <p>User grade: {objectiveStatus.userGrade}/10</p>
        <p>Completion Date: {objectiveStatus.completionDate}</p>
        <p>Description: {objectiveStatus.description}</p>

        {subobjectiveStatus && (
          <>
            <h2 style={headerStyle}>Subobjective Status</h2>
            <p>Status: {subobjectiveStatus.status}</p>
            <p>Admin grade: {subobjectiveStatus.adminGrade}/10</p>
            <p>User grade: {subobjectiveStatus.userGrade}/10</p>
            <p>Completion Date: {subobjectiveStatus.completionDate}</p>
          </>
        )}
      </>
    );
  };

  return (
    <div className="history-container">
      <Background/>
      <User />
      <div className="content-wrapper">
        <div className="user-info-history-page">History</div>
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
            title={objectivesData[2].title}
            content={getStatusContent(selectedObjective, selectedSubobjective)} 
          />
        </div>
      </div>
      <Navbar/>
    </div>
  );
};

export default History;