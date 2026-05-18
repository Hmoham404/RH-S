import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Grid, 
  Filter, 
  ArrowRight,
  FolderOpen,
  Calendar,
  Layers,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import JSZip from 'jszip';

const DocLibrary = ({ setActiveTab }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    
    // 1. Essayer Supabase
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      setDocs(data);
      setLoading(false);
    } else {
      // 2. Essayer LocalStorage
      const local = localStorage.getItem('rh_imported_files');
      if (local && JSON.parse(local).length > 0) {
        setDocs(JSON.parse(local));
        setLoading(false);
      } else {
        // 3. AUTOMATIQUE : Importer le ZIP public par défaut
        await importPublicZip();
      }
    }
  };

  const importPublicZip = async () => {
    setLoading(true);
    try {
      const response = await fetch('/RH 2.zip');
      const blob = await response.blob();
      const zip = new JSZip();
      const content = await zip.loadAsync(blob);
      const entries = Object.entries(content.files).filter(([_, e]) => !e.dir);
      
      const extracted = [];
      for (const [path, entry] of entries) {
        const fileBlob = await entry.async('blob');
        extracted.push({
          id: 'local_' + Math.random(),
          name: path,
          type: path.split('.').pop(),
          size: fileBlob.size,
          url: URL.createObjectURL(fileBlob), // URL temporaire pour la session
          created_at: new Date().toISOString()
        });
      }
      
      setDocs(extracted);
      localStorage.setItem('rh_imported_files', JSON.stringify(extracted));
    } catch (err) {
      console.error("Erreur import public ZIP:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('xls')) return <FileSpreadsheet className="lib-icon-excel" />;
    if (t.includes('doc')) return <FileText className="lib-icon-word" />;
    if (t.includes('pdf')) return <File className="lib-icon-pdf" />;
    return <File />;
  };

  const filteredDocs = docs.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || doc.type.toLowerCase().includes(typeFilter);
    return matchSearch && matchType;
  });

  return (
    <div className="section active library-view">
      
      <div className="library-header animate-fade-in">
        <div className="header-info">
          <h1>Bibliothèque de Documents RH</h1>
          <p>Consultez, visualisez et téléchargez tous les documents de l'usine.</p>
        </div>
        <div className="library-stats">
          <div className="stat-pill">
            <FolderOpen size={16} /> {docs.length} Fichiers
          </div>
          <button className="refresh-btn" onClick={loadFiles}>
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="library-controls animate-fade-in">
          <div className="search-bar-modern">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group-modern">
            <Filter size={18} />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">Tous les formats</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
              <option value="xls">Excel</option>
            </select>
          </div>
        </div>
      )}

      <div className="library-grid animate-fade-in">
        {loading ? (
          <div className="library-loading">
            <Loader2 className="spinner" size={40} />
            <p>Préparation des fichiers...</p>
          </div>
        ) : docs.length > 0 ? (
          filteredDocs.map(doc => (
            <div className="doc-card-modern" key={doc.id}>
              <div className="card-top">
                <div className="icon-badge">
                  {getFileIcon(doc.type)}
                </div>
                <div className="type-tag">{doc.type.toUpperCase()}</div>
              </div>
              
              <div className="card-body">
                <h3>{doc.name.split('/').pop()}</h3>
                <div className="meta-info">
                  <span><Calendar size={12} /> {new Date(doc.created_at).toLocaleDateString()}</span>
                  <span><Layers size={12} /> {(doc.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <div className="card-footer">
                <a href={doc.url} target="_blank" rel="noreferrer" className="btn-view-modern">
                  <Eye size={16} /> Voir / Ouvrir
                </a>
                <a href={doc.url} download={doc.name} className="btn-download-modern">
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="library-empty">
            <FolderOpen size={60} opacity={0.1} />
            <h3>Aucun fichier n'est chargé</h3>
            <p>Voulez-vous importer automatiquement les documents depuis <strong>RH 2.zip</strong> ?</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={importPublicZip} className="btn-goto-archive">
                    Oui, Importer RH 2.zip <ArrowRight size={18} />
                </button>
                <button onClick={() => setActiveTab('archive')} className="btn-view-modern" style={{ border: '1px solid #ccc' }}>
                    Aller à l'Archive RH
                </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .library-view { max-width: 1200px; margin: 0 auto; padding-bottom: 5rem; }
        .library-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .header-info h1 { font-size: 2.2rem; color: var(--text-main); margin-bottom: 0.5rem; }
        .header-info p { color: var(--text-muted); font-size: 1.1rem; }
        .library-stats { display: flex; gap: 15px; align-items: center; }
        .stat-pill { background: var(--bg-light); padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
        .refresh-btn { background: var(--bg-light); color: var(--text-main); border: 1px solid #ddd; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .library-controls { display: flex; gap: 20px; margin-bottom: 3rem; }
        .search-bar-modern { flex: 1; display: flex; align-items: center; gap: 12px; background: white; padding: 0 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); }
        .search-bar-modern input { border: none; padding: 1.2rem 0; width: 100%; outline: none; font-size: 1rem; }
        .filter-group-modern { display: flex; align-items: center; gap: 10px; background: white; padding: 0 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); }
        .filter-group-modern select { border: none; padding: 1.2rem 0; outline: none; font-weight: 600; cursor: pointer; }

        .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        
        .doc-card-modern { background: white; border-radius: 20px; border: 1px solid var(--border-color); overflow: hidden; transition: 0.3s; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; }
        .doc-card-modern:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: var(--red); }
        
        .card-top { padding: 1.5rem; background: #fafafa; display: flex; justify-content: space-between; align-items: flex-start; }
        .icon-badge { background: white; padding: 12px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); font-size: 24px; }
        .type-tag { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); background: #eee; padding: 4px 10px; border-radius: 20px; }
        
        .card-body { padding: 1.5rem; flex: 1; }
        .card-body h3 { font-size: 1rem; color: var(--text-main); line-height: 1.4; margin-bottom: 1rem; height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .meta-info { display: flex; gap: 15px; color: var(--text-muted); font-size: 0.75rem; font-weight: 600; }
        .meta-info span { display: flex; align-items: center; gap: 5px; }

        .card-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--bg-light); display: flex; gap: 10px; }
        .btn-view-modern { flex: 1; text-decoration: none; background: var(--bg-light); color: var(--text-main); padding: 10px; border-radius: 10px; text-align: center; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .btn-view-modern:hover { background: var(--text-main); color: white; }
        .btn-download-modern { background: var(--red); color: white; padding: 10px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }

        .lib-icon-excel { color: #217346; }
        .lib-icon-word { color: #2b579a; }
        .lib-icon-pdf { color: #f40612; }

        .library-loading, .library-empty { grid-column: 1 / -1; padding: 8rem 0; text-align: center; }
        .library-empty h3 { color: var(--text-main); margin-bottom: 1rem; }
        .library-empty p { margin-bottom: 2rem; color: var(--text-muted); }
        .btn-goto-archive { background: var(--red); color: white; border: none; padding: 1rem 2rem; border-radius: 16px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; transition: 0.2s; }
      `}</style>
    </div>
  );
};

export default DocLibrary;
