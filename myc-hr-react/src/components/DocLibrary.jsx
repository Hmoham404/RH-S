import React, { useState } from 'react';
import { FolderOpen, Search, Eye, Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { documents } from '../data';

const DocLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catFilter === 'all' || doc.cat === catFilter;
    const matchType = typeFilter === 'all' || doc.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const getIcon = (type) => {
    if (type === 'pdf') return <File className="icon-pdf" size={32} />;
    if (type === 'word') return <FileText className="icon-word" size={32} />;
    if (type === 'excel') return <FileSpreadsheet className="icon-excel" size={32} />;
    return <File size={32} />;
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      formation: 'Formation',
      procedures: 'Procédures RH',
      sa8000: 'SA8000 / RSE',
      admin: 'Administration'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="section active">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FolderOpen color="var(--gold)" /> Bibliothèque des Documents RH
      </h2>

      <div className="doc-filters">
        <div className="doc-search">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un document, une référence..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="doc-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Toutes les catégories</option>
          <option value="formation">Formation</option>
          <option value="procedures">Procédures RH</option>
          <option value="sa8000">SA8000 / RSE</option>
          <option value="admin">Administration</option>
        </select>
        <select className="doc-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Tous les formats</option>
          <option value="pdf">PDF</option>
          <option value="word">Word</option>
          <option value="excel">Excel</option>
        </select>
      </div>

      <div className="doc-grid">
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <div className="doc-card" key={doc.id}>
              <div className="doc-header">
                {getIcon(doc.type)}
                <span className="doc-ref">{doc.ref}</span>
              </div>
              <h3 className="doc-title">{doc.title}</h3>
              <div>
                <span className="doc-category">{getCategoryLabel(doc.cat)}</span>
              </div>
              <div className="doc-actions">
                <button className="btn btn-view"><Eye size={16} /> Voir</button>
                <button className="btn btn-download"><Download size={16} /> Télécharger</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Aucun document ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocLibrary;
