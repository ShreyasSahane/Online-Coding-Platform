import React, { useState } from 'react';
import './styles/Structure.css';
import Navbar from './editor_components/Navbar';
import ProblemSection from './editor_components/ProblemSection';
import AppContainer from './editor_components/AppContainer';

const Structure = () => {
  const [activeTab, setActiveTab] = useState('description'); // Default to 'description'

  // Function to update activeTab when a navbar button is clicked
  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="structure">
      {/* Sidebar */}
      <div className="sidebar">
        <Navbar activeTab={activeTab} onTabChange={onTabChange} />
        <ProblemSection activeTab={activeTab} />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <AppContainer />
      </div>
    </div>
  );
};

export default Structure;
