import React from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, 
  Leaf, 
  Home, 
  Users, 
  LayoutGrid, 
  BookOpen, 
  FileText, 
  Archive 
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav>
      <div className="logo" onClick={() => setActiveTab('accueil')} style={{ cursor: 'pointer' }}>
        <img 
          src="/LOGO.png" 
          alt="MYC Beauty Innovation" 
          className="logo-img" 
          onError={(e) => { 
            e.target.style.display='none'; 
            if (e.target.nextSibling) e.target.nextSibling.style.display='flex'; 
          }} 
        />
        <span style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
            <Leaf color="var(--gold)" />
            <span>MYC <span style={{ color: 'var(--gold)' }}>Beauty</span> <span style={{ color: 'var(--red)' }}>Innovation</span></span>
        </span>
      </div>
      <ul className="nav-links">
        <li className={activeTab === 'accueil' ? 'active' : ''} onClick={() => setActiveTab('accueil')}>
          <Home size={18} /> Accueil
        </li>
        <li className={activeTab === 'base' ? 'active' : ''} onClick={() => setActiveTab('base')}>
          <Users size={18} /> Base Employés
        </li>
        <li className={activeTab === 'organigramme' ? 'active' : ''} onClick={() => setActiveTab('organigramme')}>
          <LayoutGrid size={18} /> Organigramme
        </li>
        <li className={activeTab === 'reglement' ? 'active' : ''} onClick={() => setActiveTab('reglement')}>
          <BookOpen size={18} /> Guide
        </li>
        <li className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>
          <FileText size={18} /> Documents
        </li>
        <li className={activeTab === 'archive' ? 'active' : ''} onClick={() => setActiveTab('archive')}>
          <Archive size={18} /> Archive
        </li>
      </ul>
      <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{session?.user?.email}</span>
        <button 
          onClick={handleLogout} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--red)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}
          title="Déconnexion"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
