// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function ViewObjectives() {
//   const { userId } = useParams();
//   const [objectives, setObjectives] = useState([]);

//   useEffect(() => {
//     const fetchObjectives = async () => {
//       try {
//         const data = await getUserObjectives(userId);
//         setObjectives(data);
//       } catch (error) {
//         console.error("Error fetching objectives:", error);
//       }
//     };

//     fetchObjectives();
//   }, [userId]);

//   return (
//     <div>
//       <h1>Objectives for User {userId}</h1>
//       <ul>
//         {objectives.map((objective, index) => (
//           <li key={index}>{objective.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ViewObjectives;
