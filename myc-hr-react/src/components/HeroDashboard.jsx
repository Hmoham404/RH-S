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

        <div className="media-spotlight">
            <div className="media-card media-card-featured">
                <div className="media-header">
                    <span className="media-tag">Video</span>
                    <h3>MYC Tunisia Beauty Innovation</h3>
                    <p>Inauguration du site industriel a Monastir.</p>
                </div>
                <div className="media-embed">
                    <video
                        className="media-video"
                        controls
                        preload="metadata"
                        poster="/MYCARTICL.jpg"
                    >
                        <source src="/snapsave-app_1469545861404678_hd.mp4" type="video/mp4" />
                        Votre navigateur ne prend pas en charge la video HTML5.
                    </video>
                </div>
            </div>

            <div className="media-card media-card-featured">
                <div className="media-header">
                    <span className="media-tag">Article</span>
                    <h3>Entreprises Magazine</h3>
                    <p>Le groupe chinois MYC Beauty Innovation s'implante en Tunisie.</p>
                </div>
                <div className="article-card">
                    <img src="/MYCARTICL.jpg" alt="Article MYC Beauty Innovation" className="article-image" />
                    <div className="article-content">
                        <div className="article-logo">
                            <img src="/entreprises-logo.png" alt="Entreprises Magazine" />
                        </div>
                        <p>Decouvrez l'article complet sur le site officiel d'Entreprises Magazine.</p>
                        <a
                            className="article-link"
                            href="https://www.entreprises-magazine.com/le-groupe-chinois-myc-beauty-innovation-simplante-en-tunisie/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Lire l'article
                        </a>
                    </div>
                </div>
            </div>
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

        <div className="location-spotlight">
            <div className="location-card">
                <div className="location-header">
                    <span className="media-tag">Localisation</span>
                    <h3>MYC Beauty Innovation Tunisia</h3>
                    <p>Monastir, Tunisie</p>
                </div>
                <div className="map-embed">
                    <iframe
                        title="MYC Beauty Innovation Tunisia"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3524.5351647550667!2d10.747612!3d35.7273125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13020d001063bfb5%3A0x6b898891dc8ddc6!2sMYC%20Beauty%20innovation%20TUNISIA!5e0!3m2!1sfr!2stn!4v1710000000000!5m2!1sfr!2stn"
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>

        <div className="presentation-section">
            <div className="presentation-header">
                <span className="section-tag">Presentation</span>
                <h3>MYC Beauty Innovation</h3>
                <p>Groupe specialise dans la conception et la fabrication d emballages innovants pour l industrie cosmetique et parapharmaceutique.</p>
            </div>

            <div className="presentation-grid">
                <div className="presentation-card">
                    <h4>Implantation en Tunisie</h4>
                    <p>La filiale tunisienne MYC Tunisia a ete inauguree au Technopole de Monastir le 28 janvier 2026.</p>
                    <p>Investissement initial d environ 5 millions d euros, pouvant atteindre 11 millions d euros a long terme.</p>
                </div>

                <div className="presentation-card">
                    <h4>Activites principales</h4>
                    <ul>
                        <li>Fabrication d emballages cosmetiques</li>
                        <li>Assemblage industriel</li>
                        <li>Metallisation plastique</li>
                        <li>Conditionnement de produits cosmetiques et parapharmaceutiques</li>
                        <li>Solutions d emballage durables et innovantes</li>
                    </ul>
                </div>

                <div className="presentation-card">
                    <h4>Sites industriels</h4>
                    <p>Deux unites industrielles deja operationnelles, un troisieme batiment en cours de construction.</p>
                    <div className="surface-grid">
                        <div className="surface-pill">2 344 m2</div>
                        <div className="surface-pill">4 580 m2</div>
                        <div className="surface-pill">2 844 m2</div>
                    </div>
                </div>

                <div className="presentation-card">
                    <h4>Emplois et recrutement</h4>
                    <p>Environ 350 emplois directs prevus en Tunisie.</p>
                    <div className="pill-row">
                        <span>Maintenance industrielle</span>
                        <span>Qualite</span>
                        <span>Ressources humaines</span>
                        <span>Production</span>
                        <span>Achat et logistique</span>
                    </div>
                </div>

                <div className="presentation-card">
                    <h4>Technologies utilisees</h4>
                    <ul>
                        <li>Technologies modernes de production</li>
                        <li>Lignes de metallisation sous vide</li>
                        <li>Machines d assemblage avancees</li>
                        <li>Normes qualite ISO 9001, 14001, 45001</li>
                    </ul>
                </div>

                <div className="presentation-card highlight">
                    <h4>Importance pour la Tunisie</h4>
                    <ul>
                        <li>Renforce l investissement etranger</li>
                        <li>Developpe le secteur industriel a forte valeur ajoutee</li>
                        <li>Cree des opportunites d emploi</li>
                        <li>Ameliore les exportations industrielles tunisiennes</li>
                    </ul>
                </div>
            </div>

            <div className="facts-table">
                <div className="fact-row">
                    <span>Nom</span>
                    <strong>MYC Tunisia / MYC Beauty Innovation</strong>
                </div>
                <div className="fact-row">
                    <span>Secteur</span>
                    <strong>Emballage cosmetique</strong>
                </div>
                <div className="fact-row">
                    <span>Localisation</span>
                    <strong>Technopole de Monastir</strong>
                </div>
                <div className="fact-row">
                    <span>Origine</span>
                    <strong>Partenariat chinois et italien</strong>
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

        .media-spotlight {
            margin-top: 3rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 1rem;
            background: linear-gradient(135deg, rgba(196,30,58,0.06), rgba(26,26,26,0.02));
            border-radius: 28px;
            border: 1px solid #f0e6e8;
        }
        .media-card {
            background: white;
            border-radius: 24px;
            border: 1px solid #efe4e6;
            box-shadow: 0 16px 30px rgba(26,26,26,0.06);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .media-card:hover { transform: translateY(-4px); box-shadow: 0 22px 40px rgba(26,26,26,0.08); }
        .media-card-featured {
            border-color: #f3c9cf;
            background: linear-gradient(180deg, #ffffff 0%, #fff7f8 100%);
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 36px rgba(196, 30, 58, 0.1);
        }
        .media-card-featured::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(196,30,58,0.18) 0%, rgba(196,30,58,0) 70%);
            pointer-events: none;
        }
        .media-header { display: flex; flex-direction: column; gap: 0.35rem; }
        .media-header h3 { margin: 0; font-size: 1.25rem; }
        .media-header p { color: var(--text-muted); margin: 0; }
        .media-tag {
            display: inline-block;
            background: #fff5f5;
            color: var(--red);
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 999px;
            text-transform: uppercase;
            width: fit-content;
        }
        .media-embed {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            border-radius: 16px;
            overflow: hidden;
            background: #f8f9fa;
            border: 1px solid #f1e1e3;
        }
        .media-embed iframe,
        .media-embed video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .media-video { object-fit: cover; }

        .article-card {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        .article-image {
            width: 100%;
            border-radius: 16px;
            object-fit: cover;
            border: 1px solid #f0e4e6;
        }
        .article-content {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            background: #fff;
            border: 1px solid #f0e4e6;
            border-radius: 16px;
            padding: 1rem;
        }
        .article-logo img { height: 28px; object-fit: contain; }
        .article-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--text-main);
            color: white;
            text-decoration: none;
            padding: 0.7rem 1rem;
            border-radius: 12px;
            font-weight: 700;
            width: fit-content;
            box-shadow: 0 10px 18px rgba(26,26,26,0.12);
        }
        .article-link:hover { background: var(--red); }

        .location-spotlight {
            margin-top: 1.5rem;
        }
        .location-card {
            background: white;
            border-radius: 24px;
            border: 1px solid #efe4e6;
            box-shadow: 0 16px 30px rgba(26,26,26,0.06);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            position: relative;
            overflow: hidden;
        }
        .location-card::after {
            content: '';
            position: absolute;
            bottom: -50px;
            left: -30px;
            width: 160px;
            height: 160px;
            background: radial-gradient(circle, rgba(196,30,58,0.12) 0%, rgba(196,30,58,0) 70%);
            pointer-events: none;
        }
        .location-header h3 { margin: 0.4rem 0; font-size: 1.2rem; }
        .location-header p { color: var(--text-muted); margin: 0; }
        .map-embed {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            border-radius: 16px;
            overflow: hidden;
            background: #f8f9fa;
            border: 1px solid #f1e1e3;
        }
        .map-embed iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .presentation-section {
            margin-top: 3rem;
            background: white;
            border-radius: 28px;
            border: 1px solid #f0e4e6;
            box-shadow: 0 18px 40px rgba(26,26,26,0.08);
            padding: 2rem;
        }
        .presentation-header { margin-bottom: 1.5rem; }
        .presentation-header h3 { margin: 0.5rem 0; font-size: 1.6rem; }
        .presentation-header p { margin: 0; color: var(--text-muted); max-width: 800px; }
        .section-tag {
            display: inline-block;
            background: #1a1a1a;
            color: white;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 999px;
            text-transform: uppercase;
        }
        .presentation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        .presentation-card {
            background: #fff8f9;
            border: 1px solid #f2d9dd;
            border-radius: 20px;
            padding: 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        .presentation-card h4 { margin: 0; font-size: 1.05rem; }
        .presentation-card p { margin: 0; color: #5f6b75; }
        .presentation-card ul { margin: 0; padding-left: 18px; color: #5f6b75; display: grid; gap: 6px; }
        .presentation-card.highlight { background: #1a1a1a; color: white; border-color: #1a1a1a; }
        .presentation-card.highlight p,
        .presentation-card.highlight ul { color: #e5e5e5; }
        .surface-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .surface-pill {
            background: white;
            border: 1px solid #f1d7dc;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #8d2b35;
        }
        .pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill-row span {
            background: #ffffff;
            border: 1px solid #f1d7dc;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.78rem;
            font-weight: 700;
            color: #8d2b35;
        }
        .facts-table {
            margin-top: 2rem;
            border: 1px solid #f2d9dd;
            border-radius: 18px;
            overflow: hidden;
        }
        .fact-row {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            padding: 12px 16px;
            background: #fff;
            border-bottom: 1px solid #f2d9dd;
            font-size: 0.9rem;
        }
        .fact-row:last-child { border-bottom: none; }
        .fact-row span { color: #6b7280; font-weight: 600; }
        .fact-row strong { color: #1a1a1a; }

        @media (min-width: 900px) {
            .article-card { grid-template-columns: 1.1fr 0.9fr; align-items: stretch; }
            .article-image { height: 100%; min-height: 220px; }
        }

        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default HeroDashboard;
