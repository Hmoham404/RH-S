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
  const [importColumns, setImportColumns] = useState([]); // toutes les colonnes du fichier Excel

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

        // --- Garder TOUTES les colonnes du fichier Excel (mode BI) ---
        // Extraire les noms de colonnes depuis la première ligne
        const allColumns = Object.keys(data[0]);
        setImportColumns(allColumns);

        // Auto-détection des colonnes DB connues (insensible à la casse)
        const findCol = (row, aliases) => {
          for (const alias of aliases) {
            const key = Object.keys(row).find(k => k.trim().toLowerCase() === alias.toLowerCase());
            if (key !== undefined) return String(row[key] ?? '').trim();
          }
          return '';
        };

        const prepared = data.map((rawRow, idx) => {
          // On copie toutes les colonnes originales
          const fullRow = { ...rawRow };
          // On ajoute/écrase les champs DB avec auto-détection
          fullRow._matricule = findCol(rawRow, ['matricule','mat','n° matricule','num matricule']);
          fullRow._nom       = findCol(rawRow, ['nom','name','last name','nom de famille']);
          fullRow._prenom    = findCol(rawRow, ['prenom','prénom','first name','prénoms']);
          fullRow._cin       = findCol(rawRow, ['cin','n° cin','cin/passport','num cin']);
          fullRow._service   = findCol(rawRow, ['service','département','department']) || 'Production';
          fullRow._statut    = findCol(rawRow, ['statut','status','état']) || 'Actif';
          fullRow._id = idx;
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
    setImportData(newData);
  };

  const confirmImport = async () => {
    setLoading(true);
    // Mapper les champs _xxx vers les colonnes DB, filtrer les invalides
    const validRows = importData
      .filter(r => r._matricule && r._cin)
      .map(r => ({
        matricule: r._matricule,
        nom:       r._nom,
        prenom:    r._prenom,
        cin:       r._cin,
        service:   r._service,
        statut:    r._statut,
      }));

    if (validRows.length === 0) {
      alert("Aucune ligne valide (Matricule et CIN obligatoires). Vérifiez les colonnes détectées.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('employees').upsert(validRows, { onConflict: 'matricule' });
    
    if (!error) {
      alert(`✅ ${validRows.length} employé(s) importé(s) / mis à jour avec succès.`);
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
    const matchesStatus = statusFilter === 'all' || emp.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>CIN</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Validé</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td><strong>{emp.matricule}</strong></td>
                    <td>{emp.nom} {emp.prenom}</td>
                    <td>{emp.cin}</td>
                    <td><span className="badge-service">{emp.service}</span></td>
                    <td><span className={`status-pill ${emp.statut?.toLowerCase().replace(/\s/g, '-')}`}>{emp.statut}</span></td>
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
                  <th>Matricule *</th>
                  <th>Nom *</th>
                  <th>Prénom *</th>
                  <th>CIN *</th>
                  <th>Service</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {importData.map((row, idx) => (
                  <tr key={idx} className={(!row.matricule || !row.cin) ? 'row-warning' : ''}>
                    <td>
                        <input 
                            type="text" 
                            className="inline-edit" 
                            value={row.matricule} 
                            onChange={(e) => updateImportRow(idx, 'matricule', e.target.value)}
                            placeholder="Requis"
                        />
                    </td>
                    <td>
                        <input 
                            type="text" 
                            className="inline-edit" 
                            value={row.nom} 
                            onChange={(e) => updateImportRow(idx, 'nom', e.target.value)}
                        />
                    </td>
                    <td>
                        <input 
                            type="text" 
                            className="inline-edit" 
                            value={row.prenom} 
                            onChange={(e) => updateImportRow(idx, 'prenom', e.target.value)}
                        />
                    </td>
                    <td>
                        <input 
                            type="text" 
                            className="inline-edit" 
                            value={row.cin} 
                            onChange={(e) => updateImportRow(idx, 'cin', e.target.value)}
                            placeholder="Requis"
                        />
                    </td>
                    <td>
                        <input 
                            type="text" 
                            className="inline-edit" 
                            value={row.service} 
                            onChange={(e) => updateImportRow(idx, 'service', e.target.value)}
                        />
                    </td>
                    <td>
                        <select 
                            className="inline-edit" 
                            value={row.statut} 
                            onChange={(e) => updateImportRow(idx, 'statut', e.target.value)}
                        >
                            <option>Actif</option>
                            <option>Inactif</option>
                            <option>Période d'essai</option>
                            <option>Confirmé</option>
                            <option>Départ</option>
                        </select>
                    </td>
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
        
        .list-controls { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 10px; background: white; padding: 0 1rem; border-radius: 12px; border: 1px solid var(--border-color); }
        .search-box input { border: none; padding: 0.8rem 0; width: 100%; outline: none; }
        .filter-box { display: flex; align-items: center; gap: 10px; background: white; padding: 0 1rem; border-radius: 12px; border: 1px solid var(--border-color); }
        .filter-box select { border: none; padding: 0.8rem 0; outline: none; background: transparent; }

        .employee-table-container { background: white; border-radius: 20px; overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); }
        .employee-table { width: 100%; border-collapse: collapse; text-align: left; }
        .employee-table th { background: #fafafa; padding: 1rem; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .employee-table td { padding: 1rem; border-bottom: 1px solid var(--bg-light); font-size: 0.9rem; }
        
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .status-pill.actif { background: #e8f5e9; color: #2e7d32; }
        .status-pill.confirmé { background: #e3f2fd; color: #1565c0; }
        .status-pill.départ { background: #ffebee; color: #c62828; }
        .status-pill.période-d-essai { background: #fff8e1; color: #f57f17; }

        .actions-cell { display: flex; gap: 10px; }
        .actions-cell button { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 5px; border-radius: 5px; }

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
