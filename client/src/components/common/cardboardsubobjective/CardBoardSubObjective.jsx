import React from 'react';
import './CardBoardSubObjective.css';

const CardBoardSubObjective = ({ title, objectiveDescription, objectiveDeadline, subobjectives, onItemClick, selectedSubobjective }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="objective-info">
        <p><strong>Objective Description:</strong> {objectiveDescription}</p>
        <p><strong>Objective Deadline:</strong> {new Date(objectiveDeadline).toLocaleDateString()}</p>
      </div>
      <h3>Subobjectives:</h3>
      {subobjectives && subobjectives.length > 0 ? (
        <ul className="subobjectives-list">
          {subobjectives.map((subobjective, index) => (
            <li 
              key={index} 
              className={`subobjective-item ${selectedSubobjective && selectedSubobjective.id === subobjective.id ? 'selected' : ''}`}
              onClick={() => onItemClick(index)}
            >
              <span>{subobjective.title}</span>
              <span>Deadline: {new Date(subobjective.deadline).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subobjectives available</p>
      )}
    </div>
  );
};

export default CardBoardSubObjective;