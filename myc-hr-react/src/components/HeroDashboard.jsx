import React from 'react';
import { Users, Building, Key, Award, FileText, UserPlus, Star, ChevronRight } from 'lucide-react';

const HeroDashboard = () => {
  return (
    <div className="section active animate-fade-in">
      <div 
        className="hero-premium" 
        style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(196, 30, 58, 0.85) 0%, rgba(26, 26, 26, 0.9) 100%), url('/BACK VIEW (1).png')`,
        }}
      >
        <div className="hero-premium-content">
            <div className="badge-exclusive">
                <Star size={14} fill="currentColor" /> Excellence Industrielle
            </div>
            <h1>MYC Beauty Innovation <br/><span className="subtitle">Portail Collaborateur & RH</span></h1>
            <p>Accédez à l'ensemble des ressources de l'usine : organigramme, bibliothèque de procédures, et outils de gestion centralisée sur Supabase.</p>
            
            <div className="hero-actions">
                <div className="status-pill-white">
                    <span className="dot"></span> Système Cloud Connecté
                </div>
            </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
            <h2><Award color="var(--gold)" /> Performances & Métriques</h2>
            <p>Indicateurs clés de l'usine de Tunisie</p>
        </div>
        
        <div className="premium-grid">
            <div className="premium-card">
                <div className="card-icon-box"><Users size={24} /></div>
                <div className="card-data">
                    <h3>150+</h3>
                    <p>Collaborateurs</p>
                </div>
            </div>
            <div className="premium-card">
                <div className="card-icon-box"><Building size={24} /></div>
                <div className="card-data">
                    <h3>6</h3>
                    <p>Départements</p>
                </div>
            </div>
            <div className="premium-card">
                <div className="card-icon-box"><Key size={24} /></div>
                <div className="card-data">
                    <h3>Direct</h3>
                    <p>Accès Managers</p>
                </div>
            </div>
            <div className="premium-card">
                <div className="card-icon-box"><Award size={24} /></div>
                <div className="card-data">
                    <h3>2024</h3>
                    <p>Référentiel</p>
                </div>
            </div>
        </div>

        <div className="news-section">
            <div className="news-card">
                <div className="news-badge">Nouveau</div>
                <h3>Migration Supabase Cloud Terminée</h3>
                <p>Tous les documents RH (Formulaires, procédures SA8000) sont désormais stockés en ligne de façon sécurisée.</p>
                <div className="news-footer">
                    <span>En savoir plus</span> <ChevronRight size={16} />
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .hero-premium {
            padding: 4rem 3rem;
            border-radius: 30px;
            color: white;
            background-size: cover;
            background-position: center;
            margin-bottom: 3rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }
        .hero-premium-content { max-width: 700px; position: relative; z-index: 1; }
        .hero-premium h1 { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px; }
        .hero-premium .subtitle { font-size: 1.5rem; opacity: 0.8; font-weight: 300; }
        .hero-premium p { font-size: 1.1rem; line-height: 1.6; opacity: 0.9; margin-bottom: 2rem; }

        .badge-exclusive { background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; }
        
        .status-pill-white { background: white; color: var(--text-main); padding: 8px 16px; border-radius: 30px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; }
        .dot { width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }

        .dashboard-content { padding: 0 1rem; }
        .content-header { margin-bottom: 2rem; }
        .content-header h2 { font-size: 1.8rem; display: flex; align-items: center; gap: 12px; margin-bottom: 5px; }
        .content-header p { color: var(--text-muted); font-size: 1rem; }

        .premium-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .premium-card { background: white; padding: 1.5rem; border-radius: 24px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 20px; transition: 0.3s; box-shadow: var(--shadow-sm); }
        .premium-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); border-color: var(--red); }
        .card-icon-box { background: #fff5f5; color: var(--red); padding: 12px; border-radius: 16px; }
        .card-data h3 { font-size: 1.5rem; margin-bottom: 2px; }
        .card-data p { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin: 0; }

        .news-section { background: white; border-radius: 24px; border: 1px solid var(--border-color); padding: 2rem; box-shadow: var(--shadow-sm); }
        .news-card { position: relative; }
        .news-badge { position: absolute; top: 0; right: 0; background: #d4af37; color: white; padding: 4px 12px; border-radius: 30px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .news-card h3 { font-size: 1.3rem; margin-bottom: 1rem; }
        .news-card p { color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem; }
        .news-footer { display: flex; align-items: center; gap: 5px; color: var(--red); font-weight: 700; font-size: 0.9rem; cursor: pointer; }

        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default HeroDashboard;
