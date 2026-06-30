// ─────────────────────────────────────────────────────────────────────────────
//  LBASSUR — Configuration des Formulaires de Cotation par Type d'Assurance
//  Conformes à la législation béninoise et au code CIMA
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "checkbox-group"
  | "textarea"
  | "currency";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: FormFieldOption[];
  validation?: {
    min?: number | string;
    max?: number | string;
    pattern?: string;
    message?: string;
  };
  helperText?: string;
  fullWidth?: boolean;
  suffix?: string; // e.g. "FCFA", "m²"
  dependsOn?: string;
  getOptions?: (dependentValue: any) => FormFieldOption[];
  showIf?: (formData: Record<string, any>) => boolean;
}

export interface FormSection {
  id: string;
  letter: string; // A, B, C, D...
  title: string;
  description?: string;
  fields: FormField[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
}

export interface InsuranceFormConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  sections: FormSection[];
  requiredDocuments: RequiredDocument[];
  available: boolean; // Phase 1 = true, Phase 2 = false
}

// ── Documents communs (entreprises) ──────────────────────────────────────────

export const COMMON_ENTERPRISE_DOCUMENTS: RequiredDocument[] = [
  { id: "rccm", name: "RCCM", description: "Registre du Commerce et du Crédit Mobilier", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  { id: "ifu", name: "IFU", description: "Identifiant Fiscal Unique", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  { id: "statuts", name: "Statuts de l'entreprise", description: "Statuts enregistrés de la société", required: true, acceptedFormats: ["pdf"], maxSizeMB: 10 },
  { id: "etats-financiers", name: "États financiers (3 dernières années)", description: "Bilans et comptes de résultat certifiés", required: true, acceptedFormats: ["pdf"], maxSizeMB: 15 },
  { id: "organigramme", name: "Organigramme", description: "Structure organisationnelle de l'entreprise", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  { id: "liste-personnel", name: "Liste du personnel", description: "Liste nominative des employés", required: false, acceptedFormats: ["pdf", "xlsx"], maxSizeMB: 5 },
];

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — ASSURANCE AUTOMOBILE
// ═════════════════════════════════════════════════════════════════════════════

const AUTOMOBILE_FORM: InsuranceFormConfig = {
  id: "automobile",
  title: "Assurance Automobile",
  subtitle: "Fiche de demande de cotation automobile",
  icon: "Car",
  available: true,
  sections: [
    {
      id: "identification",
      letter: "A",
      title: "Identification du Souscripteur",
      fields: [
        { id: "nom", label: "Nom et Prénoms / Raison sociale", type: "text", placeholder: "Ex: KOFFI Jean-Baptiste", required: true, fullWidth: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "adresse", label: "Adresse", type: "text", placeholder: "Quartier, Ville", required: true, fullWidth: true },
        {
          id: "type_souscripteur",
          label: "Type de souscripteur",
          type: "radio",
          required: true,
          options: [
            { value: "particulier", label: "Particulier" },
            { value: "entreprise", label: "Entreprise" },
            { value: "administration", label: "Administration publique" },
            { value: "association", label: "Association / ONG" },
          ],
        },
      ],
    },
    {
      id: "vehicule",
      letter: "B",
      title: "Informations sur le Véhicule",
      fields: [
        {
          id: "marque",
          label: "Marque",
          type: "select",
          required: true,
          options: [
            { value: "toyota", label: "Toyota" },
            { value: "hyundai", label: "Hyundai" },
            { value: "peugeot", label: "Peugeot" },
            { value: "renault", label: "Renault" },
            { value: "kia", label: "Kia" },
            { value: "nissan", label: "Nissan" },
            { value: "lexus", label: "Lexus" },
            { value: "mercedes", label: "Mercedes-Benz" },
            { value: "bmw", label: "BMW" },
            { value: "autre", label: "Autre..." }
          ]
        },
        {
          id: "marque_autre",
          label: "Précisez la marque",
          type: "text",
          required: true,
          showIf: (data) => data.marque === "autre"
        },
        {
          id: "modele",
          label: "Modèle",
          type: "select",
          required: true,
          dependsOn: "marque",
          getOptions: (marqueValue) => {
            const models: Record<string, string[]> = {
              toyota: ["Corolla", "Yaris", "RAV4", "Camry", "Prado", "Hilux", "Highlander", "Matrix", "Avensis"],
              hyundai: ["Tucson", "Elantra", "Santa Fe", "Sonata", "Accent"],
              peugeot: ["208", "308", "508", "2008", "3008", "5008"],
              renault: ["Clio", "Megane", "Captur", "Duster", "Koleos"],
              kia: ["Sportage", "Sorento", "Rio", "Cerato", "Picanto"],
              nissan: ["Qashqai", "Altima", "Patrol", "X-Trail", "Pathfinder"],
              lexus: ["RX330", "RX350", "ES300", "LX470"],
              mercedes: ["Classe C", "Classe E", "Classe ML/GLE", "Classe S"],
              bmw: ["Série 3", "Série 5", "X3", "X5"]
            };
            const list = models[String(marqueValue)] || [];
            const options = list.map(m => ({ value: m.toLowerCase(), label: m }));
            options.push({ value: "autre", label: "Autre..." });
            return options;
          }
        },
        {
          id: "modele_autre",
          label: "Précisez le modèle",
          type: "text",
          required: true,
          showIf: (data) => data.modele === "autre"
        },
        { id: "annee", label: "Année de mise en circulation", type: "number", placeholder: "Ex: 2020", required: true, validation: { min: 1990, max: new Date().getFullYear() } },
        { id: "immatriculation", label: "Immatriculation", type: "text", placeholder: "Ex: AB 1234 RB", required: true },
        { id: "puissance_fiscale", label: "Puissance fiscale", type: "text", placeholder: "Ex: 7 CV", required: true },
        { id: "nb_places", label: "Nombre de places", type: "number", placeholder: "Ex: 5", required: true, validation: { min: 1, max: 60 } },
        {
          id: "etat_vehicule",
          label: "État du véhicule",
          type: "radio",
          required: true,
          options: [
            { value: "neuf", label: "Neuf" },
            { value: "occasion", label: "Occasion" },
          ],
        },
        {
          id: "origine",
          label: "Origine",
          type: "radio",
          required: true,
          options: [
            { value: "concessionnaire", label: "Concessionnaire" },
            { value: "importe", label: "Importé" },
            { value: "particulier", label: "Achat particulier" },
          ],
        },
        {
          id: "carburant",
          label: "Carburant",
          type: "radio",
          required: true,
          options: [
            { value: "essence", label: "Essence" },
            { value: "diesel", label: "Diesel" },
            { value: "hybride", label: "Hybride" },
            { value: "electrique", label: "Électrique" },
          ],
        },
      ],
    },
    {
      id: "usage",
      letter: "C",
      title: "Utilisation du Véhicule",
      fields: [
        {
          id: "usage_vehicule",
          label: "Usage du véhicule",
          type: "checkbox-group",
          required: true,
          options: [
            { value: "prive", label: "Usage privé" },
            { value: "professionnel", label: "Usage professionnel" },
            { value: "transport_personnel", label: "Transport de personnel" },
            { value: "transport_marchandises", label: "Transport de marchandises" },
            { value: "taxi", label: "Taxi" },
            { value: "vtc", label: "VTC" },
            { value: "auto_ecole", label: "Auto-école" },
            { value: "location", label: "Location" },
          ],
        },
      ],
    },
    {
      id: "valeur",
      letter: "D",
      title: "Valeur du Véhicule",
      fields: [
        {
          id: "tranche_valeur",
          label: "Valeur estimée",
          type: "radio",
          required: true,
          options: [
            { value: "moins_5m", label: "Moins de 5 000 000 FCFA" },
            { value: "5m_10m", label: "Entre 5 000 000 et 10 000 000 FCFA" },
            { value: "10m_20m", label: "Entre 10 000 000 et 20 000 000 FCFA" },
            { value: "plus_20m", label: "Plus de 20 000 000 FCFA" },
          ],
        },
        { id: "valeur_exacte", label: "Valeur exacte (optionnel)", type: "currency", placeholder: "Ex: 8 500 000", required: false, suffix: "FCFA" },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "formule",
          label: "Formule",
          type: "radio",
          required: true,
          options: [
            { value: "rc_simple", label: "Responsabilité Civile simple" },
            { value: "tiers_complet", label: "Tiers Complet" },
            { value: "tous_risques", label: "Tous Risques" },
          ],
        },
        {
          id: "garanties_complementaires",
          label: "Garanties complémentaires",
          type: "checkbox-group",
          required: false,
          options: [
            { value: "defense_recours", label: "Défense et recours" },
            { value: "bris_glace", label: "Bris de glace" },
            { value: "vol", label: "Vol" },
            { value: "incendie", label: "Incendie" },
            { value: "dommages_collision", label: "Dommages collision" },
            { value: "dommages_tous_accidents", label: "Dommages tous accidents" },
            { value: "personnes_transportees", label: "Personnes transportées" },
            { value: "assistance_depannage", label: "Assistance dépannage" },
            { value: "protection_juridique", label: "Protection juridique" },
            { value: "valeur_neuf", label: "Valeur à neuf" },
          ],
        },
      ],
    },
    {
      id: "sinistres",
      letter: "F",
      title: "Antécédents de Sinistres",
      description: "Au cours des 3 dernières années",
      fields: [
        {
          id: "nb_sinistres",
          label: "Nombre de sinistres",
          type: "radio",
          required: true,
          options: [
            { value: "0", label: "Aucun sinistre" },
            { value: "1", label: "1 sinistre" },
            { value: "2", label: "2 sinistres" },
            { value: "3+", label: "Plus de 2 sinistres" },
          ],
        },
        {
          id: "nature_sinistre",
          label: "Nature du sinistre (si applicable)",
          type: "checkbox-group",
          required: false,
          options: [
            { value: "collision", label: "Collision" },
            { value: "vol", label: "Vol" },
            { value: "incendie", label: "Incendie" },
            { value: "bris_glace", label: "Bris de glace" },
            { value: "dommages_materiels", label: "Dommages matériels" },
            { value: "dommages_corporels", label: "Dommages corporels" },
          ],
        },
      ],
    },
    {
      id: "assurance_actuelle",
      letter: "G",
      title: "Assurance Actuelle",
      fields: [
        {
          id: "deja_assure",
          label: "Le véhicule est-il déjà assuré ?",
          type: "radio",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
        { id: "compagnie_actuelle", label: "Compagnie actuelle", type: "text", placeholder: "Nom de la compagnie", required: false },
        { id: "date_echeance", label: "Date d'échéance", type: "date", required: false },
      ],
    },
  ],
  requiredDocuments: [
    { id: "carte_grise", name: "Carte grise", description: "Certificat d'immatriculation du véhicule", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "permis_conduire", name: "Permis de conduire", description: "Permis de conduire du conducteur principal", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, Passeport ou Carte d'identité nationale", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "attestation_precedente", name: "Attestation d'assurance précédente", description: "Si le véhicule était précédemment assuré", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "facture_achat", name: "Facture d'achat", description: "Facture d'acquisition du véhicule (si disponible)", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "photos_vehicule", name: "Photos du véhicule", description: "Photos récentes du véhicule (face, arrière, côtés)", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 10 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — ASSURANCE SANTÉ
// ═════════════════════════════════════════════════════════════════════════════

const SANTE_FORM: InsuranceFormConfig = {
  id: "sante",
  title: "Assurance Santé",
  subtitle: "Fiche de recensement des bénéficiaires",
  icon: "Heart",
  available: false,
  sections: [
    {
      id: "identification",
      letter: "A",
      title: "Identification du Souscripteur",
      fields: [
        { id: "nom", label: "Nom et Prénoms / Raison sociale", type: "text", placeholder: "Ex: KOFFI Jean-Baptiste", required: true, fullWidth: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "adresse", label: "Adresse", type: "text", placeholder: "Quartier, Ville", required: true, fullWidth: true },
        {
          id: "type_souscripteur",
          label: "Type de souscripteur",
          type: "radio",
          required: true,
          options: [
            { value: "particulier", label: "Particulier" },
            { value: "entreprise", label: "Entreprise / Groupe" },
          ],
        },
      ],
    },
    {
      id: "beneficiaires",
      letter: "B",
      title: "Informations sur les Bénéficiaires",
      fields: [
        { id: "effectif", label: "Effectif à assurer", type: "number", placeholder: "Nombre de personnes", required: true, validation: { min: 1 } },
        {
          id: "situation_familiale",
          label: "Situation familiale",
          type: "radio",
          required: true,
          options: [
            { value: "celibataire", label: "Célibataire" },
            { value: "marie", label: "Marié(e)" },
            { value: "marie_enfants", label: "Marié(e) avec enfants" },
            { value: "famille", label: "Famille complète" },
          ],
        },
        {
          id: "categorie_sociopro",
          label: "Catégorie socioprofessionnelle",
          type: "select",
          required: true,
          options: [
            { value: "cadre_sup", label: "Cadre supérieur" },
            { value: "cadre", label: "Cadre" },
            { value: "agent_maitrise", label: "Agent de maîtrise" },
            { value: "employe", label: "Employé" },
            { value: "ouvrier", label: "Ouvrier" },
            { value: "liberal", label: "Profession libérale" },
            { value: "commercant", label: "Commerçant" },
            { value: "etudiant", label: "Étudiant" },
            { value: "retraite", label: "Retraité" },
            { value: "sans_emploi", label: "Sans emploi" },
          ],
        },
      ],
    },
    {
      id: "garanties",
      letter: "C",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_sante",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          options: [
            { value: "consultation", label: "Consultations médicales" },
            { value: "hospitalisation", label: "Hospitalisation" },
            { value: "pharmacie", label: "Pharmacie" },
            { value: "maternite", label: "Maternité" },
            { value: "dentaire", label: "Soins dentaires" },
            { value: "optique", label: "Optique / Lunetterie" },
            { value: "rapatriement", label: "Rapatriement sanitaire" },
            { value: "analyses", label: "Analyses et examens" },
            { value: "chirurgie", label: "Chirurgie" },
            { value: "specialistes", label: "Médecins spécialistes" },
          ],
        },
        {
          id: "niveau_couverture",
          label: "Niveau de couverture souhaité",
          type: "radio",
          required: true,
          options: [
            { value: "essentiel", label: "Essentiel — Couverture de base" },
            { value: "confort", label: "Confort — Couverture intermédiaire" },
            { value: "premium", label: "Premium — Couverture complète" },
          ],
        },
      ],
    },
    {
      id: "historique",
      letter: "D",
      title: "Historique Médical",
      description: "Ces informations sont confidentielles et nécessaires à l'évaluation du risque",
      fields: [
        {
          id: "maladie_chronique",
          label: "Avez-vous une maladie chronique déclarée ?",
          type: "radio",
          required: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "precision_maladie", label: "Si oui, précisez", type: "textarea", placeholder: "Décrivez brièvement...", required: false, fullWidth: true },
        {
          id: "hospitalisation_recente",
          label: "Hospitalisation au cours des 2 dernières années ?",
          type: "radio",
          required: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
      ],
    },
    {
      id: "assurance_actuelle",
      letter: "E",
      title: "Couverture Actuelle",
      fields: [
        {
          id: "couverture_existante",
          label: "Disposez-vous d'une couverture santé actuelle ?",
          type: "radio",
          required: true,
          options: [
            { value: "aucune", label: "Aucune couverture" },
            { value: "amo", label: "AMO (Assurance Maladie Obligatoire)" },
            { value: "complementaire", label: "Complémentaire santé privée" },
            { value: "groupe", label: "Assurance groupe employeur" },
          ],
        },
        { id: "compagnie_actuelle", label: "Compagnie actuelle (si applicable)", type: "text", placeholder: "Nom de la compagnie", required: false },
      ],
    },
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, Passeport ou Carte d'identité nationale", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "certificat_residence", name: "Certificat de résidence", description: "Attestation de résidence récente", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "liste_beneficiaires", name: "Liste nominative des bénéficiaires", description: "Nom, prénom, date de naissance de chaque bénéficiaire", required: true, acceptedFormats: ["pdf", "xlsx"], maxSizeMB: 5 },
    { id: "bulletin_paie", name: "Bulletin de paie", description: "Dernier bulletin de paie (si couverture groupe)", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "certificat_medical", name: "Certificat médical", description: "Certificat médical récent (si requis)", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — ASSURANCE VIE / PRÉVOYANCE
// ═════════════════════════════════════════════════════════════════════════════

const VIE_FORM: InsuranceFormConfig = {
  id: "vie",
  title: "Assurance Vie / Prévoyance",
  subtitle: "Fiche de proposition Assurance Vie",
  icon: "Shield",
  available: true,
  sections: [
    {
      id: "etat_civil",
      letter: "A",
      title: "État Civil",
      fields: [
        { id: "nom", label: "Nom et Prénoms", type: "text", placeholder: "Ex: KOFFI Jean-Baptiste", required: true, fullWidth: true },
        { id: "date_naissance", label: "Date de naissance", type: "date", required: true, validation: { max: new Date().toISOString().split('T')[0] } },
        { id: "lieu_naissance", label: "Lieu de naissance", type: "text", placeholder: "Ville, Pays", required: true },
        { id: "nationalite", label: "Nationalité", type: "text", placeholder: "Ex: Béninoise", required: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "adresse", label: "Adresse", type: "text", placeholder: "Quartier, Ville", required: true, fullWidth: true },
        {
          id: "situation_matrimoniale",
          label: "Situation matrimoniale",
          type: "radio",
          required: true,
          options: [
            { value: "celibataire", label: "Célibataire" },
            { value: "marie", label: "Marié(e)" },
            { value: "divorce", label: "Divorcé(e)" },
            { value: "veuf", label: "Veuf/Veuve" },
          ],
        },
      ],
    },
    {
      id: "profession",
      letter: "B",
      title: "Profession et Revenus",
      fields: [
        { id: "profession", label: "Profession", type: "text", placeholder: "Ex: Ingénieur informatique", required: true },
        { id: "employeur", label: "Employeur / Entreprise", type: "text", placeholder: "Nom de l'entreprise", required: false },
        { id: "revenu_annuel", label: "Revenu annuel estimé", type: "currency", placeholder: "Ex: 6 000 000", required: true, suffix: "FCFA" },
      ],
    },
    {
      id: "assurance_vie",
      letter: "C",
      title: "Paramètres du Contrat",
      fields: [
        {
          id: "type_contrat",
          label: "Type de contrat souhaité",
          type: "radio",
          required: true,
          options: [
            { value: "epargne_retraite", label: "Épargne & Retraite" },
            { value: "capital_deces", label: "Capital Décès" },
            { value: "prevoyance", label: "Prévoyance complète" },
            { value: "education", label: "Assurance Éducation" },
            { value: "obseques", label: "Assurance Obsèques" },
          ],
        },
        { id: "capital_souhaite", label: "Capital souhaité", type: "currency", placeholder: "Ex: 10 000 000", required: true, suffix: "FCFA" },
        { id: "duree_contrat", label: "Durée souhaitée (en années)", type: "number", placeholder: "Ex: 10", required: true, validation: { min: 1, max: 40 } },
        { id: "prime_mensuelle", label: "Prime mensuelle envisagée", type: "currency", placeholder: "Ex: 25 000", required: false, suffix: "FCFA" },
      ],
    },
    {
      id: "beneficiaires",
      letter: "D",
      title: "Bénéficiaires Désignés",
      fields: [
        { id: "beneficiaire_1_nom", label: "Bénéficiaire principal — Nom complet", type: "text", placeholder: "Nom et prénoms", required: true, fullWidth: true },
        { id: "beneficiaire_1_lien", label: "Lien de parenté", type: "text", placeholder: "Ex: Conjoint(e), Enfant", required: true },
        { id: "beneficiaire_1_part", label: "Part (%)", type: "number", placeholder: "Ex: 60", required: true, validation: { min: 1, max: 100 } },
        { id: "beneficiaire_2_nom", label: "Bénéficiaire secondaire — Nom complet (optionnel)", type: "text", placeholder: "Nom et prénoms", required: false, fullWidth: true },
        { id: "beneficiaire_2_lien", label: "Lien de parenté", type: "text", placeholder: "Ex: Enfant, Parent", required: false },
        { id: "beneficiaire_2_part", label: "Part (%)", type: "number", placeholder: "Ex: 40", required: false, validation: { min: 1, max: 100 } },
      ],
    },
    {
      id: "sante",
      letter: "E",
      title: "Questionnaire Médical",
      description: "Informations confidentielles requises par l'assureur",
      fields: [
        {
          id: "etat_sante",
          label: "Êtes-vous actuellement en bonne santé ?",
          type: "radio",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        },
        {
          id: "traitement_cours",
          label: "Suivez-vous actuellement un traitement médical ?",
          type: "radio",
          required: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "precision_traitement", label: "Si oui, précisez", type: "textarea", placeholder: "Nature du traitement...", required: false, fullWidth: true },
        {
          id: "antecedents",
          label: "Antécédents médicaux significatifs",
          type: "checkbox-group",
          required: false,
          options: [
            { value: "diabete", label: "Diabète" },
            { value: "hypertension", label: "Hypertension" },
            { value: "cardiaque", label: "Maladie cardiaque" },
            { value: "cancer", label: "Cancer" },
            { value: "respiratoire", label: "Maladie respiratoire" },
            { value: "aucun", label: "Aucun antécédent" },
          ],
        },
      ],
    },
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, Passeport ou Carte d'identité nationale", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "certificat_residence", name: "Certificat de résidence", description: "Attestation de résidence récente", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "acte_naissance", name: "Acte de naissance", description: "Extrait d'acte de naissance", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "questionnaire_medical", name: "Questionnaire médical signé", description: "Formulaire médical complété et signé par un médecin", required: false, acceptedFormats: ["pdf"], maxSizeMB: 5 },
    { id: "bulletins_paie", name: "Bulletins de paie (3 derniers mois)", description: "Justificatifs de revenus", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — MULTIRISQUE HABITATION
// ═════════════════════════════════════════════════════════════════════════════

const HABITATION_FORM: InsuranceFormConfig = {
  id: "habitation",
  title: "Multirisque Habitation",
  subtitle: "Fiche de risque Habitation",
  icon: "Home",
  available: true,
  sections: [
    {
      id: "identification",
      letter: "A",
      title: "Identification du Souscripteur",
      fields: [
        { id: "nom", label: "Nom et Prénoms / Raison sociale", type: "text", placeholder: "Ex: KOFFI Jean-Baptiste", required: true, fullWidth: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        {
          id: "qualite",
          label: "Qualité",
          type: "radio",
          required: true,
          options: [
            { value: "proprietaire", label: "Propriétaire" },
            { value: "locataire", label: "Locataire" },
            { value: "coproprietaire", label: "Copropriétaire" },
          ],
        },
      ],
    },
    {
      id: "batiment",
      letter: "B",
      title: "Informations sur le Bâtiment",
      fields: [
        { id: "adresse_bien", label: "Adresse du bâtiment", type: "text", placeholder: "Adresse complète", required: true, fullWidth: true },
        { id: "ville", label: "Ville", type: "text", placeholder: "Ex: Cotonou", required: true },
        { id: "quartier", label: "Quartier", type: "text", placeholder: "Ex: Akpakpa", required: true },
        {
          id: "nature_habitation",
          label: "Nature de l'habitation",
          type: "radio",
          required: true,
          options: [
            { value: "villa", label: "Villa" },
            { value: "appartement", label: "Appartement" },
            { value: "maison", label: "Maison individuelle" },
            { value: "duplex", label: "Duplex / Triplex" },
            { value: "immeuble", label: "Immeuble" },
          ],
        },
        { id: "superficie", label: "Superficie", type: "number", placeholder: "En m²", required: true, suffix: "m²", validation: { min: 10 } },
        { id: "nb_pieces", label: "Nombre de pièces", type: "number", placeholder: "Ex: 4", required: true, validation: { min: 1, max: 50 } },
        { id: "annee_construction", label: "Année de construction", type: "number", placeholder: "Ex: 2015", required: false, validation: { min: 1950, max: new Date().getFullYear() } },
        {
          id: "type_construction",
          label: "Type de construction",
          type: "radio",
          required: true,
          options: [
            { value: "dur", label: "Construction en dur (béton)" },
            { value: "semi_dur", label: "Semi-dur" },
            { value: "bois", label: "Bois" },
            { value: "mixte", label: "Mixte" },
          ],
        },
      ],
    },
    {
      id: "valeurs",
      letter: "C",
      title: "Valeurs à Assurer",
      fields: [
        { id: "valeur_batiment", label: "Valeur du bâtiment", type: "currency", placeholder: "Ex: 30 000 000", required: true, suffix: "FCFA" },
        { id: "valeur_contenu", label: "Valeur du contenu (mobilier, équipements)", type: "currency", placeholder: "Ex: 5 000 000", required: true, suffix: "FCFA" },
        { id: "valeur_objets_speciaux", label: "Valeur d'objets de valeur particulière", type: "currency", placeholder: "Bijoux, œuvres d'art...", required: false, suffix: "FCFA", helperText: "Bijoux, œuvres d'art, électronique haut de gamme" },
      ],
    },
    {
      id: "securite",
      letter: "D",
      title: "Mesures de Sécurité",
      fields: [
        {
          id: "mesures_securite",
          label: "Mesures de sécurité en place",
          type: "checkbox-group",
          required: false,
          options: [
            { value: "gardien", label: "Gardien / Vigile" },
            { value: "alarme", label: "Système d'alarme" },
            { value: "camera", label: "Vidéosurveillance" },
            { value: "cloture", label: "Clôture / Mur d'enceinte" },
            { value: "porte_blindee", label: "Porte blindée" },
            { value: "extincteur", label: "Extincteur" },
            { value: "detecteur_fumee", label: "Détecteur de fumée" },
          ],
        },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_habitation",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          options: [
            { value: "incendie", label: "Incendie" },
            { value: "degat_eaux", label: "Dégât des eaux" },
            { value: "vol_effraction", label: "Vol avec effraction" },
            { value: "catastrophes_naturelles", label: "Catastrophes naturelles" },
            { value: "rc_locataire", label: "Responsabilité Civile Locataire" },
            { value: "bris_glace", label: "Bris de glace" },
            { value: "electronique", label: "Appareils électroniques" },
            { value: "rc_chef_famille", label: "RC Chef de famille" },
          ],
        },
      ],
    },
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, Passeport ou Carte d'identité nationale", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "titre_propriete", name: "Titre de propriété / Bail", description: "Titre foncier, certificat de propriété ou contrat de bail", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "plan_localisation", name: "Plan de localisation", description: "Plan ou croquis de localisation du bâtiment", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "photos_batiment", name: "Photos du bâtiment", description: "Photos extérieures et intérieures récentes", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 10 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — ASSURANCE VOYAGE
// ═════════════════════════════════════════════════════════════════════════════

const VOYAGE_FORM: InsuranceFormConfig = {
  id: "voyage",
  title: "Assurance Voyage",
  subtitle: "Fiche Assurance Voyage",
  icon: "Plane",
  available: true,
  sections: [
    {
      id: "identification",
      letter: "A",
      title: "Identification du Voyageur",
      fields: [
        { id: "nom", label: "Nom et Prénoms", type: "text", placeholder: "Exactement comme sur le passeport", required: true, fullWidth: true },
        { id: "date_naissance", label: "Date de naissance", type: "date", required: true, validation: { max: new Date().toISOString().split('T')[0] } },
        { id: "nationalite", label: "Nationalité", type: "text", placeholder: "Ex: Béninoise", required: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "numero_passeport", label: "Numéro de passeport", type: "text", placeholder: "Ex: BJ1234567", required: true },
      ],
    },
    {
      id: "voyage",
      letter: "B",
      title: "Détails du Voyage",
      fields: [
        {
          id: "destination_zone",
          label: "Zone de destination",
          type: "radio",
          required: true,
          options: [
            { value: "afrique", label: "Afrique" },
            { value: "schengen", label: "Espace Schengen" },
            { value: "europe", label: "Europe (hors Schengen)" },
            { value: "amerique", label: "Amérique" },
            { value: "asie", label: "Asie" },
            { value: "mondial", label: "Mondial" },
          ],
        },
        { id: "pays_destination", label: "Pays de destination", type: "text", placeholder: "Ex: France, Belgique", required: true },
        { id: "date_depart", label: "Date de départ", type: "date", required: true },
        { id: "date_retour", label: "Date de retour", type: "date", required: true },
        {
          id: "motif_voyage",
          label: "Motif du voyage",
          type: "radio",
          required: true,
          options: [
            { value: "tourisme", label: "Tourisme / Loisirs" },
            { value: "affaires", label: "Affaires / Professionnel" },
            { value: "etudes", label: "Études" },
            { value: "medical", label: "Soins médicaux" },
            { value: "familial", label: "Visite familiale" },
          ],
        },
        {
          id: "frequence",
          label: "Fréquence de voyage",
          type: "radio",
          required: true,
          options: [
            { value: "unique", label: "Voyage unique" },
            { value: "multi", label: "Multi-voyages (annuel)" },
          ],
        },
      ],
    },
    {
      id: "garanties",
      letter: "C",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_voyage",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          options: [
            { value: "frais_medicaux", label: "Frais médicaux d'urgence" },
            { value: "rapatriement", label: "Rapatriement sanitaire" },
            { value: "assistance_24h", label: "Assistance 24h/7j" },
            { value: "rc_etranger", label: "RC à l'étranger" },
            { value: "annulation", label: "Annulation de voyage" },
            { value: "bagages", label: "Perte / Retard de bagages" },
            { value: "retard_transport", label: "Retard de transport" },
            { value: "protection_juridique", label: "Protection juridique à l'étranger" },
          ],
        },
      ],
    },
    {
      id: "sante",
      letter: "D",
      title: "Informations Médicales",
      fields: [
        {
          id: "probleme_sante",
          label: "Avez-vous un problème de santé particulier ?",
          type: "radio",
          required: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "precision_sante", label: "Si oui, précisez", type: "textarea", placeholder: "Allergies, traitements en cours...", required: false, fullWidth: true },
        { id: "contact_urgence_nom", label: "Contact d'urgence — Nom", type: "text", placeholder: "Nom complet", required: true },
        { id: "contact_urgence_tel", label: "Contact d'urgence — Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
      ],
    },
  ],
  requiredDocuments: [
    { id: "passeport", name: "Passeport", description: "Copie du passeport en cours de validité", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "billet_avion", name: "Billet d'avion / Réservation", description: "Confirmation de réservation de vol", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "photo_identite", name: "Photo d'identité", description: "Photo d'identité récente format passeport", required: true, acceptedFormats: ["jpg", "png"], maxSizeMB: 3 },
    { id: "visa", name: "Visa (si applicable)", description: "Copie du visa obtenu ou en cours", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "reservation_hotel", name: "Réservation d'hébergement", description: "Confirmation d'hôtel ou attestation d'hébergement", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  PHASE 2 — STUBS (Structures prêtes, pas encore de formulaires complets)
// ═════════════════════════════════════════════════════════════════════════════

const PHASE2_STUBS: InsuranceFormConfig[] = [
  { id: "rc", title: "Responsabilité Civile", subtitle: "Fiche RC Générale", icon: "AlertTriangle", available: false, sections: [], requiredDocuments: [] },
  { id: "transport", title: "Assurance Transport", subtitle: "Fiche Transport Facultés", icon: "Truck", available: false, sections: [], requiredDocuments: [] },
  { id: "caution", title: "Assurance Caution", subtitle: "Fiche de demande de caution", icon: "FileCheck", available: false, sections: [], requiredDocuments: [] },
  { id: "trc", title: "Tous Risques Chantier", subtitle: "Fiche de risque Chantier", icon: "HardHat", available: false, sections: [], requiredDocuments: [] },
  { id: "flotte", title: "Assurance Flotte", subtitle: "Fiche Flotte Automobile", icon: "CarFront", available: false, sections: [], requiredDocuments: [] },
  { id: "incendie", title: "Assurance Incendie", subtitle: "Fiche de risque Incendie", icon: "Flame", available: false, sections: [], requiredDocuments: [] },
  { id: "individuelle_accidents", title: "Individuelle Accidents", subtitle: "Fiche Individuelle Accidents", icon: "UserCheck", available: false, sections: [], requiredDocuments: [] },
  { id: "maritime", title: "Assurance Maritime / Aérienne", subtitle: "Fiche Corps Maritime/Aérien", icon: "Ship", available: false, sections: [], requiredDocuments: [] },
  { id: "cyber", title: "Assurance Cyber-risques", subtitle: "Fiche Cyber", icon: "ShieldAlert", available: false, sections: [], requiredDocuments: [] },
  { id: "agricole", title: "Assurance Agricole", subtitle: "Fiche Risques Agricoles", icon: "Wheat", available: false, sections: [], requiredDocuments: [] },
  { id: "multirisque_pro", title: "Multirisque Professionnelle", subtitle: "Fiche de risque Professionnel", icon: "Building2", available: false, sections: [], requiredDocuments: [] },
  { id: "deces_prevoyance", title: "Assurance Décès / Prévoyance", subtitle: "Fiche de souscription Prévoyance", icon: "HeartPulse", available: false, sections: [], requiredDocuments: [] },
];

// ═════════════════════════════════════════════════════════════════════════════
//  REGISTRE GLOBAL — Export principal
// ═════════════════════════════════════════════════════════════════════════════

export const ALL_INSURANCE_FORMS: InsuranceFormConfig[] = [
  AUTOMOBILE_FORM,
  SANTE_FORM,
  VIE_FORM,
  HABITATION_FORM,
  VOYAGE_FORM,
  ...PHASE2_STUBS,
];

/**
 * Retourne la config d'un formulaire par son ID
 */
export function getFormConfigById(id: string): InsuranceFormConfig | undefined {
  return ALL_INSURANCE_FORMS.find((f) => f.id === id);
}

/**
 * Mappe un type d'assurance (ex: "Assurance Auto") vers l'ID du formulaire
 */
const TYPE_TO_FORM_ID: Record<string, string> = {
  "Assurance Auto": "automobile",
  "Assurance Automobile": "automobile",
  "Assurance Moto": "automobile", // Utilise le même formulaire pour l'instant
  "Assurance Santé": "sante",
  "Individuelle Accident": "vie",
  "Assurance Voyage": "voyage",
  "Épargne & Retraite": "vie",
  "Assurance Éducation": "vie",
  "Assurance Obsèques": "vie",
  "Assurance Emprunteur": "vie",
  "Multirisque Habitation": "habitation",
  "Multirisque Professionnelle": "multirisque_pro",
  "Multirisque Pro": "multirisque_pro",
  "Responsabilité Civile": "rc",
  "Assurance Transport": "transport",
  "Assurance Flotte": "flotte",
};

export function getFormConfigByInsuranceType(insuranceType: string): InsuranceFormConfig | undefined {
  const formId = TYPE_TO_FORM_ID[insuranceType];
  if (!formId) return undefined;
  return getFormConfigById(formId);
}

/**
 * Retourne uniquement les formulaires disponibles (Phase 1)
 */
export function getAvailableForms(): InsuranceFormConfig[] {
  return ALL_INSURANCE_FORMS.filter((f) => f.available);
}
