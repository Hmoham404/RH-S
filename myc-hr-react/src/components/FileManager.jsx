import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { 
  Cloud, 
  CloudUpload, 
  Download, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Database,
  X
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './FileManager.css';

// --- Components ---

const buildTree = (files) => {
  const root = { name: 'Espace Cloud RH', children: {}, files: [] };
  files.forEach(file => {
    const parts = file.name.split('/');
    let current = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.children[part]) {
        current.children[part] = { name: part, children: {}, files: [] };
      }
      current = current.children[part];
    }
    current.files.push(file);
  });
  return root;
};

const TreeNode = ({ node, onFileClick, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasContent = Object.keys(node.children).length > 0 || node.files.length > 0;

  return (
    <div className="tree-node" style={{ marginLeft: depth > 0 ? '15px' : '0' }}>
      <div className={`node-row folder ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {hasContent ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{width: 14}} />}
        <Folder size={18} className="folder-icon" />
        <span>{node.name}</span>
      </div>
      
      {isOpen && (
        <div className="node-children">
          {Object.values(node.children).map((child, idx) => (
            <TreeNode key={idx} node={child} onFileClick={onFileClick} depth={depth + 1} />
          ))}
          {node.files.map((file, idx) => (
            <div key={idx} className="node-row file" onClick={() => onFileClick(file)}>
              <div style={{width: 14}} />
              {file.type.includes('xls') ? <FileSpreadsheet size={16} className="excel" /> : 
               file.type.includes('doc') ? <FileText size={16} className="word" /> :
               file.type.includes('pdf') ? <File size={16} className="pdf" /> :
               <File size={16} />}
              <span>{file.name.split('/').pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (!error) setFiles(data);
    setLoading(false);
  };

  const uploadFile = async (name, blob) => {
    // Sanitize the storage key (remove special characters/spaces/Unicode)
    const sanitizedName = name.replace(/[^\x00-\x7F]/g, "_").replace(/\s/g, "_");
    const storageKey = `${Date.now()}_${sanitizedName}`;
    
    // 1. Storage
    const { error: storageError } = await supabase.storage.from('rh_docs').upload(storageKey, blob);
    if (storageError) throw storageError;

    // 2. URL
    const { data: { publicUrl } } = supabase.storage.from('rh_docs').getPublicUrl(storageKey);

    // 3. Database (We keep the original name for display)
    const { data, error: dbError } = await supabase.from('documents').insert([{
      name: name,
      type: name.split('.').pop(),
      size: blob.size,
      url: publicUrl
    }]).select();

    if (dbError) throw dbError;
    return data[0];
  };

  const handleZipImport = async (blob, sourceName) => {
    setLoading(true);
    setStatus(`Extraction de ${sourceName}...`);
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(blob);
      const entries = Object.entries(content.files).filter(([_, e]) => !e.dir);
      
      const uploaded = [];
      for (const [path, entry] of entries) {
        setStatus(`Upload: ${path.split('/').pop()}...`);
        const fileBlob = await entry.async('blob');
        const saved = await uploadFile(path, fileBlob);
        if (saved) uploaded.push(saved);
      }
      
      setFiles(prev => [...uploaded, ...prev]);
      setStatus("Importation réussie !");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (accepted) => {
    for (const f of accepted) {
      if (f.name.endsWith('.zip')) {
        await handleZipImport(f, f.name);
      } else {
        setLoading(true);
        setStatus(`Upload: ${f.name}...`);
        try {
          const saved = await uploadFile(f.name, f);
          if (saved) setFiles(prev => [saved, ...prev]);
          setStatus("Fichier ajouté !");
          setTimeout(() => setStatus(null), 2000);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const deleteFile = async (file) => {
    if (!window.confirm(`Supprimer ${file.name} ?`)) return;
    const { error } = await supabase.from('documents').delete().eq('id', file.id);
    if (!error) {
      setFiles(files.filter(f => f.id !== file.id));
      setSelectedFile(null);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section active explorer-view">
      <div className="explorer-container">
        
        {/* Sidebar */}
        <div className="explorer-sidebar">
          <div className="sidebar-top">
            <div className="cloud-status">
              <Cloud size={20} color="var(--red)" />
              <span>Supabase Cloud Connecté</span>
            </div>
            
            <button className="btn-server-load" onClick={() => fetch('/RH 2.zip').then(r => r.blob()).then(b => handleZipImport(b, 'RH 2.zip'))} disabled={loading}>
              {loading ? <Loader2 className="spinner" size={18} /> : <Database size={18} />}
              Importer RH 2 (Serveur)
            </button>

            <div {...getRootProps()} className={`explorer-dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <CloudUpload size={28} />
              <p>Importer de votre PC</p>
              <span>Glissez ou cliquez ici</span>
            </div>
          </div>

          <div className="explorer-search">
            <Search size={16} />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="explorer-tree">
            {loading && files.length === 0 ? (
               <div className="loading-tree"><Loader2 className="spinner" /> Chargement...</div>
            ) : (
               <TreeNode node={buildTree(filteredFiles)} onFileClick={setSelectedFile} />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="explorer-main">
          {selectedFile ? (
            <div className="file-preview-panel animate-fade-in">
              <div className="preview-top">
                 <button className="back-btn" onClick={() => setSelectedFile(null)}><X size={20} /></button>
                 <div className="preview-icon-box">
                    {selectedFile.type.includes('xls') ? <FileSpreadsheet size={64} className="excel" /> : 
                     selectedFile.type.includes('doc') ? <FileText size={64} className="word" /> :
                     <File size={64} color="var(--red)" />}
                 </div>
                 <h2>{selectedFile.name.split('/').pop()}</h2>
                 <p className="path-text">{selectedFile.name}</p>
              </div>

              <div className="preview-info">
                 <div className="info-card">
                    <label>Taille</label>
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                 </div>
                 <div className="info-card">
                    <label>Type</label>
                    <span>{selectedFile.type.toUpperCase()}</span>
                 </div>
                 <div className="info-card">
                    <label>Date</label>
                    <span>{new Date(selectedFile.created_at).toLocaleDateString()}</span>
                 </div>
              </div>

              <div className="preview-actions-modern">
                <a href={selectedFile.url} target="_blank" rel="noreferrer" className="btn-action-primary">
                  <Download size={20} /> Télécharger / Ouvrir
                </a>
                <button className="btn-action-danger" onClick={() => deleteFile(selectedFile)}>
                  <Trash2 size={20} /> Supprimer de la base
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              <Cloud size={80} opacity={0.05} />
              <h3>Sélectionnez un fichier pour voir les détails</h3>
              <p>Tous vos documents sont synchronisés en temps réel avec Supabase.</p>
              {status && <div className="floating-status"><Loader2 className="spinner" size={16} /> {status}</div>}
              {error && <div className="floating-error"><AlertCircle size={16} /> {error}</div>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FileManager;
