import React, { useState } from 'react';
import { Network, X, Mail } from 'lucide-react';
import { profiles } from '../data';
import * as Icons from 'lucide-react';

const ProfileModal = ({ profileId, onClose }) => {
  if (!profileId) return null;
  const data = profiles[profileId];
  if (!data) return null;

  const IconComponent = Icons[data.icon] || Icons.User;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <div className="modal-avatar">
            <IconComponent size={40} />
          </div>
          <div className="modal-info">
            <h2>{data.name}</h2>
            <p>{data.title}</p>
            <span className={`status-badge ${data.statusClass}`}>{data.status}</span>
          </div>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <div className="detail-label">Département</div>
            <div className="detail-value">{data.dept}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Responsabilités</div>
            <div className="detail-value">{data.resp}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Équipe rattachée</div>
            <div className="detail-value">{data.team}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Contact</div>
            <div className="detail-value">
              <Mail size={16} color="var(--red)" /> contact@myc-beauty.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrgCard = ({ id, onClick, isCeo }) => {
  const data = profiles[id];
  const IconComponent = Icons[data.icon] || Icons.User;

  return (
    <div className={`org-card ${isCeo ? 'ceo' : ''}`} onClick={() => onClick(id)}>
      <div className="org-avatar">
        <IconComponent size={32} />
      </div>
      <div className="org-name">{data.name}</div>
      <div className="org-title">{data.title}</div>
      <div className={`status-badge ${data.statusClass}`}>{data.status}</div>
    </div>
  );
};

const OrgChart = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <div className="section active">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Network color="var(--gold)" /> Structure Organisationnelle
      </h2>

      <div className="org-chart">
        <div className="org-level">
          <OrgCard id="sami" onClick={setSelectedProfile} isCeo={true} />
        </div>

        <div className="org-level org-departments">
          {['supply', 'prod', 'tech', 'qualite', 'finance', 'rh', 'admin', 'sales'].map(id => (
            <OrgCard key={id} id={id} onClick={setSelectedProfile} />
          ))}
        </div>
      </div>

      <ProfileModal profileId={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </div>
  );
};

export default OrgChart;
