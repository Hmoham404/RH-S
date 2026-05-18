import React from 'react';
import { Users, User, ShieldCheck, Mail, Phone, ChevronRight, LayoutGrid, Crown } from 'lucide-react';
import { departmentsData } from '../data';

const OrgChart = () => {
  return (
    <div className="section active animate-fade-in">
      <div className="chart-header-premium">
        <div className="header-glass-box">
            <div className="header-icon-premium">
                <Crown size={32} color="var(--gold)" />
            </div>
            <div className="header-text-premium">
                <h1>Leadership & Structure</h1>
                <p>Mise à jour stratégique — Avril 2026</p>
            </div>
        </div>
      </div>

      <div className="org-tree-container">
        {departmentsData.map((dept, idx) => {
          const isDG = dept.name.includes('Direction Générale');
          return (
            <div key={idx} className={`org-dept-block ${isDG ? 'is-dg' : ''}`}>
              <div className="dept-main-card">
                 <div className="dept-tag">{isDG ? 'Top Management' : 'Département'}</div>
                 <h2>{dept.name}</h2>
                 <div className="dept-head">
                    <div className="avatar-box">
                      {dept.managerPhoto ? (
                        <img src={dept.managerPhoto} alt={dept.manager} className="avatar-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      ) : null}
                      <div className="avatar-placeholder" style={{ display: dept.managerPhoto ? 'none' : 'flex' }}>
                          {dept.manager.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="head-info">
                       <strong>{dept.manager}</strong>
                       <span>{dept.managerTitle || 'Responsable'}</span>
                    </div>
                 </div>
              </div>

              <div className="org-connector">
                <div className="connector-line"></div>
              </div>

              <div className="employees-grid">
                {dept.employees.map((emp, eIdx) => (
                  <div key={eIdx} className={`emp-card-premium ${emp.name.toLowerCase().includes('poste') ? 'is-role' : ''}`}>
                    <div className="emp-top">
                      <div className="emp-avatar-mini"><User size={16} /></div>
                      <div className="emp-role">{emp.role}</div>
                    </div>
                    <div className="emp-name">{emp.name}</div>
                    <div className="emp-footer">
                       <div className={emp.name.toLowerCase().includes('poste') ? 'status-dot-pending' : 'status-dot-active'}></div>
                       <span>{emp.name.toLowerCase().includes('poste') ? 'En cours / Effectif' : 'Opérationnel'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .chart-header-premium { margin-bottom: 5rem; }
        .header-glass-box { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); padding: 2rem; border-radius: 30px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 25px; width: fit-content; }
        .header-icon-premium { background: var(--text-main); padding: 15px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .header-text-premium h1 { font-size: 2.5rem; margin-bottom: 2px; letter-spacing: -2px; color: var(--text-main); }
        .header-text-premium p { color: var(--red); font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; }

        .org-tree-container { display: flex; flex-direction: column; gap: 6rem; position: relative; padding-bottom: 10rem; }
        .org-dept-block { display: flex; flex-direction: column; align-items: center; width: 100%; }
        
        /* DG Style Specifics */
        .is-dg .dept-main-card { transform: scale(1.1); border-width: 2px; border-color: var(--gold); background: linear-gradient(145deg, #ffffff 0%, #fffdf0 100%); }
        .is-dg .dept-tag { background: var(--gold); }
        .is-dg .avatar-img { width: 60px; height: 60px; border-radius: 15px; object-fit: cover; border: 2px solid var(--gold); }

        .dept-main-card { background: white; width: 100%; max-width: 500px; padding: 2.5rem; border-radius: 35px; border: 1px solid var(--border-color); box-shadow: 0 20px 50px rgba(0,0,0,0.06); text-align: center; position: relative; transition: 0.4s; z-index: 2; }
        .dept-main-card:hover { border-color: var(--red); transform: translateY(-8px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
        .dept-tag { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--red); color: white; padding: 6px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
        .dept-main-card h2 { font-size: 1.6rem; margin-bottom: 2rem; color: var(--text-main); letter-spacing: -0.5px; }
        
        .dept-head { display: flex; align-items: center; justify-content: center; gap: 20px; background: rgba(0,0,0,0.02); padding: 15px; border-radius: 25px; border: 1px solid rgba(0,0,0,0.05); }
        .avatar-placeholder { width: 55px; height: 55px; background: var(--text-main); color: white; display: flex; align-items: center; justify-content: center; border-radius: 18px; font-weight: 800; font-size: 1.2rem; }
        .head-info { text-align: left; }
        .head-info strong { display: block; font-size: 1.1rem; color: var(--text-main); }
        .head-info span { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

        .org-connector { display: flex; flex-direction: column; align-items: center; }
        .connector-line { width: 2px; height: 4rem; background: linear-gradient(to bottom, var(--gold), var(--red)); }

        .employees-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; width: 100%; margin-top: 1rem; }
        
        .emp-card-premium { background: white; padding: 1.5rem; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); transition: 0.3s; position: relative; overflow: hidden; }
        .emp-card-premium:hover { border-color: var(--red); transform: scale(1.03); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
        .emp-card-premium.is-role { background: #fafafa; border-style: dashed; }
        
        .emp-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
        .emp-avatar-mini { background: #f8f9fa; padding: 10px; border-radius: 12px; color: var(--text-muted); }
        .emp-role { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--red); background: #fff5f5; padding: 5px 12px; border-radius: 30px; }
        .emp-name { font-weight: 700; font-size: 1.05rem; color: var(--text-main); margin-bottom: 1rem; }
        
        .emp-footer { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }
        .status-dot-active { width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; box-shadow: 0 0 10px rgba(46,204,113,0.4); }
        .status-dot-pending { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; }

        @media (max-width: 768px) {
            .header-glass-box { width: 100%; }
            .is-dg .dept-main-card { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OrgChart;
