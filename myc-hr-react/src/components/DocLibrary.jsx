import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Layers,
  Loader2,
  RefreshCw,
  Info,
  BookOpen
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import JSZip from 'jszip';

// --- Helper pour générer des explications spécifiques ---
const normalizeText = (value) => {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const hasNonAscii = (value) => /[^\x00-\x7F]/.test(value || '');

const getGeneralExplanation = () => (
  'Dossier RH 2 : procedures, formulaires, reglements internes et documents SA8000. ' +
  'Cette vue fournit une explication specifique de chaque dossier et fichier.'
);

const getFolderExplanation = (name, path) => {
  if (!name) return '';
  const normalized = normalizeText(name);
  const normalizedPath = normalizeText(path || '');

  if (normalized === 'tous les documents' || normalizedPath === '') {
    return 'Point d entree principal du dossier RH 2, avec toutes les categories documentaires.';
  }
  if (normalized.includes('formulaire')) {
    return 'Formulaires et registres RH a completer : demandes, suivi et preuves de conformite.';
  }
  if (normalized.includes('procedure') || normalized.includes('proced')) {
    return 'Procedures et modes operatoires RH pour standardiser les pratiques de gestion.';
  }
  if (normalized === 'mp') {
    return 'Manuels et reglements internes definissant les regles de fonctionnement.';
  }
  if (normalized.includes('sa8000')) {
    return 'Documentation SA8000 : droits des travailleurs, responsabilite sociale et audits.';
  }
  if (normalized.includes('second ordre')) {
    return 'Sous-dossiers secondaires a traduire ou harmoniser avant diffusion.';
  }
  if (name.includes('\u4e09\u9636\u6587\u4ef6')) {
    return 'Documents de niveau 3, avec mises a jour EHS et SA8000.';
  }
  if (name.includes('\u8868\u5355')) {
    return 'Formulaires et registres associes aux exigences SA8000 et EHS.';
  }
  if (normalized.includes('ehs')) {
    return 'Dossiers EHS : securite, sante et environnement.';
  }

  return `Dossier RH pour ${name}.`;
};

const extractFileDescription = (fileName) => {
  if (!fileName) return '';
  const base = fileName.split('/').pop() || '';
  const withoutExt = base.replace(/\.[^/.]+$/, '').trim();
  const parts = withoutExt.split(/\sA\d+\s*/i);

  if (parts.length > 1) {
    const desc = parts.slice(1).join(' ').trim();
    return desc || '';
  }

  const match = withoutExt.match(/^[A-Z0-9-]+\s+(.+)$/i);
  return match ? match[1].trim() : '';
};

const getFileKind = (fileName) => {
  const normalized = normalizeText(fileName);
  const upper = (fileName || '').toUpperCase();

  if (upper.includes('-FM-') || normalized.includes('formulaire')) return 'Formulaire';
  if (upper.includes('-OP-') || normalized.includes('procedure')) return 'Procedure';
  if (upper.includes('-MP-') || normalized.includes('reglement')) return 'Reglement';
  if (normalized.includes('registre')) return 'Registre';
  if (normalized.includes('rapport')) return 'Rapport';
  if (normalized.includes('fiche')) return 'Fiche';
  if (normalized.includes('liste')) return 'Liste';
  if (normalized.includes('plan')) return 'Plan';
  if (normalized.includes('proces verbal') || normalized.includes('proces-verbal')) return 'Proces verbal';
  if (normalized.includes('lettre')) return 'Lettre';
  return 'Document';
};

const getFileExplanation = (fileName) => {
  if (!fileName) return '';
  const kind = getFileKind(fileName);
  const desc = extractFileDescription(fileName);

  if (desc && !hasNonAscii(desc)) {
    return `${kind} : ${desc}.`;
  }
  return `${kind} RH de reference. Consultez le titre pour plus de details.`;
};


// --- Helper pour l'arbre ---
const buildTree = (files) => {
  const root = { name: 'Tous les Documents', path: '', children: {}, files: [] };
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

const LibraryTreeNode = ({ node, onFolderClick, selectedPath, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasSubFolders = Object.keys(node.children).length > 0;
  
  const isSelected = selectedPath === node.path;

  const handleClick = (e) => {
    e.stopPropagation();
    onFolderClick(node);
    if (!isOpen && hasSubFolders) setIsOpen(true);
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="lib-tree-node" style={{ marginLeft: depth > 0 ? '15px' : '0' }}>
      <div className={`lib-node-row ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
        <div className="lib-node-toggle" onClick={toggleOpen}>
          {hasSubFolders ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{width: 14}} />}
        </div>
        <Folder size={16} className="lib-folder-icon" />
        <span className="lib-node-name">{node.name}</span>
      </div>
      
      {isOpen && hasSubFolders && (
        <div className="lib-node-children">
          {Object.values(node.children).map((child, idx) => (
            <LibraryTreeNode 
              key={idx} 
              node={child} 
              onFolderClick={onFolderClick} 
              selectedPath={selectedPath} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocLibrary = ({ setActiveTab }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    
    // 1. Essayer Supabase
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      setDocs(data);
      const tree = buildTree(data);
      setTreeData(tree);
      setSelectedFolder(tree);
      setLoading(false);
    } else {
      // 2. Essayer LocalStorage
      const local = localStorage.getItem('rh_imported_files');
      if (local && JSON.parse(local).length > 0) {
        const parsed = JSON.parse(local);
        setDocs(parsed);
        const tree = buildTree(parsed);
        setTreeData(tree);
        setSelectedFolder(tree);
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
      const tree = buildTree(extracted);
      setTreeData(tree);
      setSelectedFolder(tree);
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

  const getFilesInCurrentFolder = () => {
    if (!selectedFolder) return [];
    let files = [];
    
    // Si on a une recherche, on cherche partout dans l'arbre sélectionné
    if (searchTerm) {
      const searchInTree = (node) => {
        node.files.forEach(f => {
          if (f.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            files.push(f);
          }
        });
        Object.values(node.children).forEach(child => searchInTree(child));
      };
      searchInTree(selectedFolder);
    } else {
      // Sinon, on affiche juste les fichiers du dossier courant
      files = selectedFolder.files;
    }
    return files;
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setSelectedFile(null); // Reset selected file when changing folder
  };

  const displayedFiles = getFilesInCurrentFolder();

  return (
    <div className="section active library-view">
      <div className="library-header animate-fade-in">
        <div className="header-info">
          <h1>Bibliothèque de Documents RH</h1>
          <p>Consultez, visualisez et téléchargez les documents de l'usine organisés par dossiers.</p>
        </div>
        <div className="library-stats">
          <div className="stat-pill">
            <FolderOpen size={16} /> {docs.length} Fichiers au total
          </div>
          <button className="refresh-btn" onClick={loadFiles}>
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>
      </div>

      <div className="library-layout animate-fade-in">
        {/* Sidebar : Arbre des dossiers */}
        <div className="library-sidebar">
          <div className="sidebar-search">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="library-tree-container">
            {loading ? (
              <div className="library-loading"><Loader2 className="spinner" size={24} /></div>
            ) : treeData ? (
              <LibraryTreeNode 
                node={treeData} 
                onFolderClick={handleFolderClick} 
                selectedPath={selectedFolder?.path} 
              />
            ) : (
              <p className="no-data-tree">Aucun dossier.</p>
            )}
          </div>
        </div>

        {/* Main Content : Tableau des fichiers */}
        <div className="library-main">
          <div className="folder-title">
            <FolderOpen size={24} color="var(--doc-teal)" />
            <h2>{selectedFolder ? selectedFolder.name : "Sélectionnez un dossier"}</h2>
          </div>

          <div className="explain-top">
            <div className="explain-card explain-hero">
              <div className="explain-icon"><Info size={18} /></div>
              <div className="explain-body">
                <div className="explain-title">Vue generale RH 2</div>
                <p>{getGeneralExplanation()}</p>
                <div className="explain-meta">{docs.length} documents disponibles</div>
              </div>
            </div>

            <div className="explain-card explain-hero">
              <div className="explain-icon"><Layers size={18} /></div>
              <div className="explain-body">
                <div className="explain-title">Dossier selectionne</div>
                <div className="explain-chip">{selectedFolder ? selectedFolder.name : 'Tous les Documents'}</div>
                <p>{getFolderExplanation(selectedFolder?.name || 'Tous les Documents', selectedFolder?.path)}</p>
                <div className="explain-meta">{displayedFiles.length} fichier(s) visibles</div>
              </div>
            </div>

            <div className="explain-card explain-hero explain-steps">
              <div className="explain-icon"><BookOpen size={18} /></div>
              <div className="explain-body">
                <div className="explain-title">Comment utiliser</div>
                <ol className="explain-steps-list">
                  <li>Choisissez un dossier a gauche.</li>
                  <li>Parcourez ou telechargez un fichier.</li>
                  <li>Lisez l explication en dessous.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="library-loading">
                <Loader2 className="spinner" size={40} />
                <p>Chargement des fichiers...</p>
              </div>
            ) : displayedFiles.length > 0 ? (
              <table className="library-table">
                <thead>
                  <tr>
                    <th>Nom du Fichier</th>
                    <th>Type</th>
                    <th>Taille</th>
                    <th>Date d'ajout</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFiles.map(doc => {
                    const fileName = doc.name.split('/').pop();
                    return (
                      <tr key={doc.id}>
                        <td className="file-name-cell">
                          {getFileIcon(doc.type)}
                          <span>{fileName}</span>
                        </td>
                        <td><span className="type-tag">{doc.type.toUpperCase()}</span></td>
                        <td>{(doc.size / 1024).toFixed(1)} KB</td>
                        <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td className="actions-cell">
                          <a href={doc.url} target="_blank" rel="noreferrer" className="action-btn view-btn" title="Voir">
                            <Eye size={18} />
                          </a>
                          <a href={doc.url} download={fileName} className="action-btn download-btn" title="Télécharger">
                            <Download size={18} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="library-empty">
                <File size={48} opacity={0.1} />
                <h3>Aucun fichier dans ce dossier</h3>
                {searchTerm && <p>Aucun résultat pour "{searchTerm}"</p>}
              </div>
            )}
          </div>

          <div className="library-explain">
            <div className="explain-card">
              <div className="explain-title">Explication des fichiers</div>
              {displayedFiles.length > 0 ? (
                <div className="explain-file-list">
                  {displayedFiles.map((doc) => {
                    const fileName = doc.name.split('/').pop();
                    return (
                      <div key={doc.id} className="explain-file-item">
                        <div className="explain-file-name">{fileName}</div>
                        <div className="explain-file-desc">{getFileExplanation(fileName)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="explain-empty">Aucun fichier a expliquer dans ce dossier.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Source+Sans+3:wght@400;600;700&display=swap');

        /* ===== BASE ===== */
        .library-view {
          --doc-ink: #1f2933;
          --doc-sand: #f7f0e6;
          --doc-teal: #1f7a6e;
          --doc-clay: #c96b3f;
          --doc-mist: #eef3f2;
          --doc-line: #e7ded3;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 0 4rem;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
        }
        .library-view h1, .library-view h2, .library-view h3, .library-view h4 {
          font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
        }

        /* ===== HEADER ===== */
        .library-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          background: linear-gradient(140deg, #f9f4ec 0%, #e9f2f0 100%);
          padding: clamp(18px,3vw,28px) clamp(20px,4vw,32px);
          border-radius: 26px;
          border: 1px solid var(--doc-line);
          box-shadow: 0 14px 40px rgba(31,41,51,0.08);
          position: relative;
          overflow: hidden;
        }
        .library-header::before {
          content:'';
          position:absolute;
          top:-30px;
          right:-30px;
          width:180px;
          height:180px;
          background:radial-gradient(circle,rgba(31,122,110,.15) 0%,transparent 70%);
          pointer-events:none;
        }
        .header-info h1 { font-size: clamp(1.4rem, 2.7vw, 2.2rem); color: var(--doc-ink); margin-bottom: 5px; font-weight: 800; letter-spacing: -0.6px; }
        .header-info p { color: #58616a; font-size: clamp(0.85rem, 1.4vw, 1rem); margin: 0; }
        .library-stats { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .stat-pill { background: white; border: 1px solid var(--doc-line); padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 7px; color: var(--doc-ink); }
        .refresh-btn { background: linear-gradient(135deg, var(--doc-teal), #2f9b8d); color: white; border: none; padding: 10px 20px; border-radius: 30px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 6px 16px rgba(31,122,110,.25); }
        .refresh-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(31,122,110,.35); }

        /* ===== LAYOUT ===== */
        .library-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; align-items: start; }

        /* ===== SIDEBAR ===== */
        .library-sidebar { background: white; border-radius: 18px; border: 1px solid var(--doc-line); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 6px 24px rgba(31,41,51,.06); position: sticky; top: 16px; max-height: 78vh; }
        .sidebar-search { padding: 13px 15px; border-bottom: 1px solid var(--doc-line); display: flex; align-items: center; gap: 9px; background: #faf7f2; color: #6b7280; }
        .sidebar-search input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; color: var(--doc-ink); font-weight: 600; }
        .sidebar-search input::placeholder { color: #8b93a0; }
        .library-tree-container { flex: 1; overflow-y: auto; padding: 12px 10px; }
        .library-tree-container::-webkit-scrollbar { width: 4px; }
        .library-tree-container::-webkit-scrollbar-thumb { background: #e3dad0; border-radius: 10px; }
        .lib-tree-node { margin-bottom: 2px; }
        .lib-node-row { display: flex; align-items: center; padding: 9px 10px; border-radius: 10px; cursor: pointer; transition: all 0.18s; color: #5a646d; font-weight: 600; font-size: 0.87rem; }
        .lib-node-row:hover { background: #f3eee6; color: var(--doc-ink); }
        .lib-node-row.selected { background: linear-gradient(135deg, #e9f5f3, #dff1ed); color: var(--doc-teal); font-weight: 700; border-left: 3px solid var(--doc-teal); }
        .lib-node-toggle { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 5px; transition: 0.2s; flex-shrink: 0; }
        .lib-node-toggle:hover { background: rgba(0,0,0,.06); }
        .lib-folder-icon { color: var(--doc-clay); margin-right: 9px; flex-shrink: 0; }
        .lib-node-row.selected .lib-folder-icon { color: var(--doc-teal); }
        .lib-node-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .lib-node-children { margin-top: 2px; border-left: 2px solid #e6ded2; margin-left: 18px; }
        .no-data-tree { color: #8b93a0; font-size: 0.85rem; text-align: center; padding: 20px; }

        /* ===== TABLE ===== */
        .library-main { background: white; border-radius: 20px; border: 1px solid var(--doc-line); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(31,41,51,.06); }
        .folder-title { padding: 18px 22px; border-bottom: 1px solid var(--doc-line); display: flex; align-items: center; gap: 11px; background: #fcfaf7; flex-shrink: 0; }
        .folder-title h2 { font-size: 1.1rem; color: var(--doc-ink); margin: 0; font-weight: 800; }
        .table-container { flex: 1; overflow: auto; max-height: 62vh; }
        .table-container::-webkit-scrollbar { width: 6px; height: 6px; }
        .table-container::-webkit-scrollbar-thumb { background: #e3dad0; border-radius: 10px; }
        .library-table { width: 100%; min-width: 480px; border-collapse: collapse; text-align: left; }
        .library-table th { background: #faf7f2; padding: 11px 18px; font-size: 0.72rem; color: #6b7280; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--doc-line); position: sticky; top: 0; z-index: 5; }
        .library-table td { padding: 13px 18px; font-size: 0.9rem; color: #3b4650; border-bottom: 1px solid #f3ece4; transition: background 0.15s; }
        .library-table tr:last-child td { border-bottom: none; }
        .library-table tr:hover td { background: #fbf8f3; }
        .file-name-cell { display: flex; align-items: center; gap: 11px; font-weight: 600; color: var(--doc-ink) !important; }
        .type-tag { font-size: 0.68rem; font-weight: 800; color: #4b5563; background: #f1eee8; padding: 3px 9px; border-radius: 6px; letter-spacing: 0.5px; white-space: nowrap; }
        .actions-cell { display: flex; gap: 8px; }
        .action-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9px; transition: all 0.2s ease; color: #6b7280; background: #faf7f2; text-decoration: none; border: 1px solid var(--doc-line); }
        .action-btn:hover { color: white; transform: translateY(-1px); border-color: transparent; }
        .view-btn:hover { background: var(--doc-teal); box-shadow: 0 5px 14px rgba(31,122,110,.3); }
        .download-btn:hover { background: var(--doc-clay); box-shadow: 0 5px 14px rgba(201,107,63,.3); }
        .lib-icon-excel { color: #2f8a6d; } .lib-icon-word { color: #2f6fa8; } .lib-icon-pdf { color: #b5493f; }
        .library-loading, .library-empty { padding: 4rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
        .library-empty h3 { color: var(--doc-ink); margin: 0; font-size: 1.1rem; font-weight: 800; }
        .library-empty p { color: #8b93a0; margin: 0; }

        /* ===== EXPLANATION AREA ===== */
        .explain-top { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 16px 18px 6px; background: #fcfaf7; border-bottom: 1px solid var(--doc-line); }
        .explain-card { background: white; border: 1px solid var(--doc-line); border-radius: 16px; padding: 14px 16px; box-shadow: 0 6px 14px rgba(31,41,51,.04); }
        .explain-hero { display: flex; gap: 12px; align-items: flex-start; }
        .explain-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #e9f5f3; color: var(--doc-teal); flex-shrink: 0; }
        .explain-steps .explain-icon { background: #fdf0e8; color: var(--doc-clay); }
        .explain-title { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #6b7280; margin-bottom: 6px; }
        .explain-body p { margin: 0 0 8px; color: #57606a; font-size: 0.9rem; }
        .explain-chip { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; background: #f1eee8; color: #4b5563; margin-bottom: 8px; }
        .explain-meta { font-size: 0.78rem; font-weight: 700; color: var(--doc-teal); }
        .explain-steps-list { margin: 0; padding-left: 18px; color: #57606a; font-size: 0.88rem; }
        .explain-steps-list li { margin-bottom: 4px; }

        .library-explain { border-top: 1px solid var(--doc-line); padding: 18px; display: flex; flex-direction: column; gap: 12px; background: #fbf9f4; }
        .explain-file-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow: auto; padding-right: 4px; }
        .explain-file-list::-webkit-scrollbar { width: 5px; }
        .explain-file-list::-webkit-scrollbar-thumb { background: #e3dad0; border-radius: 10px; }
        .explain-file-item { background: #faf7f2; border: 1px solid var(--doc-line); border-radius: 12px; padding: 10px 12px; }
        .explain-file-name { font-weight: 700; font-size: 0.85rem; color: var(--doc-ink); margin-bottom: 4px; }
        .explain-file-desc { font-size: 0.82rem; color: #6b7280; line-height: 1.4; }
        .explain-empty { font-size: 0.85rem; color: #8b93a0; }

        /* ===== ANIMATIONS ===== */
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.35s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1100px) {
          .library-layout { grid-template-columns: 230px 1fr; }
          .explain-top { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .library-layout { grid-template-columns: 1fr; }
          .library-sidebar { position: static; max-height: 240px; }
        }
        @media (max-width: 480px) {
          .library-header { border-radius: 14px; }
          .library-table th:nth-child(3), .library-table td:nth-child(3),
          .library-table th:nth-child(4), .library-table td:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
};

export default DocLibrary;
