import React from 'react';
import { Leaf } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav>
      <div className="logo">
        <img src="/LOGO.png" alt="MYC Beauty Innovation" className="logo-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        <span style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
            <Leaf color="var(--gold)" />
            <span>MYC <span style={{ color: 'var(--gold)' }}>Beauty</span> <span style={{ color: 'var(--red)' }}>Innovation</span></span>
        </span>
      </div>
      <ul className="nav-links">
        <li className={activeTab === 'accueil' ? 'active' : ''} onClick={() => setActiveTab('accueil')}>Accueil & KPI</li>
        <li className={activeTab === 'organigramme' ? 'active' : ''} onClick={() => setActiveTab('organigramme')}>Organigramme</li>
        <li className={activeTab === 'departements' ? 'active' : ''} onClick={() => setActiveTab('departements')}>Départements</li>
        <li className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>Documents RH</li>
      </ul>
    </nav>
  );
};

export default Navbar;
