import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <ul>
          <li><Link to="/users">Manage Users</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;