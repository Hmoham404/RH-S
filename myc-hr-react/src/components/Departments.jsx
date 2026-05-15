import React from 'react';
import { Layers, Users, Circle } from 'lucide-react';
import { departmentsData } from '../data';
import * as Icons from 'lucide-react';

const Departments = () => {
  return (
    <div className="section active">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Layers color="var(--gold)" /> Structure des Départements
      </h2>

      <div className="dept-grid">
        {departmentsData.map(dept => {
          const IconComponent = Icons[dept.icon] || Icons.Folder;
          
          return (
            <div className="dept-card" key={dept.id}>
              <div className="dept-header">
                <div className="dept-title">
                  <IconComponent className="dept-icon" size={24} /> {dept.title}
                </div>
              </div>
              <div className="dept-stats">
                <span className="dept-stat">
                  <Users size={16} /> {dept.count} Coll.
                </span>
                <span className="dept-stat" style={{ color: dept.statusColor }}>
                  <Circle size={12} fill="currentColor" /> {dept.status}
                </span>
              </div>
              <ul className="dept-list">
                {dept.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
