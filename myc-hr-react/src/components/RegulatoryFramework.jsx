import React from 'react';
import { ShieldCheck, Info, FileText, CheckCircle, Scale, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

const RegulatoryFramework = () => {
  return (
    <div className="section active animate-fade-in">
      <div className="framework-header-premium">
        <div className="header-glass-overlay"></div>
        <div className="header-text-premium">
            <div className="premium-badge"><Scale size={14} /> Conformité Industrielle</div>
            <h1>Guide & Règlementation</h1>
            <p>Comprendre les normes éthiques, sociales et environnementales de MYC Beauty Innovation.</p>
        </div>
      </div>

      <div className="regulatory-grid-premium">
        <div className="reg-card-premium main-red">
          <div className="reg-icon-box"><ShieldCheck size={32} /></div>
          <h3>La Norme SA8000</h3>
          <p>Le standard international pour la responsabilité sociale. Il garantit des conditions de travail décentes, l'absence de discrimination et le respect des droits des travailleurs.</p>
          <ul className="reg-list-premium">
            <li><CheckCircle size={16} /> Santé et Sécurité au travail</li>
            <li><CheckCircle size={16} /> Liberté d'association</li>
            <li><CheckCircle size={16} /> Heures de travail réglementées</li>
          </ul>
        </div>

        <div className="reg-card-premium main-gold">
          <div className="reg-icon-box"><BookOpen size={32} /></div>
          <h3>Procédures RH</h3>
          <p>Toutes nos procédures internes (Codes commençant par MYC-FM-HR) définissent les flux de travail pour le recrutement, la formation et l'évaluation.</p>
          <div className="reg-stat">
            <strong>24+</strong>
            <span>Procédures Actives</span>
          </div>
        </div>
      </div>

      <div className="workflow-section-premium">
        <div className="workflow-header">
            <h2>Processus de Validation RH</h2>
            <p>Comment vos demandes sont traitées par le système.</p>
        </div>
        
        <div className="workflow-steps-premium">
            <div className="step-card-premium">
                <div className="step-number">01</div>
                <h4>Soumission</h4>
                <p>Dépôt du document ou formulaire via le portail.</p>
            </div>
            <div className="step-arrow"><ArrowRight /></div>
            <div className="step-card-premium">
                <div className="step-number">02</div>
                <h4>Vérification</h4>
                <p>Contrôle de conformité par le responsable.</p>
            </div>
            <div className="step-arrow"><ArrowRight /></div>
            <div className="step-card-premium">
                <div className="step-number">03</div>
                <h4>Validation</h4>
                <p>Enregistrement final sur Supabase Cloud.</p>
            </div>
        </div>
      </div>

      <style>{`
        .framework-header-premium {
            height: 350px;
            border-radius: 40px;
            background-image: url('/BACK VIEW (1).png');
            background-size: cover;
            background-position: center;
            position: relative;
            margin-bottom: 4rem;
            overflow: hidden;
            display: flex;
            align-items: center;
            padding: 0 4rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        .header-glass-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
        }
        .header-text-premium { position: relative; z-index: 1; color: white; max-width: 600px; }
        .premium-badge { background: var(--red); padding: 6px 14px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.5rem; }
        .header-text-premium h1 { font-size: 3rem; margin-bottom: 1rem; letter-spacing: -2px; }
        .header-text-premium p { font-size: 1.2rem; opacity: 0.9; line-height: 1.5; }

        .regulatory-grid-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 5rem; }
        .reg-card-premium { background: white; padding: 3rem; border-radius: 35px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); position: relative; transition: 0.3s; }
        .reg-card-premium:hover { transform: scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.08); }
        .reg-icon-box { margin-bottom: 2rem; color: var(--red); }
        .reg-card-premium h3 { font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--text-main); }
        .reg-card-premium p { color: var(--text-muted); line-height: 1.7; font-size: 1.05rem; margin-bottom: 2rem; }

        .reg-list-premium { list-style: none; padding: 0; }
        .reg-list-premium li { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-weight: 600; color: var(--text-main); font-size: 0.9rem; }
        .reg-list-premium li svg { color: #2ecc71; }

        .main-gold .reg-icon-box { color: var(--gold); }
        .reg-stat { display: flex; align-items: center; gap: 15px; background: #fffdf0; padding: 1rem; border-radius: 20px; border: 1px solid #fee2e2; width: fit-content; }
        .reg-stat strong { font-size: 1.8rem; color: var(--gold); }
        .reg-stat span { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }

        .workflow-section-premium { text-align: center; padding-bottom: 5rem; }
        .workflow-header { margin-bottom: 4rem; }
        .workflow-header h2 { font-size: 2.2rem; margin-bottom: 10px; }

        .workflow-steps-premium { display: flex; align-items: center; justify-content: center; gap: 2rem; }
        .step-card-premium { background: white; padding: 2rem; border-radius: 30px; border: 1px solid var(--border-color); flex: 1; max-width: 280px; position: relative; }
        .step-number { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: var(--text-main); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; }
        .step-card-premium h4 { font-size: 1.2rem; margin: 1rem 0 0.5rem; }
        .step-card-premium p { font-size: 0.85rem; color: var(--text-muted); }
        .step-arrow { color: var(--border-color); }

        @media (max-width: 900px) {
            .regulatory-grid-premium { grid-template-columns: 1fr; }
            .workflow-steps-premium { flex-direction: column; }
            .step-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
};

export default RegulatoryFramework;
