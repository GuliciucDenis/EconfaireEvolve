import React from 'react';
import './AddObjectivesCard.css';

const Cardboard = ({ title, content, onItemClick }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {Array.isArray(content) ? (
        <ul className="objectives-list">
          {content.map((item, index) => (
            <li key={index} onClick={() => onItemClick && onItemClick(index)}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default Cardboard;