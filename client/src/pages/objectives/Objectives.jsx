import React from "react";
import Navbar from '../../components/common/navbar/Navbar'
import Background from '../../components/background/Background';
import Cardboard from '../../components/cardboard/Cardboard';

import './Objectives.css';

const Objectives = () => {
  return (
    <div>
      <Background/>
      <div className="cardboard-container">
        <Cardboard/>
        <Cardboard/>
        <Cardboard/>
      </div>
      <Navbar/>
    </div>
  );
};

export default Objectives;