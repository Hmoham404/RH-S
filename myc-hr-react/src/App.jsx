import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import OrgChart from './components/OrgChart';
import RegulatoryFramework from './components/RegulatoryFramework';
import DocLibrary from './components/DocLibrary';
import Login from './components/Login';
import FileManager from './components/FileManager';
import EmployeeManager from './components/EmployeeManager';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accueil');

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="spinner" size={48} color="var(--red)" />
        <p>Chargement du portail...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} session={session} />
      
      <main className="main-content">
        {activeTab === 'accueil' && <HeroDashboard />}
        {activeTab === 'base' && <EmployeeManager />}
        {activeTab === 'organigramme' && <OrgChart />}
        {activeTab === 'reglement' && <RegulatoryFramework />}
        {activeTab === 'documents' && <DocLibrary setActiveTab={setActiveTab} />}
        {activeTab === 'archive' && <FileManager />}
      </main>
    </div>
  );
}

export default App;
