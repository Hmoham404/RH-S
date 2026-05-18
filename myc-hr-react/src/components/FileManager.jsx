import React, { useState, useEffect, useRef } from 'react';
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
  const root = { name: 'Espace Cloud RH', path: '', children: {}, files: [] };
  files.forEach(file => {
    const parts = file.name.split('/');
    let current = root;
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!current.children[part]) {
        current.children[part] = { name: part, path: currentPath, children: {}, files: [] };
      }
      current = current.children[part];
    }
    current.files.push(file);
  });
  return root;
};

const TreeNode = ({ node, onFileClick, onFolderClick, selectedPath, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasContent = Object.keys(node.children).length > 0 || node.files.length > 0;
  const isSelected = selectedPath === node.path;

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleFolderClick = () => {
    onFolderClick(node);
    if (!isOpen && hasContent) setIsOpen(true);
  };

  return (
    <div className="tree-node" style={{ marginLeft: depth > 0 ? '15px' : '0' }}>
      <div className={`node-row folder ${isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`} onClick={handleFolderClick}>
        <div className="node-toggle" onClick={toggleOpen}>
          {hasContent ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{ width: 14 }} />}
        </div>
        <Folder size={18} className="folder-icon" />
        <span>{node.name}</span>
      </div>
      
      {isOpen && (
        <div className="node-children">
          {Object.values(node.children).map((child, idx) => (
            <TreeNode
              key={idx}
              node={child}
              onFileClick={onFileClick}
              onFolderClick={onFolderClick}
              selectedPath={selectedPath}
              depth={depth + 1}
            />
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
  const [selectedFolder, setSelectedFolder] = useState({ name: 'Espace Cloud RH', path: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const folderInputRef = useRef(null);

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
        const filePath = f.path ? f.path.replace(/^\//, '') : f.name;
        setStatus(`Upload: ${filePath}...`);
        try {
          const saved = await uploadFile(filePath, f);
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

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const f of files) {
      if (f.name.endsWith('.zip')) {
        await handleZipImport(f, f.name);
      } else {
        setLoading(true);
        const filePath = f.webkitRelativePath || f.name;
        setStatus(`Upload: ${filePath}...`);
        try {
          const saved = await uploadFile(filePath, f);
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
    // Reset the input value so the same folder can be selected again if needed
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
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
  const treeRoot = buildTree(filteredFiles);

  const normalizeText = (value) => {
    if (!value) return '';
    return value
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s./_-]/g, '');
  };

  const getGeneralExplanation = () => (
    'Base documentaire RH 2 : procedures, formulaires, reglements internes et documents SA8000. ' +
    'Cette vue synthese permet d identifier rapidement le role de chaque dossier et de chaque fichier.'
  );

  const getFolderExplanation = (name) => {
    if (!name) return '';
    const normalized = normalizeText(name);

    if (normalized === 'formulaire' || normalized.includes('formulaire')) {
      return 'Formulaires et enregistrements RH a completer : demandes, registres, feuilles de suivi.';
    }
    if (normalized === 'procedure' || normalized.includes('procedure')) {
      return 'Procedures operationnelles et modes operatoires RH pour standardiser les processus.';
    }
    if (normalized === 'mp') {
      return 'Manuels et reglements internes : politiques de gestion et regles de fonctionnement.';
    }
    if (normalized.includes('sa8000')) {
      return 'Documents de conformite SA8000 : responsabilite sociale, droits des travailleurs, audits.';
    }
    if (normalized.includes('second ordre')) {
      return 'Sous-dossiers secondaires a traduire ou a harmoniser avant diffusion.';
    }
    if (name.includes('\u4e09\u9636\u6587\u4ef6')) {
      return 'Documents de niveau 3 mis a jour, incluant des volets EHS et SA8000.';
    }
    if (name.includes('\u8868\u5355')) {
      return 'Formulaires et registres associes aux exigences SA8000 et EHS.';
    }
    if (normalized.includes('ehs')) {
      return 'Dossiers EHS : securite, sante et environnement.';
    }

    return 'Dossier de classement RH pour cette rubrique.';
  };

  const getFileExplanation = (fileName) => {
    if (!fileName) return '';
    const normalized = normalizeText(fileName);
    const baseName = normalized.split('/').pop() || '';
    const isForm = baseName.includes('fm-') || baseName.includes('formulaire');
    const isProcedure = baseName.includes('op-') || baseName.includes('procedure');
    const isPolicy = baseName.includes('mp-') || baseName.includes('reglement');

    const rules = [
      { test: (n) => n.includes('demande') && n.includes('formation'), text: 'Demande de formation et validation des besoins.' },
      { test: (n) => n.includes('rapport') && n.includes('formation'), text: 'Compte rendu et evaluation des actions de formation.' },
      { test: (n) => n.includes('registre') && n.includes('formation'), text: 'Registre de formation et traçabilite des sessions.' },
      { test: (n) => n.includes('evaluation') && (n.includes('formation') || n.includes('efficacite')), text: 'Evaluation de l efficacite et des resultats.' },
      { test: (n) => n.includes('test') && n.includes('integration'), text: 'Test d integration du personnel et verification des acquis.' },
      { test: (n) => n.includes('fiche') && n.includes('poste'), text: 'Fiche de poste et responsabilites associees.' },
      { test: (n) => n.includes('recrut') || n.includes('embauche'), text: 'Documents de recrutement et integration.' },
      { test: (n) => n.includes('entretien'), text: 'Fiche ou compte rendu d entretien RH.' },
      { test: (n) => n.includes('registre') && n.includes('nettoyage'), text: 'Registre de nettoyage et hygiene des equipements.' },
      { test: (n) => n.includes('distribution') && n.includes('vetement'), text: 'Registre de distribution des vetements et EPI.' },
      { test: (n) => n.includes('communication'), text: 'Procedure de communication interne et circulation d information.' },
      { test: (n) => n.includes('controle') || n.includes('audit'), text: 'Controle et verification de conformite.' },
      { test: (n) => n.includes('reglement'), text: 'Reglement interne ou directive de gestion.' },
      { test: (n) => n.includes('sa8000') || n.includes('op-sa'), text: 'Procedure de conformite SA8000 et responsabilite sociale.' },
    ];

    for (const rule of rules) {
      if (rule.test(baseName)) return rule.text;
    }

    if (isForm) return 'Formulaire RH a completer pour ce processus.';
    if (isProcedure) return 'Procedure de reference pour ce processus RH.';
    if (isPolicy) return 'Reglement ou manuel de gestion pour ce processus.';

    return 'Document RH de reference; se fier au titre pour les details.';
  };

  const getFilesForSelectedFolder = () => {
    const path = selectedFolder?.path || '';
    const prefix = path ? `${path}/` : '';
    return filteredFiles
      .filter(file => file.name.startsWith(prefix))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const folderFiles = getFilesForSelectedFolder();

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
              <p>Importer fichier / ZIP de votre PC</p>
              <span>Glissez ou cliquez ici</span>
            </div>

            <button 
              className="btn-server-load" 
              onClick={() => folderInputRef.current.click()} 
              disabled={loading} 
              style={{marginTop: '10px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)'}}
            >
              <Folder size={18} />
              Sélectionner un Dossier PC
            </button>
            <input 
              type="file" 
              webkitdirectory="true" 
              directory="true" 
              ref={folderInputRef}
              style={{display: 'none'}} 
              onChange={handleFolderSelect} 
            />
          </div>

          <div className="explorer-search">
            <Search size={16} />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="explorer-tree">
            {loading && files.length === 0 ? (
               <div className="loading-tree"><Loader2 className="spinner" /> Chargement...</div>
            ) : (
                 <TreeNode
                   node={treeRoot}
                   onFileClick={setSelectedFile}
                   onFolderClick={setSelectedFolder}
                   selectedPath={selectedFolder?.path}
                 />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="explorer-main">
            <div className="explorer-main-content">
              <div className="explorer-preview">
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

              <div className="explorer-guide">
                <div className="guide-card">
                  <div className="guide-title">Vue generale RH 2</div>
                  <p>{getGeneralExplanation()}</p>
                </div>

                <div className="guide-card">
                  <div className="guide-title">Dossier selectionne</div>
                  <div className="guide-chip">{selectedFolder?.name || 'Espace Cloud RH'}</div>
                  <p>{getFolderExplanation(selectedFolder?.name)}</p>
                </div>

                <div className="guide-card guide-files">
                  <div className="guide-title">Fichiers du dossier</div>
                  {folderFiles.length > 0 ? (
                    <div className="guide-file-list">
                      {folderFiles.map((file) => {
                        const fileName = file.name.split('/').pop();
                        return (
                          <div key={file.id} className="guide-file-item">
                            <div className="guide-file-name">{fileName}</div>
                            <div className="guide-file-desc">{getFileExplanation(fileName)}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="guide-empty">Aucun fichier dans ce dossier.</p>
                  )}
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FileManager;
