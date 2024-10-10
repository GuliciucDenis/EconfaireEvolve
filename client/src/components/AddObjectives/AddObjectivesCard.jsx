import React from 'react';
import './AddObjectivesCard.css';

const Cardboard = ({ title, content, onItemClick }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {Array.isArray(content) ? (
        <ul className="objectives-list">
          {content.map((item) => (
            <li 
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              onKeyDown={(e) => e.key === 'Enter' && onItemClick?.(item.id)}
              tabIndex={0}
            >
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
// Cardboard.propTypes = {
//   title: PropTypes.string.isRequired,
//   content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
//   onItemClick: PropTypes.func,
// };
export default Cardboard;