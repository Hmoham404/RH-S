import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import OrgChart from './components/OrgChart';
import Departments from './components/Departments';
import DocLibrary from './components/DocLibrary';

function App() {
  const [activeTab, setActiveTab] = useState('accueil');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'accueil' && <HeroDashboard />}
        {activeTab === 'organigramme' && <OrgChart />}
        {activeTab === 'departements' && <Departments />}
        {activeTab === 'documents' && <DocLibrary />}
      </main>
    </div>
  );
}

export default App;
