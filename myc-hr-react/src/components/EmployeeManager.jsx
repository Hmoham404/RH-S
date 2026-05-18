import React, { useState, useEffect } from 'react';
// XLSX est chargé via CDN dans index.html — on le lit dynamiquement dans le handler
import { 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download, 
  Save, 
  Loader2,
  ChevronRight,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'import', 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [importData, setImportData] = useState([]);
  const [importColumns, setImportColumns] = useState([]); // [{ label, key }]

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('matricule', { ascending: true });
    
    if (!error) setEmployees(data);
    setLoading(false);
  };

  const normalizeKey = (value) => {
    if (!value) return '';
    const normalized = value
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const aliases = {
      matr: 'matricule',
      prenom: 'prenom',
      date_de_naissance: 'date_naissance',
      periode_d_essai: 'periode_essai',
      date_de_depart: 'date_depart',
      date_d_embauche: 'date_embauche',
      type_du_contrat: 'type_du_contrat',
      date_de_confirmation_prevu_5_mois: 'date_confirmation_prevu_5_mois',
      message_d_alerte: 'message_alerte',
      actif_inactif: 'actif_inactif',
    };
    return aliases[normalized] || normalized;
  };

  const makeUniqueKey = (key, used) => {
    let nextKey = key || 'col';
    let suffix = 1;
    while (used.has(nextKey)) {
      suffix += 1;
      nextKey = `${key}_${suffix}`;
    }
    used.add(nextKey);
    return nextKey;
  };

  const pickValue = (row, keys) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
        return String(row[key]).trim();
      }
    }
    return '';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Lire la bibliothèque XLSX dynamiquement (chargée via CDN dans index.html)
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert("La bibliothèque de lecture Excel (XLSX) n'est pas encore chargée. Veuillez patienter quelques secondes et réessayer.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Lire toutes les colonnes, y compris celles avec des en-têtes vides
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (data.length === 0) {
          alert("Le fichier Excel est vide ou le format n'est pas reconnu. Vérifiez que la première ligne contient les en-têtes.");
          e.target.value = '';
          return;
        }

        const rawColumns = Object.keys(data[0]);
        const usedKeys = new Set();
        const columns = rawColumns.map((label) => {
          const normalized = normalizeKey(label);
          const key = makeUniqueKey(normalized || 'col', usedKeys);
          return { label, key };
        });
        setImportColumns(columns);

        const prepared = data.map((rawRow, idx) => {
          const fullRow = { __id: idx };
          columns.forEach((col) => {
            fullRow[col.key] = rawRow[col.label] ?? '';
          });

          fullRow.matricule = pickValue(fullRow, ['matricule']);
          fullRow.nom = pickValue(fullRow, ['nom']);
          fullRow.prenom = pickValue(fullRow, ['prenom']);
          fullRow.cin = pickValue(fullRow, ['cin']);
          fullRow.service = pickValue(fullRow, ['service', 'departement', 'department']) || 'Production';
          fullRow.statut = pickValue(fullRow, ['statut', 'actif_inactif']) || 'Actif';

          return fullRow;
        });

        setImportData(prepared);
        setView('import');
      } catch (err) {
        alert("Erreur lors de la lecture du fichier : " + err.message);
        e.target.value = '';
      }
    };
    reader.onerror = () => {
      alert("Impossible de lire le fichier. Vérifiez qu'il n'est pas corrompu.");
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const updateImportRow = (idx, field, value) => {
    const newData = [...importData];
    newData[idx][field] = value;
    newData[idx].matricule = pickValue(newData[idx], ['matricule']);
    newData[idx].nom = pickValue(newData[idx], ['nom']);
    newData[idx].prenom = pickValue(newData[idx], ['prenom']);
    newData[idx].cin = pickValue(newData[idx], ['cin']);
    newData[idx].service = pickValue(newData[idx], ['service', 'departement', 'department']) || 'Production';
    newData[idx].statut = pickValue(newData[idx], ['statut', 'actif_inactif']) || 'Actif';
    setImportData(newData);
  };

  const confirmImport = async () => {
    setLoading(true);
    const existingMatricules = new Set(
      employees
        .map((emp) => (emp.matricule || '').toString().trim())
        .filter(Boolean)
    );
    const validRows = importData
      .filter(r => r.matricule)
      .filter(r => !existingMatricules.has(String(r.matricule).trim()))
      .map((row) => {
        const cleaned = {};
        Object.entries(row).forEach(([key, value]) => {
          if (key === '__id') return;
          cleaned[key] = value ?? '';
        });
        return cleaned;
      });

    if (validRows.length === 0) {
      alert("Aucune ligne valide a importer (Matricule obligatoire, et pas de doublons). Vérifiez les colonnes détectées.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('employees').insert(validRows);
    
    if (!error) {
      alert(`✅ ${validRows.length} employé(s) importé(s) avec succès.`);
      fetchEmployees();
      setView('list');
      setImportColumns([]);
    } else {
      alert("Erreur lors de l'import : " + error.message);
    }
    setLoading(false);
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Supprimer cet employé ?")) return;
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (!error) setEmployees(employees.filter(e => e.id !== id));
  };

  const saveEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const employeeData = Object.fromEntries(formData.entries());
    const matriculeValue = (employeeData.matricule || '').toString().trim();
    const existingEmployee = employees.find(
      (emp) => (emp.matricule || '').toString().trim() === matriculeValue
    );
    const isEditing = Boolean(employeeData.id);

    if (!isEditing && existingEmployee) {
      alert('Matricule deja existant. Veuillez modifier l employe existant.');
      setSelectedEmployee(existingEmployee);
      setView('form');
      setLoading(false);
      return;
    }
    
    // Conversion checkbox
    employeeData.valide = formData.get('valide') === 'true';

    const { error } = await supabase.from('employees').upsert([employeeData], { onConflict: 'matricule' });
    
    if (!error) {
      fetchEmployees();
      setView('list');
    } else {
      alert("Erreur : " + error.message);
    }
    setLoading(false);
  };

  const filteredEmployees = employees.filter(emp => {
    const name = (emp.nom || '') + (emp.prenom || '');
    const mat = (emp.matricule || '');
    const matchesSearch = (name + mat).toLowerCase().includes(searchTerm.toLowerCase());
    const statusValue = emp.statut ?? emp.actif_inactif ?? '';
    const matchesStatus = statusFilter === 'all' || statusValue === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => (e.statut || e.actif_inactif || '').toString().toLowerCase().includes('actif')).length;
  const inactiveCount = employees.filter(e => (e.statut || e.actif_inactif || '').toString().toLowerCase().includes('inactif')).length;
  const probationCount = employees.filter(e => (e.statut || '').toString().toLowerCase().includes('essai')).length;

  const hiddenKeys = new Set(['id', 'created_at', 'updated_at']);
  const fallbackColumns = employees.length
    ? Object.keys(employees[0]).filter((key) => !hiddenKeys.has(key))
    : ['matricule', 'nom', 'prenom', 'cin', 'service', 'statut'];

  const listColumns = importColumns.length
    ? importColumns
    : fallbackColumns.map((key) => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
      }));

  return (
    <div className="section active employee-manager">
      <div className="manager-header">
        <div className="header-left">
          <h1>Gestion du Personnel RH</h1>
          <p>Importation et modification de la base employés.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => { setSelectedEmployee(null); setView('form'); }}>
            <UserPlus size={18} /> Ajout Manuel
          </button>
          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={18} /> Charger Fichier (Excel/ODS)
            <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls, .ods" />
          </label>
        </div>
      </div>

      {view === 'list' && (
        <div className="animate-fade-in">
          <div className="stats-grid">
            <div className="stats-card">
              <span>Total Employes</span>
              <strong>{totalEmployees}</strong>
            </div>
            <div className="stats-card active">
              <span>Actifs</span>
              <strong>{activeCount}</strong>
            </div>
            <div className="stats-card inactive">
              <span>Inactifs</span>
              <strong>{inactiveCount}</strong>
            </div>
            <div className="stats-card probation">
              <span>Periode d'essai</span>
              <strong>{probationCount}</strong>
            </div>
          </div>

          <div className="list-controls">
            <div className="search-box">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un employé..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="filter-box">
              <Filter size={20} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="Période d'essai">Période d'essai</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Départ">Départ</option>
              </select>
            </div>
          </div>

          <div className="list-layout">
            <div className="list-main">
              <div className="employee-table-container">
                <table className="employee-table">
                  <thead>
                    <tr>
                      {listColumns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Validé</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id}>
                        {listColumns.map((col) => {
                          const value = emp[col.key];
                          if (col.key === 'statut' || col.key === 'actif_inactif') {
                            const status = value || '';
                            const statusClass = status
                              .toString()
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .replace(/[^a-z0-9]+/g, '-');
                            return (
                              <td key={col.key}>
                                <span className={`status-pill ${statusClass}`}>{status}</span>
                              </td>
                            );
                          }
                          return (
                            <td key={col.key}>
                              {col.key === 'matricule' ? <strong>{value}</strong> : value}
                            </td>
                          );
                        })}
                        <td>{emp.valide ? <CheckCircle size={18} color="#2ecc71" /> : <AlertTriangle size={18} color="#f1c40f" />}</td>
                        <td className="actions-cell">
                          <button onClick={() => { setSelectedEmployee(emp); setView('form'); }} title="Modifier"><Edit2 size={16} /></button>
                          <button onClick={() => deleteEmployee(emp.id)} className="delete" title="Supprimer"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="list-side">
              <div className="panel-card">
                <div className="panel-header">
                  <div>
                    <h3>Import direct</h3>
                    <p>Importer uniquement les matricules non existants.</p>
                  </div>
                  <span className="panel-badge">{importData.length} lignes</span>
                </div>
                <div className="panel-actions">
                  <label className="btn-primary" style={{ cursor: 'pointer' }}>
                    <Upload size={16} /> Choisir un fichier
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls, .ods" />
                  </label>
                  <button className="btn-secondary" onClick={() => setView('import')} disabled={importData.length === 0}>
                    Previsualiser
                  </button>
                  <button className="btn-confirm" onClick={confirmImport} disabled={importData.length === 0}>
                    Importer maintenant
                  </button>
                </div>
                <div className="panel-meta">
                  <span>{importColumns.length} colonnes detectees</span>
                  <span>Matricule requis, CIN optionnel</span>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div>
                    <h3>Ajout manuel</h3>
                    <p>Si le matricule existe, utilisez la modification.</p>
                  </div>
                </div>
                <form onSubmit={saveEmployee} className="quick-form">
                  <input name="matricule" placeholder="Matricule *" required />
                  <input name="nom" placeholder="Nom *" required />
                  <input name="prenom" placeholder="Prenom *" required />
                  <input name="cin" placeholder="CIN (optionnel)" />
                  <input name="service" placeholder="Service" />
                  <select name="statut" defaultValue="Actif">
                    <option>Actif</option>
                    <option>Inactif</option>
                    <option>Période d'essai</option>
                    <option>Confirmé</option>
                    <option>Départ</option>
                  </select>
                  <button type="submit" className="btn-save">Enregistrer</button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      )}

      {view === 'import' && (
        <div className="import-preview animate-fade-in">
          <div className="preview-header">
            <div className="header-info">
                <h3><FileSpreadsheet size={24} /> Prévisualisation & Correction</h3>
                <p>Vous pouvez modifier les cases vides directement dans le tableau avant d'importer.</p>
            </div>
            <div className="preview-actions">
              <button className="btn-cancel" onClick={() => setView('list')}><X size={18} /> Annuler</button>
              <button className="btn-confirm" onClick={confirmImport}>
                <Save size={18} /> Confirmer l'importation
              </button>
            </div>
          </div>
          
          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  {importColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importData.map((row, idx) => (
                  <tr key={idx} className={!row.matricule ? 'row-warning' : ''}>
                    {importColumns.map((col) => (
                      <td key={col.key}>
                        <input
                          type="text"
                          className="inline-edit"
                          value={row[col.key] ?? ''}
                          onChange={(e) => updateImportRow(idx, col.key, e.target.value)}
                          placeholder={col.key === 'matricule' ? 'Requis' : ''}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="form-container animate-fade-in">
          <div className="form-header">
            <h3>{selectedEmployee ? 'Modifier Employé' : 'Ajouter un Employé'}</h3>
            <button onClick={() => setView('list')}><X size={20} /></button>
          </div>
          <form onSubmit={saveEmployee} className="employee-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Matricule *</label>
                <input name="matricule" defaultValue={selectedEmployee?.matricule} required />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input name="nom" defaultValue={selectedEmployee?.nom} required />
              </div>
              <div className="form-group">
                <label>Prénom *</label>
                <input name="prenom" defaultValue={selectedEmployee?.prenom} required />
              </div>
              <div className="form-group">
                <label>CIN *</label>
                <input name="cin" defaultValue={selectedEmployee?.cin} required maxLength={8} />
              </div>
              <div className="form-group">
                <label>Service</label>
                <select name="service" defaultValue={selectedEmployee?.service || 'Production'}>
                  <option>Production</option>
                  <option>Supply Chain</option>
                  <option>Qualité</option>
                  <option>RH</option>
                  <option>Finance</option>
                  <option>Technique</option>
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select name="statut" defaultValue={selectedEmployee?.statut || 'Actif'}>
                  <option>Actif</option>
                  <option>Inactif</option>
                  <option>Période d'essai</option>
                  <option>Confirmé</option>
                  <option>Départ</option>
                </select>
              </div>
              <div className="form-group">
                <label>Validation RH</label>
                <div className="checkbox-wrapper">
                  <input type="checkbox" name="valide" defaultChecked={selectedEmployee?.valide} value="true" />
                  <span>Dossier complet et validé</span>
                </div>
              </div>
            </div>
            
            {selectedEmployee && <input type="hidden" name="id" value={selectedEmployee.id} />}

            <div className="form-footer">
              <button type="button" className="btn-cancel" onClick={() => setView('list')}>Annuler</button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? <Loader2 className="spinner" size={18} /> : <Save size={18} />} Sauvegarder
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .employee-manager { max-width: 1200px; margin: 0 auto; padding-bottom: 5rem; }
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-actions { display: flex; gap: 1rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stats-card { background: white; border-radius: 16px; border: 1px solid var(--border-color); padding: 1rem 1.2rem; display: flex; flex-direction: column; gap: 6px; box-shadow: var(--shadow-sm); }
        .stats-card span { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .stats-card strong { font-size: 1.4rem; color: var(--text-main); }
        .stats-card.active { border-color: #c8e6c9; background: #f1f8f1; }
        .stats-card.inactive { border-color: #ffcdd2; background: #fff5f5; }
        .stats-card.probation { border-color: #ffe0b2; background: #fff8e1; }

        .list-layout { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start; }
        .list-main { min-width: 0; }
        .list-side { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 90px; }
        .list-controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 10px; background: white; padding: 0 1rem; border-radius: 12px; border: 1px solid var(--border-color); }
        .search-box input { border: none; padding: 0.8rem 0; width: 100%; outline: none; }
        .filter-box { display: flex; align-items: center; gap: 10px; background: white; padding: 0 1rem; border-radius: 12px; border: 1px solid var(--border-color); }
        .filter-box select { border: none; padding: 0.8rem 0; outline: none; background: transparent; }

        .employee-table-container { background: white; border-radius: 20px; overflow: auto; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); }
        .employee-table { width: 100%; min-width: 1100px; border-collapse: collapse; text-align: left; }
        .employee-table th { background: #fafafa; padding: 1rem; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .employee-table td { padding: 1rem; border-bottom: 1px solid var(--bg-light); font-size: 0.9rem; }
        
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .status-pill.actif { background: #e8f5e9; color: #2e7d32; }
        .status-pill.inactif { background: #ffebee; color: #c62828; }
        .status-pill.actif-inactif { background: #ffe8e8; color: #b71c1c; }
        .status-pill.confirmé { background: #e3f2fd; color: #1565c0; }
        .status-pill.confirme { background: #e3f2fd; color: #1565c0; }
        .status-pill.départ { background: #ffebee; color: #c62828; }
        .status-pill.depart { background: #ffebee; color: #c62828; }
        .status-pill.période-d-essai { background: #fff8e1; color: #f57f17; }
        .status-pill.periode-d-essai { background: #fff8e1; color: #f57f17; }

        .actions-cell { display: flex; gap: 10px; }
        .actions-cell button { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 5px; border-radius: 5px; }

        .panel-card { background: white; border-radius: 20px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); padding: 1.2rem; display: flex; flex-direction: column; gap: 1rem; }
        .panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .panel-header h3 { margin: 0; font-size: 1.05rem; }
        .panel-header p { margin: 0.3rem 0 0; color: var(--text-muted); font-size: 0.85rem; }
        .panel-badge { background: #fff5f5; color: var(--red); font-weight: 700; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; }
        .panel-actions { display: grid; grid-template-columns: 1fr; gap: 0.6rem; }
        .panel-meta { display: flex; flex-direction: column; gap: 6px; color: var(--text-muted); font-size: 0.8rem; }
        .quick-form { display: grid; gap: 0.6rem; }
        .quick-form input,
        .quick-form select { padding: 0.6rem 0.7rem; border-radius: 10px; border: 1px solid var(--border-color); font-size: 0.85rem; }

        @media (max-width: 1100px) {
          .list-layout { grid-template-columns: 1fr; }
          .list-side { position: static; }
        }

        /* Import Preview */
        .import-preview { background: white; border-radius: 20px; border: 1px solid var(--border-color); overflow: hidden; }
        .preview-header { padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); }
        .preview-table-container { max-height: 600px; overflow: auto; }
        .preview-table { width: 100%; border-collapse: collapse; }
        .preview-table th { background: #f5f5f5; padding: 12px; font-size: 0.75rem; position: sticky; top: 0; z-index: 10; border-bottom: 2px solid #ddd; }
        .row-warning { background: #fffef0; }
        
        .inline-edit { width: 100%; border: 1px solid transparent; padding: 8px; border-radius: 5px; font-size: 0.85rem; background: transparent; transition: 0.2s; }
        .inline-edit:hover { background: #f0f0f0; border-color: #ddd; }
        .inline-edit:focus { background: white; border-color: var(--red); outline: none; box-shadow: 0 0 5px rgba(196,30,58,0.2); }
        .row-warning .inline-edit { background: #fffbe6; }

        /* Form */
        .form-container { background: white; border-radius: 24px; border: 1px solid var(--border-color); max-width: 800px; margin: 0 auto; overflow: hidden; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .btn-primary, .btn-secondary, .btn-confirm, .btn-save { padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; border: none; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .btn-primary { background: var(--red); color: white; }
        .btn-secondary { background: var(--text-main); color: white; }
        .btn-cancel { background: #eee; padding: 0.8rem 1.5rem; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default EmployeeManager;
