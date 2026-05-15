import React from 'react';
import { Users, Building, Key, Award, FileText, UserPlus, Star } from 'lucide-react';

const HeroDashboard = () => {
  return (
    <div className="section active">
      <div 
        className="hero" 
        style={{ 
            backgroundImage: `linear-gradient(rgba(196, 30, 58, 0.7), rgba(26, 26, 26, 0.8)), url('/BACK VIEW (1).png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTop: '5px solid var(--red)'
        }}
      >
        <div className="hero-content">
            <div className="badge-premium">
                <Star size={16} fill="currentColor" /> Plateforme de gestion RH complète
            </div>
            <h1>Ressources Humaines <br/><span>Usine de Tunisie</span></h1>
            <p>Bienvenue sur le portail RH de MYC Beauty Innovation. Retrouvez ici toute la structure organisationnelle, la gestion du personnel et la bibliothèque centralisée des documents RH.</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Award color="var(--gold)" /> Tableau de Bord KPI
      </h2>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Users size={32} /></div>
          <div className="kpi-value">150+</div>
          <div className="kpi-label">Collaborateurs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Building size={32} /></div>
          <div className="kpi-value">8</div>
          <div className="kpi-label">Départements</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Key size={32} /></div>
          <div className="kpi-value">20+</div>
          <div className="kpi-label">Postes Clés</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><Award size={32} /></div>
          <div className="kpi-value">100%</div>
          <div className="kpi-label">Conformité ISO</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FileText size={32} /></div>
          <div className="kpi-value">15</div>
          <div className="kpi-label">Documents RH</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><UserPlus size={32} /></div>
          <div className="kpi-value">3</div>
          <div className="kpi-label">Postes à Recruter</div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
