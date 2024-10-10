import React from 'react';
import './Cardboard.css';

const Cardboard = ({ title, content, onItemClick }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {Array.isArray(content) ? (
        <ul className="objectives-list">
          {content.map((item) => (
            <li key={item.id} onClick={() => onItemClick?.(item.id)}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className='objective-status-cardboard'>{content}</span>
      )}
    </div>
  );
};

export default Cardboard;