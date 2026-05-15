export const profiles = {
    'sami': {
        id: 'sami',
        name: 'Sami LADJIMI', title: 'Directeur Général', dept: 'Direction Générale',
        status: 'Identifié', statusClass: 'status-identified', icon: 'UserTie',
        resp: 'Pilotage stratégique de l\'usine, gestion des P&L, représentation légale, et supervision globale des opérations en Tunisie.',
        team: 'Comité de Direction (7 personnes)'
    },
    'supply': {
        id: 'supply',
        name: 'À définir', title: 'Directeur Supply Chain', dept: 'Supply Chain',
        status: 'À recruter', statusClass: 'status-recruit', icon: 'Truck',
        resp: 'Gestion complète des flux logistiques, achats, approvisionnements, stockage et expéditions. Optimisation des coûts logistiques.',
        team: '~25 collaborateurs'
    },
    'prod': {
        id: 'prod',
        name: 'Ahmed B.', title: 'Directeur Production', dept: 'Production',
        status: 'Identifié', statusClass: 'status-identified', icon: 'Factory',
        resp: 'Garantir la réalisation du planning de production dans le respect des standards de qualité, coûts et délais. Supervision des ateliers.',
        team: '~80 collaborateurs'
    },
    'tech': {
        id: 'tech',
        name: 'Mounir T.', title: 'Directeur Technical', dept: 'Technical',
        status: 'Intérim', statusClass: 'status-interim', icon: 'Wrench',
        resp: 'Gestion de la maintenance industrielle, de l\'outillage (moules), de l\'ingénierie process et des projets d\'amélioration continue.',
        team: '~15 collaborateurs'
    },
    'qualite': {
        id: 'qualite',
        name: 'Sara M.', title: 'Directrice Qualité', dept: 'Qualité',
        status: 'Identifié', statusClass: 'status-identified', icon: 'ClipboardCheck',
        resp: 'Mise en place et maintien du SMQ. Supervision des contrôles IQC, IPQC, OQC et gestion des réclamations clients.',
        team: '~12 collaborateurs'
    },
    'finance': {
        id: 'finance',
        name: 'Karim L.', title: 'Directeur Finance', dept: 'Finance & IT',
        status: 'En cours', statusClass: 'status-progress', icon: 'LineChart',
        resp: 'Gestion financière, comptable et fiscale. Élaboration des budgets, reporting, et pilotage des systèmes d\'information.',
        team: '~5 collaborateurs'
    },
    'rh': {
        id: 'rh',
        name: 'Leïla K.', title: 'Responsable RH', dept: 'Ressources Humaines',
        status: 'Identifié', statusClass: 'status-identified', icon: 'Users',
        resp: 'Développement du capital humain, recrutement, formation, administration du personnel, paie, et garantie du respect de la conformité sociale.',
        team: '~4 collaborateurs'
    },
    'admin': {
        id: 'admin',
        name: 'Fatma Z.', title: 'Responsable Admin.', dept: 'Administration',
        status: 'Identifié', statusClass: 'status-identified', icon: 'Building2',
        resp: 'Gestion des services généraux, accueil, sécurité physique du site, et support administratif à la Direction Générale.',
        team: '~3 collaborateurs'
    },
    'sales': {
        id: 'sales',
        name: 'Candidat X', title: 'Directeur Sales', dept: 'Sales',
        status: 'En cours', statusClass: 'status-progress', icon: 'Handshake',
        resp: 'Développement du portefeuille clients B2B, gestion de la relation commerciale, et coordination avec la maison mère.',
        team: '~6 collaborateurs'
    }
};

export const documents = [
    { id: 1, ref: 'FRM-HR-001', title: 'Demande de formation', cat: 'formation', type: 'word' },
    { id: 2, ref: 'REP-HR-002', title: 'Rapport de formation', cat: 'formation', type: 'word' },
    { id: 3, ref: 'REG-HR-003', title: 'Registre de formation', cat: 'formation', type: 'excel' },
    { id: 4, ref: 'EVAL-HR-004', title: 'Évaluation pratique', cat: 'formation', type: 'word' },
    { id: 5, ref: 'TST-HR-005', title: 'Test d’intégration', cat: 'formation', type: 'word' },
    { id: 6, ref: 'PRO-HR-006', title: 'Procédure de gestion de formation', cat: 'procedures', type: 'pdf' },
    { id: 7, ref: 'PRO-HR-007', title: 'Procédure responsabilités', cat: 'procedures', type: 'pdf' },
    { id: 8, ref: 'CTRL-HR-008', title: 'Contrôle ressources humaines', cat: 'admin', type: 'excel' },
    { id: 9, ref: 'FRM-HR-009', title: 'Accord de confidentialité', cat: 'admin', type: 'word' },
    { id: 10, ref: 'PRO-HR-010', title: 'Administration entrée employés', cat: 'admin', type: 'pdf' },
    { id: 11, ref: 'PRO-HR-011', title: 'Gestion formation pré-emploi', cat: 'formation', type: 'pdf' },
    { id: 12, ref: 'POL-SA-001', title: 'Élection représentants', cat: 'sa8000', type: 'pdf' },
    { id: 13, ref: 'POL-SA-002', title: 'Interdiction travail forcé', cat: 'sa8000', type: 'pdf' },
    { id: 14, ref: 'POL-SA-003', title: 'Responsabilité sociale', cat: 'sa8000', type: 'pdf' },
    { id: 15, ref: 'POL-SA-004', title: 'Protection enfants', cat: 'sa8000', type: 'pdf' }
];

export const departmentsData = [
    {
        id: 'supply',
        title: 'Supply Chain',
        icon: 'Truck',
        count: '~25',
        status: 'Recrutement',
        statusColor: 'var(--status-recruit)',
        items: ['Approvisionnement & Achats', 'Planning de production', 'Warehouse / Magasin', 'Logistique & Export']
    },
    {
        id: 'prod',
        title: 'Production',
        icon: 'Factory',
        count: '~80',
        status: 'Actif',
        statusColor: 'var(--status-identified)',
        items: ['Injection Plastique', 'Spray / Laquage', 'Métallisation', 'Assemblage final']
    },
    {
        id: 'tech',
        title: 'Technical',
        icon: 'Wrench',
        count: '~15',
        status: 'Intérim',
        statusColor: 'var(--status-interim)',
        items: ['Maintenance préventive', 'Engineering & Moules', 'Automation', 'Amélioration process']
    },
    {
        id: 'qualite',
        title: 'Qualité',
        icon: 'ClipboardCheck',
        count: '~12',
        status: 'Actif',
        statusColor: 'var(--status-identified)',
        items: ['IQC (Contrôle Réception)', 'IPQC (Contrôle Process)', 'FQC / OQC (Contrôle Final)', 'Laboratoire & Métrologie']
    },
    {
        id: 'finance',
        title: 'Finance & IT',
        icon: 'LineChart',
        count: '~5',
        status: 'En dev.',
        statusColor: 'var(--status-progress)',
        items: ['Comptabilité Générale', 'Contrôle de gestion / Costing', 'Trésorerie', 'Support IT Local']
    },
    {
        id: 'rh',
        title: 'Ressources Humaines',
        icon: 'Users',
        count: '~4',
        status: 'Actif',
        statusColor: 'var(--status-identified)',
        items: ['Administration du personnel', 'Recrutement & Formation', 'Sécurité & Santé (HSE)', 'Conformité SA8000']
    },
    {
        id: 'admin',
        title: 'Administration',
        icon: 'Building2',
        count: '~3',
        status: 'Actif',
        statusColor: 'var(--status-identified)',
        items: ['Support Direction Générale', 'Coordination site', 'Services généraux', 'Accueil & Sécurité site']
    },
    {
        id: 'sales',
        title: 'Sales',
        icon: 'Handshake',
        count: '~6',
        status: 'En dev.',
        statusColor: 'var(--status-progress)',
        items: ['Développement Commercial', 'Relation Client B2B', 'Marketing Produit', 'Suivi des projets clients']
    }
];
