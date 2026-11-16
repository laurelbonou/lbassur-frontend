// ─────────────────────────────────────────────────────────────────────────────
//  LBASSUR — Fiches de cotation des branches professionnelles et spécialisées
//
//  Ce module complète `insurance-forms.ts`, qui porte les cinq branches grand
//  public (auto, santé, vie, habitation, voyage). Les douze fiches ci-dessous
//  étaient jusqu'ici des coquilles vides : titre, icône, `sections: []`. Une
//  branche sans sections est invisible côté client — le visiteur qui comparait
//  une Responsabilité Civile et cliquait sur « Souscrire » était renvoyé au
//  choix du type, où sa branche ne figurait pas.
//
//  Les champs suivent les fiches de cotation usuelles du marché CIMA : ce sont
//  les informations qu'un assureur réclame avant de tarifer. Ils ne remplacent
//  pas les fiches internes de LBASSUR si celles-ci diffèrent — un écart se
//  corrige ici, dans la configuration, sans toucher au rendu.
//
//  Principe retenu pour les champs obligatoires : seul ce sans quoi aucune
//  cotation n'est possible est marqué `required`. Tout le reste est facultatif.
//  Une demande de cotation n'est pas un contrat ; un champ manquant se règle
//  par un appel, tandis qu'un formulaire trop exigeant se solde par un abandon.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  FormSection,
  InsuranceFormConfig,
  RequiredDocument,
} from "./insurance-forms";

// ── Documents communs (entreprises) ──────────────────────────────────────────

export const COMMON_ENTERPRISE_DOCUMENTS: RequiredDocument[] = [
  { id: "rccm", name: "RCCM", description: "Registre du Commerce et du Crédit Mobilier", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  { id: "ifu", name: "IFU", description: "Identifiant Fiscal Unique", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  { id: "statuts", name: "Statuts de l'entreprise", description: "Statuts enregistrés de la société", required: false, acceptedFormats: ["pdf"], maxSizeMB: 10 },
  { id: "etats-financiers", name: "États financiers", description: "Bilans et comptes de résultat des 3 derniers exercices", required: false, acceptedFormats: ["pdf"], maxSizeMB: 15 },
];

// ── Fabriques de sections ────────────────────────────────────────────────────
//
// Huit des douze branches s'adressent à des entreprises et réclament la même
// en-tête d'identification, puis le même relevé de sinistralité. Les écrire
// douze fois, c'est garantir qu'elles divergeront à la première correction.

function sectionEntreprise(letter: string, titre = "Identification du Souscripteur"): FormSection {
  return {
    id: "identification",
    letter,
    title: titre,
    fields: [
      { id: "raison_sociale", label: "Raison sociale", type: "text", placeholder: "Ex: SOBEMAP SA", required: true, fullWidth: true },
      {
        id: "forme_juridique",
        label: "Forme juridique",
        type: "select",
        required: false,
        options: [
          { value: "sa", label: "SA" },
          { value: "sarl", label: "SARL" },
          { value: "sarl_u", label: "SARL unipersonnelle" },
          { value: "sas", label: "SAS" },
          { value: "ets", label: "Établissement / Entreprise individuelle" },
          { value: "gie", label: "GIE" },
          { value: "ong", label: "ONG / Association" },
          { value: "cooperative", label: "Coopérative" },
          { value: "autre", label: "Autre" },
        ],
      },
      { id: "rccm", label: "N° RCCM", type: "text", placeholder: "Ex: RB/COT/21 B 1234", required: false },
      { id: "ifu", label: "N° IFU", type: "text", placeholder: "13 chiffres", required: false },
      { id: "adresse", label: "Adresse du siège", type: "text", placeholder: "Adresse complète", required: true, fullWidth: true },
      { id: "ville", label: "Ville", type: "text", placeholder: "Ex: Cotonou", required: true },
      { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
      { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
      { id: "interlocuteur", label: "Personne à contacter", type: "text", placeholder: "Nom et prénoms", required: false },
      { id: "fonction_interlocuteur", label: "Fonction", type: "text", placeholder: "Ex: Directeur administratif", required: false },
    ],
  };
}

function sectionAntecedents(letter: string, intitule = "Antécédents d'Assurance"): FormSection {
  return {
    id: "antecedents",
    letter,
    title: intitule,
    description: "Ces informations déterminent la prime autant que le risque lui-même. Une déclaration inexacte peut faire tomber la garantie au moment du sinistre (art. 18 et 19 du Code CIMA).",
    fields: [
      {
        id: "deja_assure",
        label: "Risque déjà assuré ?",
        type: "radio",
        required: true,
        options: [
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non, première souscription" },
        ],
      },
      { id: "assureur_actuel", label: "Assureur actuel ou précédent", type: "text", placeholder: "Nom de la compagnie", required: false, showIf: (d) => d.deja_assure === "oui" },
      { id: "prime_actuelle", label: "Prime annuelle actuelle", type: "currency", placeholder: "Ex: 450 000", required: false, suffix: "FCFA", showIf: (d) => d.deja_assure === "oui" },
      { id: "echeance_actuelle", label: "Échéance du contrat en cours", type: "date", required: false, showIf: (d) => d.deja_assure === "oui" },
      {
        id: "sinistres_3ans",
        label: "Sinistres survenus au cours des 3 dernières années",
        type: "radio",
        required: true,
        options: [
          { value: "aucun", label: "Aucun" },
          { value: "1_2", label: "1 à 2 sinistres" },
          { value: "3_plus", label: "3 sinistres ou plus" },
        ],
      },
      { id: "cout_sinistres", label: "Coût cumulé des sinistres", type: "currency", placeholder: "Montant total indemnisé", required: false, suffix: "FCFA", showIf: (d) => d.sinistres_3ans && d.sinistres_3ans !== "aucun" },
      { id: "detail_sinistres", label: "Nature et circonstances des sinistres", type: "textarea", placeholder: "Décrivez brièvement chaque sinistre", required: false, fullWidth: true, showIf: (d) => d.sinistres_3ans && d.sinistres_3ans !== "aucun" },
      {
        id: "resiliation",
        label: "Un assureur a-t-il déjà résilié ou refusé ce risque ?",
        type: "radio",
        required: false,
        options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ],
      },
      { id: "motif_resiliation", label: "Motif", type: "text", placeholder: "Motif invoqué par l'assureur", required: false, fullWidth: true, showIf: (d) => d.resiliation === "oui" },
    ],
  };
}

/** Document de sinistralité, réclamé par tous les assureurs en transfert de portefeuille. */
const DOC_SINISTRALITE: RequiredDocument = {
  id: "attestation_sinistralite",
  name: "Relevé de sinistralité",
  description: "Attestation de l'assureur précédent sur les 3 dernières années (si déjà assuré)",
  required: false,
  acceptedFormats: ["pdf", "jpg", "png"],
  maxSizeMB: 5,
};

// ═════════════════════════════════════════════════════════════════════════════
//  RESPONSABILITÉ CIVILE GÉNÉRALE
// ═════════════════════════════════════════════════════════════════════════════

const RC_FORM: InsuranceFormConfig = {
  id: "rc",
  title: "Responsabilité Civile",
  subtitle: "Fiche de cotation RC Générale",
  icon: "AlertTriangle",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "activite",
      letter: "B",
      title: "Activité Exercée",
      description: "La nature exacte de l'activité commande le tarif : c'est elle qui détermine à qui vous pouvez causer un dommage.",
      fields: [
        {
          id: "secteur",
          label: "Secteur d'activité",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "btp", label: "BTP / Construction" },
            { value: "commerce", label: "Commerce / Distribution" },
            { value: "industrie", label: "Industrie / Production" },
            { value: "services", label: "Services aux entreprises" },
            { value: "hotellerie", label: "Hôtellerie / Restauration" },
            { value: "transport_logistique", label: "Transport / Logistique" },
            { value: "sante", label: "Santé / Professions médicales" },
            { value: "education", label: "Éducation / Formation" },
            { value: "agro", label: "Agroalimentaire" },
            { value: "evenementiel", label: "Événementiel" },
            { value: "immobilier", label: "Immobilier / Gestion locative" },
            { value: "autre", label: "Autre" },
          ],
        },
        { id: "description_activite", label: "Description détaillée de l'activité", type: "textarea", placeholder: "Décrivez précisément ce que fait l'entreprise, les produits ou prestations délivrés", required: true, fullWidth: true },
        { id: "date_creation", label: "Date de création", type: "date", required: false },
        { id: "nb_etablissements", label: "Nombre d'établissements", type: "number", placeholder: "Ex: 3", required: false, validation: { min: 1 } },
        { id: "zone_intervention", label: "Zone d'intervention", type: "select", required: false, options: [
          { value: "benin", label: "Bénin uniquement" },
          { value: "uemoa", label: "Espace UEMOA" },
          { value: "afrique", label: "Afrique" },
          { value: "international", label: "International" },
        ] },
      ],
    },
    {
      id: "exploitation",
      letter: "C",
      title: "Données d'Exploitation",
      fields: [
        { id: "ca_annuel", label: "Chiffre d'affaires du dernier exercice", type: "currency", placeholder: "Ex: 250 000 000", required: true, suffix: "FCFA" },
        { id: "ca_previsionnel", label: "Chiffre d'affaires prévisionnel", type: "currency", placeholder: "Exercice en cours", required: false, suffix: "FCFA" },
        { id: "effectif", label: "Effectif total", type: "number", placeholder: "Nombre de salariés", required: true, validation: { min: 0 } },
        { id: "masse_salariale", label: "Masse salariale annuelle", type: "currency", placeholder: "Ex: 60 000 000", required: false, suffix: "FCFA" },
        {
          id: "recours_sous_traitance",
          label: "Recours à la sous-traitance",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "occasionnel", label: "Occasionnel" },
            { value: "regulier", label: "Régulier" },
          ],
        },
        { id: "part_export", label: "Part du chiffre d'affaires à l'export", type: "number", placeholder: "En %", required: false, suffix: "%", validation: { min: 0, max: 100 } },
      ],
    },
    {
      id: "garanties",
      letter: "D",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_rc",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "rc_exploitation", label: "RC Exploitation (dommages causés pendant l'activité)" },
            { value: "rc_professionnelle", label: "RC Professionnelle (fautes dans la prestation)" },
            { value: "rc_produits", label: "RC Produits livrés / après livraison" },
            { value: "rc_employeur", label: "RC Employeur (faute inexcusable)" },
            { value: "rc_locaux", label: "RC du fait des locaux occupés" },
            { value: "rc_vehicules", label: "RC véhicules des préposés (mission)" },
            { value: "defense_recours", label: "Défense et Recours" },
            { value: "rc_atteinte_environnement", label: "Atteintes accidentelles à l'environnement" },
          ],
        },
        {
          id: "montant_garantie",
          label: "Montant de garantie souhaité par sinistre",
          type: "select",
          required: true,
          options: [
            { value: "10m", label: "10 000 000 FCFA" },
            { value: "25m", label: "25 000 000 FCFA" },
            { value: "50m", label: "50 000 000 FCFA" },
            { value: "100m", label: "100 000 000 FCFA" },
            { value: "250m", label: "250 000 000 FCFA" },
            { value: "500m_plus", label: "500 000 000 FCFA et plus" },
            { value: "a_conseiller", label: "À conseiller par LBASSUR" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("E"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS,
    DOC_SINISTRALITE,
    { id: "plaquette", name: "Plaquette ou présentation de l'activité", description: "Tout document décrivant les prestations ou produits", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  TRANSPORT DE MARCHANDISES (FACULTÉS)
// ═════════════════════════════════════════════════════════════════════════════

const TRANSPORT_FORM: InsuranceFormConfig = {
  id: "transport",
  title: "Assurance Transport",
  subtitle: "Fiche de cotation Transport Facultés",
  icon: "Truck",
  available: true,
  sections: [
    sectionEntreprise("A", "Identification du Souscripteur / Chargeur"),
    {
      id: "marchandise",
      letter: "B",
      title: "Nature des Marchandises",
      fields: [
        { id: "designation", label: "Désignation des marchandises", type: "textarea", placeholder: "Nature précise : riz en sacs, véhicules neufs, équipements électroniques...", required: true, fullWidth: true },
        {
          id: "etat_marchandise",
          label: "État",
          type: "radio",
          required: true,
          options: [
            { value: "neuf", label: "Neuf" },
            { value: "occasion", label: "Occasion" },
            { value: "mixte", label: "Mixte" },
          ],
        },
        {
          id: "emballage",
          label: "Mode d'emballage",
          type: "select",
          required: true,
          options: [
            { value: "conteneur", label: "Conteneur (FCL)" },
            { value: "groupage", label: "Conteneur groupage (LCL)" },
            { value: "caisses", label: "Caisses / Cartons palettisés" },
            { value: "sacs", label: "Sacs" },
            { value: "futs", label: "Fûts / Bidons" },
            { value: "vrac", label: "Vrac" },
            { value: "roulant", label: "Roulant (véhicules, engins)" },
            { value: "sans_emballage", label: "Sans emballage" },
          ],
        },
        { id: "valeur_marchandise", label: "Valeur de la marchandise", type: "currency", placeholder: "Valeur facture", required: true, suffix: "FCFA" },
        { id: "incoterm", label: "Incoterm", type: "select", required: false, options: [
          { value: "exw", label: "EXW" },
          { value: "fob", label: "FOB" },
          { value: "cfr", label: "CFR / CAF" },
          { value: "cif", label: "CIF" },
          { value: "dap", label: "DAP" },
          { value: "ddp", label: "DDP" },
          { value: "autre", label: "Autre / Ne sais pas" },
        ] },
        {
          id: "marchandise_dangereuse",
          label: "Marchandise dangereuse (classée IMDG / ADR)",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
      ],
    },
    {
      id: "voyage",
      letter: "C",
      title: "Le Voyage",
      fields: [
        {
          id: "mode_transport",
          label: "Mode de transport",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "maritime", label: "Maritime" },
            { value: "aerien", label: "Aérien" },
            { value: "routier", label: "Routier" },
            { value: "multimodal", label: "Multimodal" },
          ],
        },
        { id: "lieu_depart", label: "Lieu de départ", type: "text", placeholder: "Port, aéroport ou ville d'origine", required: true },
        { id: "lieu_destination", label: "Lieu de destination", type: "text", placeholder: "Ex: Port de Cotonou, puis Parakou", required: true },
        { id: "transbordement", label: "Transbordement prévu", type: "radio", required: false, options: [
          { value: "non", label: "Non" },
          { value: "oui", label: "Oui" },
        ] },
        { id: "date_expedition", label: "Date d'expédition prévue", type: "date", required: false },
        { id: "transporteur", label: "Transporteur / Compagnie maritime", type: "text", placeholder: "Si connu", required: false },
        { id: "stockage_intermediaire", label: "Stockage intermédiaire prévu", type: "textarea", placeholder: "Lieu et durée d'un éventuel entreposage en cours de route", required: false, fullWidth: true },
      ],
    },
    {
      id: "police",
      letter: "D",
      title: "Type de Police et Garanties",
      fields: [
        {
          id: "type_police",
          label: "Type de police souhaité",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "au_voyage", label: "Police au voyage (expédition unique)" },
            { value: "abonnement", label: "Police d'abonnement (flux réguliers)" },
            { value: "tiers_chargeur", label: "Police tiers-chargeur" },
          ],
        },
        { id: "ca_transporte", label: "Valeur annuelle transportée", type: "currency", placeholder: "Total des expéditions sur 12 mois", required: false, suffix: "FCFA", showIf: (d) => d.type_police === "abonnement", helperText: "Base de calcul de la prime d'abonnement" },
        { id: "nb_expeditions", label: "Nombre d'expéditions par an", type: "number", placeholder: "Ex: 24", required: false, showIf: (d) => d.type_police === "abonnement" },
        {
          id: "etendue_garantie",
          label: "Étendue de garantie",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "tous_risques", label: "Tous risques (clause A)" },
            { value: "fap_sauf", label: "FAP sauf — Franc d'Avarie Particulière sauf événements majeurs (clause C)" },
            { value: "a_conseiller", label: "À conseiller par LBASSUR" },
          ],
        },
        {
          id: "garanties_complementaires",
          label: "Garanties complémentaires",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "guerre_greves", label: "Guerre et grèves" },
            { value: "vol", label: "Vol et disparition" },
            { value: "casse", label: "Casse et bris" },
            { value: "mouille", label: "Mouille et humidité" },
            { value: "frais_sauvetage", label: "Frais de sauvetage et de réexpédition" },
          ],
        },
      ],
    },
    sectionAntecedents("E"),
  ],
  requiredDocuments: [
    { id: "facture_commerciale", name: "Facture commerciale", description: "Facture du fournisseur ou facture pro forma", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "titre_transport", name: "Titre de transport", description: "Connaissement (B/L), LTA ou lettre de voiture", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "liste_colisage", name: "Liste de colisage", description: "Packing list détaillée", required: false, acceptedFormats: ["pdf", "xlsx", "jpg", "png"], maxSizeMB: 10 },
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    DOC_SINISTRALITE,
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  ASSURANCE CAUTION
// ═════════════════════════════════════════════════════════════════════════════

const CAUTION_FORM: InsuranceFormConfig = {
  id: "caution",
  title: "Assurance Caution",
  subtitle: "Fiche de demande de caution",
  icon: "FileCheck",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "marche",
      letter: "B",
      title: "Le Marché Concerné",
      fields: [
        { id: "maitre_ouvrage", label: "Maître d'ouvrage / Bénéficiaire", type: "text", placeholder: "Administration, société ou bailleur", required: true, fullWidth: true },
        { id: "objet_marche", label: "Objet du marché", type: "textarea", placeholder: "Intitulé exact tel qu'il figure au dossier d'appel d'offres", required: true, fullWidth: true },
        { id: "reference_dao", label: "Référence de l'appel d'offres", type: "text", placeholder: "N° du DAO ou du contrat", required: false },
        { id: "montant_marche", label: "Montant du marché", type: "currency", placeholder: "Montant TTC", required: true, suffix: "FCFA" },
        { id: "duree_marche", label: "Durée d'exécution", type: "number", placeholder: "En mois", required: false, suffix: "mois", validation: { min: 1 } },
        { id: "date_demarrage", label: "Date de démarrage prévue", type: "date", required: false },
      ],
    },
    {
      id: "caution_demandee",
      letter: "C",
      title: "Caution Demandée",
      fields: [
        {
          id: "type_caution",
          label: "Type de caution",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "soumission", label: "Caution de soumission (garantie d'offre)" },
            { value: "bonne_execution", label: "Caution de bonne exécution" },
            { value: "avance_demarrage", label: "Caution d'avance de démarrage" },
            { value: "retenue_garantie", label: "Caution de retenue de garantie" },
            { value: "restitution_acompte", label: "Caution de restitution d'acompte" },
            { value: "douane", label: "Caution en douane" },
          ],
        },
        { id: "montant_caution", label: "Montant de la caution", type: "currency", placeholder: "Montant à garantir", required: true, suffix: "FCFA" },
        { id: "duree_caution", label: "Durée de validité demandée", type: "number", placeholder: "En mois", required: false, suffix: "mois", validation: { min: 1 } },
        { id: "date_limite", label: "Date limite de remise", type: "date", required: false, helperText: "La date à laquelle la caution doit être entre vos mains" },
      ],
    },
    {
      id: "situation_financiere",
      letter: "D",
      title: "Situation Financière",
      description: "La caution est un engagement de l'assureur sur vos capacités : ces éléments conditionnent l'accord.",
      fields: [
        { id: "ca_n1", label: "Chiffre d'affaires N-1", type: "currency", placeholder: "Dernier exercice clos", required: true, suffix: "FCFA" },
        { id: "ca_n2", label: "Chiffre d'affaires N-2", type: "currency", placeholder: "Exercice précédent", required: false, suffix: "FCFA" },
        { id: "fonds_propres", label: "Fonds propres", type: "currency", placeholder: "Capitaux propres au dernier bilan", required: false, suffix: "FCFA" },
        { id: "banque_principale", label: "Banque principale", type: "text", placeholder: "Ex: BOA Bénin", required: false },
        { id: "encours_cautions", label: "Encours de cautions en cours", type: "currency", placeholder: "Total des cautions déjà délivrées", required: false, suffix: "FCFA" },
        { id: "nb_marches_similaires", label: "Marchés similaires déjà exécutés", type: "number", placeholder: "Nombre sur les 3 dernières années", required: false, validation: { min: 0 } },
      ],
    },
    {
      id: "antecedents_caution",
      letter: "E",
      title: "Antécédents",
      fields: [
        {
          id: "caution_appelee",
          label: "Une caution vous a-t-elle déjà été appelée ?",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "non", label: "Non, jamais" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "detail_appel", label: "Circonstances", type: "textarea", placeholder: "Marché concerné, montant, motif de l'appel", required: false, fullWidth: true, showIf: (d) => d.caution_appelee === "oui" },
        {
          id: "litige_en_cours",
          label: "Litige ou contentieux en cours",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "detail_litige", label: "Nature du litige", type: "textarea", placeholder: "Objet et état d'avancement", required: false, fullWidth: true, showIf: (d) => d.litige_en_cours === "oui" },
      ],
    },
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.map((d) =>
      d.id === "etats-financiers" ? { ...d, required: true } : d,
    ),
    { id: "dao_contrat", name: "Dossier d'appel d'offres ou contrat", description: "Pièces du marché précisant la caution exigée", required: true, acceptedFormats: ["pdf"], maxSizeMB: 15 },
    { id: "attestation_bancaire", name: "Attestation bancaire", description: "Relevé d'identité bancaire ou attestation de domiciliation", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "attestations_fiscales", name: "Attestations fiscale et sociale", description: "Quitus fiscal et attestation CNSS en cours de validité", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  TOUS RISQUES CHANTIER
// ═════════════════════════════════════════════════════════════════════════════

const TRC_FORM: InsuranceFormConfig = {
  id: "trc",
  title: "Tous Risques Chantier",
  subtitle: "Fiche de cotation Tous Risques Chantier",
  icon: "HardHat",
  available: true,
  sections: [
    {
      id: "intervenants",
      letter: "A",
      title: "Les Intervenants",
      fields: [
        { id: "souscripteur", label: "Souscripteur du contrat", type: "text", placeholder: "Qui paie la prime", required: true, fullWidth: true },
        { id: "maitre_ouvrage", label: "Maître d'ouvrage", type: "text", placeholder: "Propriétaire de l'ouvrage", required: true, fullWidth: true },
        { id: "maitre_oeuvre", label: "Maître d'œuvre", type: "text", placeholder: "Architecte ou bureau d'études", required: false, fullWidth: true },
        { id: "entreprise_principale", label: "Entreprise principale", type: "text", placeholder: "Titulaire du marché de travaux", required: false, fullWidth: true },
        { id: "bureau_controle", label: "Bureau de contrôle technique", type: "text", placeholder: "Si désigné", required: false },
        { id: "telephone", label: "Téléphone du contact", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email du contact", type: "email", placeholder: "contact@exemple.com", required: true },
      ],
    },
    {
      id: "chantier",
      letter: "B",
      title: "Le Chantier",
      fields: [
        {
          id: "nature_travaux",
          label: "Nature des travaux",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "batiment_neuf", label: "Bâtiment neuf" },
            { value: "renovation", label: "Rénovation / Réhabilitation" },
            { value: "extension", label: "Extension / Surélévation" },
            { value: "genie_civil", label: "Génie civil (ouvrage d'art, barrage)" },
            { value: "routier", label: "Travaux routiers / VRD" },
            { value: "hydraulique", label: "Hydraulique / Assainissement" },
            { value: "electrique", label: "Électrification / Réseaux" },
            { value: "industriel", label: "Montage industriel" },
            { value: "autre", label: "Autre" },
          ],
        },
        { id: "description_ouvrage", label: "Description de l'ouvrage", type: "textarea", placeholder: "Nombre de niveaux, surface, destination, techniques employées", required: true, fullWidth: true },
        { id: "adresse_chantier", label: "Adresse du chantier", type: "text", placeholder: "Localisation précise", required: true, fullWidth: true },
        { id: "ville_chantier", label: "Ville / Commune", type: "text", placeholder: "Ex: Abomey-Calavi", required: true },
        { id: "date_debut", label: "Date de démarrage", type: "date", required: true },
        { id: "duree_travaux", label: "Durée des travaux", type: "number", placeholder: "En mois", required: true, suffix: "mois", validation: { min: 1 } },
        { id: "periode_entretien", label: "Période d'entretien / maintenance", type: "number", placeholder: "En mois après réception", required: false, suffix: "mois", validation: { min: 0, max: 24 } },
      ],
    },
    {
      id: "valeurs",
      letter: "C",
      title: "Valeurs à Assurer",
      fields: [
        { id: "montant_marche", label: "Montant du marché de travaux", type: "currency", placeholder: "Montant TTC", required: true, suffix: "FCFA" },
        { id: "fournitures_mo", label: "Fournitures du maître d'ouvrage", type: "currency", placeholder: "Matériaux fournis hors marché", required: false, suffix: "FCFA" },
        { id: "valeur_engins", label: "Valeur des engins et matériel de chantier", type: "currency", placeholder: "Grues, pelles, coffrages", required: false, suffix: "FCFA" },
        { id: "valeur_existants", label: "Valeur des existants", type: "currency", placeholder: "Bâtiments conservés en rénovation", required: false, suffix: "FCFA", helperText: "À renseigner impérativement en rénovation : ce sont les biens du maître d'ouvrage exposés par les travaux." },
        { id: "baraquements", label: "Valeur des baraquements et installations de chantier", type: "currency", placeholder: "Bureaux, magasins, clôtures", required: false, suffix: "FCFA" },
      ],
    },
    {
      id: "environnement",
      letter: "D",
      title: "Environnement du Risque",
      description: "La majorité des sinistres chantier au Bénin viennent de l'eau et du sol : ces réponses pèsent lourd dans la tarification.",
      fields: [
        {
          id: "nature_sol",
          label: "Nature du sol",
          type: "select",
          required: false,
          options: [
            { value: "stable", label: "Sol stable / Latérite" },
            { value: "sableux", label: "Sableux" },
            { value: "argileux", label: "Argileux" },
            { value: "marecageux", label: "Marécageux / Remblai" },
            { value: "rocheux", label: "Rocheux" },
            { value: "inconnu", label: "Non déterminé" },
          ],
        },
        { id: "profondeur_fouilles", label: "Profondeur maximale des fouilles", type: "number", placeholder: "En mètres", required: false, suffix: "m", validation: { min: 0 } },
        {
          id: "proximite_eau",
          label: "Proximité d'un cours d'eau, lagune ou zone inondable",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "moins_100m", label: "Oui, à moins de 100 m" },
            { value: "plus_100m", label: "Oui, au-delà de 100 m" },
          ],
        },
        {
          id: "mitoyennete",
          label: "Bâtiments mitoyens ou avoisinants",
          type: "radio",
          required: false,
          options: [
            { value: "aucun", label: "Aucun" },
            { value: "proches", label: "Oui, immédiatement contigus" },
            { value: "eloignes", label: "Oui, mais à distance" },
          ],
        },
        { id: "gardiennage_chantier", label: "Gardiennage du chantier", type: "radio", required: false, options: [
          { value: "permanent", label: "Permanent (24h/24)" },
          { value: "nuit", label: "De nuit uniquement" },
          { value: "aucun", label: "Aucun" },
        ] },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_trc",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "dommages_ouvrage", label: "Dommages à l'ouvrage en cours de construction" },
            { value: "rc_chantier", label: "RC du fait du chantier (tiers)" },
            { value: "existants", label: "Dommages aux existants" },
            { value: "engins", label: "Engins et matériel de chantier" },
            { value: "effondrement", label: "Effondrement et affaissement" },
            { value: "evenements_naturels", label: "Événements naturels (pluie, vent, inondation)" },
            { value: "vol_chantier", label: "Vol sur chantier" },
            { value: "maintenance", label: "Garantie de maintenance après réception" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("F"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "contrat_marche", name: "Contrat ou marché de travaux", description: "Acte d'engagement et CCAP", required: true, acceptedFormats: ["pdf"], maxSizeMB: 15 },
    { id: "planning", name: "Planning d'exécution", description: "Calendrier prévisionnel des travaux", required: false, acceptedFormats: ["pdf", "xlsx", "jpg", "png"], maxSizeMB: 10 },
    { id: "plans", name: "Plans de l'ouvrage", description: "Plans architecturaux et de structure", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 15 },
    { id: "etude_sol", name: "Étude géotechnique", description: "Rapport d'étude de sol, s'il en existe un", required: false, acceptedFormats: ["pdf"], maxSizeMB: 15 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  FLOTTE AUTOMOBILE
// ═════════════════════════════════════════════════════════════════════════════

const FLOTTE_FORM: InsuranceFormConfig = {
  id: "flotte",
  title: "Assurance Flotte",
  subtitle: "Fiche de cotation Flotte Automobile",
  icon: "CarFront",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "parc",
      letter: "B",
      title: "Composition du Parc",
      description: "Le détail véhicule par véhicule se joint en pièce jointe ; ce tableau sert au pré-chiffrage.",
      fields: [
        { id: "nb_total", label: "Nombre total de véhicules", type: "number", placeholder: "Ex: 18", required: true, validation: { min: 2 }, helperText: "Une flotte se tarife à partir de 2 à 5 véhicules selon l'assureur." },
        { id: "nb_vp", label: "Véhicules de tourisme", type: "number", placeholder: "Berlines, 4x4", required: false, validation: { min: 0 } },
        { id: "nb_utilitaires", label: "Véhicules utilitaires légers", type: "number", placeholder: "Moins de 3,5 t", required: false, validation: { min: 0 } },
        { id: "nb_poids_lourds", label: "Poids lourds", type: "number", placeholder: "Plus de 3,5 t", required: false, validation: { min: 0 } },
        { id: "nb_motos", label: "Deux-roues", type: "number", placeholder: "Motos, tricycles", required: false, validation: { min: 0 } },
        { id: "nb_engins", label: "Engins et matériel roulant", type: "number", placeholder: "Chariots, tracteurs", required: false, validation: { min: 0 } },
        { id: "valeur_parc", label: "Valeur totale du parc", type: "currency", placeholder: "Valeur vénale cumulée", required: true, suffix: "FCFA" },
        { id: "age_moyen", label: "Âge moyen du parc", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 0, max: 50 } },
      ],
    },
    {
      id: "usage",
      letter: "C",
      title: "Usage et Circulation",
      fields: [
        {
          id: "usage_principal",
          label: "Usage principal",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "affaires", label: "Déplacements professionnels" },
            { value: "transport_personnel", label: "Transport du personnel" },
            { value: "livraison", label: "Livraison / Distribution" },
            { value: "transport_public_marchandises", label: "Transport public de marchandises" },
            { value: "transport_public_voyageurs", label: "Transport public de voyageurs" },
            { value: "location", label: "Location de véhicules" },
            { value: "chantier", label: "Desserte de chantiers" },
            { value: "mixte", label: "Usages mixtes" },
          ],
        },
        {
          id: "zone_circulation",
          label: "Zone de circulation",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "urbaine", label: "Urbaine (Cotonou, Porto-Novo)" },
            { value: "nationale", label: "Ensemble du territoire béninois" },
            { value: "cedeao", label: "Espace CEDEAO (carte brune)" },
          ],
        },
        { id: "km_annuel", label: "Kilométrage annuel moyen par véhicule", type: "number", placeholder: "Ex: 25 000", required: false, suffix: "km", validation: { min: 0 } },
        {
          id: "matieres_dangereuses",
          label: "Transport de matières dangereuses",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui (hydrocarbures, gaz, chimie)" },
          ],
        },
        { id: "stationnement_nuit", label: "Stationnement de nuit", type: "select", required: false, options: [
          { value: "parking_clos", label: "Parking clos et gardé" },
          { value: "parking_clos_non_garde", label: "Parking clos non gardé" },
          { value: "voie_publique", label: "Voie publique" },
          { value: "domicile_conducteurs", label: "Au domicile des conducteurs" },
        ] },
      ],
    },
    {
      id: "conducteurs",
      letter: "D",
      title: "Les Conducteurs",
      fields: [
        { id: "nb_conducteurs", label: "Nombre de conducteurs", type: "number", placeholder: "Ex: 22", required: false, validation: { min: 1 } },
        {
          id: "statut_conducteurs",
          label: "Statut des conducteurs",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "salaries", label: "Salariés de l'entreprise uniquement" },
            { value: "mixte", label: "Salariés et prestataires" },
            { value: "tout_conducteur", label: "Tout conducteur autorisé" },
          ],
        },
        { id: "age_minimum", label: "Âge du plus jeune conducteur", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 18, max: 80 } },
        { id: "anciennete_permis_min", label: "Ancienneté minimale de permis", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 0 } },
        { id: "formation_conduite", label: "Formation à la conduite préventive", type: "radio", required: false, options: [
          { value: "oui", label: "Oui, dispensée" },
          { value: "non", label: "Non" },
        ] },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_flotte",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "rc", label: "Responsabilité Civile (obligatoire)" },
            { value: "defense_recours", label: "Défense et Recours" },
            { value: "dommages_collision", label: "Dommages collision" },
            { value: "tous_risques", label: "Tous risques" },
            { value: "vol", label: "Vol" },
            { value: "incendie", label: "Incendie" },
            { value: "bris_glace", label: "Bris de glace" },
            { value: "individuelle_conducteur", label: "Individuelle Conducteur" },
            { value: "assistance", label: "Assistance et dépannage" },
            { value: "marchandises_transportees", label: "Marchandises transportées" },
          ],
        },
        {
          id: "modalite_gestion",
          label: "Modalité de gestion souhaitée",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "police_unique", label: "Police unique avec attestations par véhicule" },
            { value: "par_vehicule", label: "Contrats séparés par véhicule" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("F"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "liste_parc", name: "Liste du parc", description: "Tableau : marque, modèle, immatriculation, année, puissance, valeur, usage", required: true, acceptedFormats: ["xlsx", "pdf"], maxSizeMB: 10 },
    { id: "cartes_grises", name: "Cartes grises", description: "Certificats d'immatriculation des véhicules", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 15 },
    DOC_SINISTRALITE,
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  INCENDIE ET RISQUES ANNEXES
// ═════════════════════════════════════════════════════════════════════════════

const INCENDIE_FORM: InsuranceFormConfig = {
  id: "incendie",
  title: "Assurance Incendie",
  subtitle: "Fiche de risque Incendie et risques annexes",
  icon: "Flame",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "site",
      letter: "B",
      title: "Le Site à Assurer",
      fields: [
        { id: "adresse_site", label: "Adresse du site", type: "text", placeholder: "Localisation précise", required: true, fullWidth: true },
        { id: "ville_site", label: "Ville / Commune", type: "text", placeholder: "Ex: Sèmè-Podji", required: true },
        { id: "activite_site", label: "Activité exercée sur le site", type: "textarea", placeholder: "Production, stockage, bureaux, vente...", required: true, fullWidth: true },
        { id: "surface_batie", label: "Surface bâtie totale", type: "number", placeholder: "En m²", required: true, suffix: "m²", validation: { min: 1 } },
        { id: "nb_batiments", label: "Nombre de bâtiments", type: "number", placeholder: "Ex: 3", required: false, validation: { min: 1 } },
        { id: "nb_niveaux", label: "Nombre de niveaux", type: "number", placeholder: "Rez-de-chaussée compris", required: false, validation: { min: 1 } },
        { id: "annee_construction", label: "Année de construction", type: "number", placeholder: "Ex: 2012", required: false, validation: { min: 1900, max: new Date().getFullYear() } },
        {
          id: "statut_occupation",
          label: "Statut d'occupation",
          type: "radio",
          required: false,
          options: [
            { value: "proprietaire", label: "Propriétaire occupant" },
            { value: "locataire", label: "Locataire" },
            { value: "proprietaire_bailleur", label: "Propriétaire non occupant" },
          ],
        },
      ],
    },
    {
      id: "construction",
      letter: "C",
      title: "Caractéristiques de Construction",
      fields: [
        {
          id: "murs",
          label: "Nature des murs",
          type: "select",
          required: false,
          options: [
            { value: "beton", label: "Béton / Parpaing" },
            { value: "brique", label: "Brique" },
            { value: "metal", label: "Bardage métallique" },
            { value: "bois", label: "Bois" },
            { value: "mixte", label: "Mixte" },
          ],
        },
        {
          id: "charpente",
          label: "Nature de la charpente",
          type: "select",
          required: false,
          options: [
            { value: "beton", label: "Béton armé" },
            { value: "metallique", label: "Métallique" },
            { value: "bois", label: "Bois" },
            { value: "mixte", label: "Mixte" },
          ],
        },
        {
          id: "couverture",
          label: "Nature de la couverture",
          type: "select",
          required: false,
          options: [
            { value: "tole", label: "Tôle" },
            { value: "dalle", label: "Dalle béton" },
            { value: "tuile", label: "Tuile" },
            { value: "fibrociment", label: "Fibrociment" },
            { value: "paille", label: "Paille / Matériaux légers" },
          ],
        },
        {
          id: "mitoyennete",
          label: "Mitoyennetés",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "isole", label: "Bâtiment isolé" },
            { value: "mitoyen_mur", label: "Mitoyen par mur coupe-feu" },
            { value: "mitoyen_simple", label: "Mitoyen sans séparation coupe-feu" },
          ],
        },
        { id: "voisinage_risque", label: "Activités voisines présentant un risque", type: "textarea", placeholder: "Dépôt d'hydrocarbures, menuiserie, friture...", required: false, fullWidth: true },
      ],
    },
    {
      id: "valeurs",
      letter: "D",
      title: "Valeurs à Assurer",
      fields: [
        { id: "valeur_batiments", label: "Valeur des bâtiments", type: "currency", placeholder: "Coût de reconstruction à neuf", required: false, suffix: "FCFA" },
        { id: "valeur_materiel", label: "Valeur du matériel et mobilier", type: "currency", placeholder: "Machines, équipements, mobilier", required: true, suffix: "FCFA" },
        { id: "valeur_marchandises", label: "Valeur des marchandises et stocks", type: "currency", placeholder: "Valeur moyenne en stock", required: false, suffix: "FCFA" },
        { id: "stock_maximum", label: "Valeur maximale du stock dans l'année", type: "currency", placeholder: "Pic de stockage", required: false, suffix: "FCFA", helperText: "Les assureurs tarifent sur le pic, pas sur la moyenne." },
        { id: "perte_exploitation", label: "Marge brute annuelle", type: "currency", placeholder: "Base de la garantie perte d'exploitation", required: false, suffix: "FCFA" },
      ],
    },
    {
      id: "protections",
      letter: "E",
      title: "Moyens de Protection",
      description: "Chaque protection déclarée fait baisser la prime — et devra être constatée lors de la visite de risque.",
      fields: [
        {
          id: "moyens_protection",
          label: "Moyens en place",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "extincteurs", label: "Extincteurs vérifiés annuellement" },
            { value: "ria", label: "Robinets d'incendie armés (RIA)" },
            { value: "sprinkler", label: "Installation sprinkler" },
            { value: "detection_incendie", label: "Détection automatique d'incendie" },
            { value: "alarme", label: "Alarme anti-intrusion" },
            { value: "camera", label: "Vidéosurveillance" },
            { value: "gardiennage", label: "Gardiennage permanent" },
            { value: "paratonnerre", label: "Paratonnerre" },
            { value: "controle_electrique", label: "Contrôle électrique périodique" },
            { value: "consignes", label: "Consignes de sécurité affichées et équipe formée" },
          ],
        },
        { id: "distance_caserne", label: "Distance de la caserne de pompiers la plus proche", type: "number", placeholder: "En kilomètres", required: false, suffix: "km", validation: { min: 0 } },
        {
          id: "point_eau",
          label: "Point d'eau utilisable à proximité",
          type: "radio",
          required: false,
          options: [
            { value: "bouche_incendie", label: "Bouche d'incendie" },
            { value: "reserve", label: "Réserve d'eau sur site" },
            { value: "forage", label: "Forage / Puits" },
            { value: "aucun", label: "Aucun" },
          ],
        },
      ],
    },
    {
      id: "garanties",
      letter: "F",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_incendie",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "incendie_explosion", label: "Incendie et explosion" },
            { value: "foudre", label: "Chute de la foudre" },
            { value: "degats_eaux", label: "Dégâts des eaux" },
            { value: "tempete", label: "Tempête, vents violents, pluies diluviennes" },
            { value: "emeutes", label: "Émeutes et mouvements populaires" },
            { value: "vol", label: "Vol avec effraction" },
            { value: "bris_machine", label: "Bris de machines" },
            { value: "perte_exploitation", label: "Perte d'exploitation" },
            { value: "rc_voisins", label: "Recours des voisins et des tiers" },
            { value: "frais_deblaiement", label: "Frais de déblaiement et de démolition" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("G"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "plan_masse", name: "Plan de masse", description: "Implantation des bâtiments sur le site", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "photos_site", name: "Photos du site", description: "Vues extérieures et intérieures des bâtiments", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 15 },
    { id: "rapport_controle", name: "Rapport de contrôle électrique", description: "Dernier rapport de vérification des installations", required: false, acceptedFormats: ["pdf"], maxSizeMB: 10 },
    { id: "inventaire", name: "Inventaire du matériel", description: "Liste valorisée des équipements à assurer", required: false, acceptedFormats: ["xlsx", "pdf"], maxSizeMB: 10 },
    DOC_SINISTRALITE,
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  INDIVIDUELLE ACCIDENTS
// ═════════════════════════════════════════════════════════════════════════════

const INDIVIDUELLE_ACCIDENTS_FORM: InsuranceFormConfig = {
  id: "individuelle_accidents",
  title: "Individuelle Accidents",
  subtitle: "Fiche de souscription Individuelle Accidents",
  icon: "UserCheck",
  available: true,
  sections: [
    {
      id: "souscripteur",
      letter: "A",
      title: "Identification du Souscripteur",
      fields: [
        {
          id: "type_souscription",
          label: "Type de souscription",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "individuelle", label: "Individuelle (une personne ou une famille)" },
            { value: "groupe", label: "Groupe (salariés, membres d'une association)" },
          ],
        },
        { id: "nom", label: "Nom et prénoms / Raison sociale", type: "text", placeholder: "Ex: ADJOVI Marc ou ONG Vie Nouvelle", required: true, fullWidth: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "adresse", label: "Adresse", type: "text", placeholder: "Quartier, ville", required: false, fullWidth: true },
        { id: "nb_assures", label: "Nombre de personnes à assurer", type: "number", placeholder: "Ex: 45", required: false, validation: { min: 1 }, showIf: (d) => d.type_souscription === "groupe" },
      ],
    },
    {
      id: "assure",
      letter: "B",
      title: "L'Assuré Principal",
      fields: [
        { id: "nom_assure", label: "Nom et prénoms de l'assuré", type: "text", placeholder: "Si différent du souscripteur", required: false, fullWidth: true, showIf: (d) => d.type_souscription === "individuelle" },
        { id: "date_naissance", label: "Date de naissance", type: "date", required: true, showIf: (d) => d.type_souscription === "individuelle" },
        {
          id: "sexe",
          label: "Sexe",
          type: "radio",
          required: false,
          options: [
            { value: "m", label: "Masculin" },
            { value: "f", label: "Féminin" },
          ],
          showIf: (d) => d.type_souscription === "individuelle",
        },
        { id: "profession", label: "Profession exercée", type: "text", placeholder: "Intitulé précis du métier", required: true, fullWidth: true },
        { id: "age_moyen_groupe", label: "Âge moyen du groupe", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 16, max: 75 }, showIf: (d) => d.type_souscription === "groupe" },
        {
          id: "categorie_risque",
          label: "Nature de l'activité professionnelle",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "sedentaire", label: "Sédentaire (bureau, commerce)" },
            { value: "deplacements", label: "Avec déplacements fréquents" },
            { value: "manuelle", label: "Manuelle sans machine dangereuse" },
            { value: "dangereuse", label: "À risque (chantier, hauteur, machines, électricité)" },
          ],
        },
        {
          id: "sports_pratiques",
          label: "Activités à risque pratiquées",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "aucune", label: "Aucune" },
            { value: "moto", label: "Conduite de moto à titre habituel" },
            { value: "sports_collectifs", label: "Sports collectifs en compétition" },
            { value: "sports_combat", label: "Sports de combat" },
            { value: "nautique", label: "Activités nautiques" },
            { value: "chasse", label: "Chasse" },
            { value: "autre", label: "Autre activité à risque" },
          ],
        },
      ],
    },
    {
      id: "capitaux",
      letter: "C",
      title: "Capitaux et Garanties",
      fields: [
        {
          id: "garanties_ia",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "deces_accidentel", label: "Décès accidentel" },
            { value: "ipp", label: "Invalidité Permanente (partielle ou totale)" },
            { value: "frais_medicaux", label: "Frais médicaux, pharmaceutiques et d'hospitalisation" },
            { value: "indemnite_journaliere", label: "Indemnité journalière en cas d'arrêt" },
            { value: "assistance_rapatriement", label: "Assistance et rapatriement" },
            { value: "frais_obseques", label: "Frais funéraires" },
          ],
        },
        { id: "capital_deces", label: "Capital décès souhaité", type: "currency", placeholder: "Ex: 10 000 000", required: false, suffix: "FCFA" },
        { id: "capital_invalidite", label: "Capital invalidité souhaité", type: "currency", placeholder: "Ex: 10 000 000", required: false, suffix: "FCFA" },
        { id: "plafond_frais_medicaux", label: "Plafond de frais médicaux", type: "currency", placeholder: "Ex: 1 000 000", required: false, suffix: "FCFA" },
        { id: "indemnite_jour", label: "Indemnité journalière souhaitée", type: "currency", placeholder: "Montant par jour", required: false, suffix: "FCFA" },
        {
          id: "etendue_couverture",
          label: "Étendue de la couverture",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "24h", label: "24h/24, vie privée et professionnelle" },
            { value: "professionnelle", label: "Activité professionnelle uniquement" },
            { value: "trajet", label: "Trajets domicile-travail inclus" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    {
      id: "sante",
      letter: "D",
      title: "Déclarations de Santé",
      description: "Réponses sincères exigées : le Code CIMA sanctionne la fausse déclaration par la nullité du contrat, même sans lien avec le sinistre.",
      fields: [
        {
          id: "infirmite_existante",
          label: "Infirmité ou invalidité déjà constatée",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "detail_infirmite", label: "Nature et taux d'invalidité", type: "textarea", placeholder: "Précisez", required: false, fullWidth: true, showIf: (d) => d.infirmite_existante === "oui" },
        {
          id: "affection_chronique",
          label: "Affection chronique ou traitement en cours",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "detail_affection", label: "Précisions", type: "textarea", placeholder: "Nature de l'affection et traitement", required: false, fullWidth: true, showIf: (d) => d.affection_chronique === "oui" },
      ],
    },
    sectionAntecedents("E"),
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, passeport ou carte d'identité nationale", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "liste_assures", name: "Liste des assurés", description: "Nom, date de naissance et fonction de chaque personne (souscription groupe)", required: false, acceptedFormats: ["xlsx", "pdf"], maxSizeMB: 10 },
    { id: "attestation_travail", name: "Attestation de travail", description: "Justificatif de la profession déclarée", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  CORPS MARITIME ET AÉRIEN
// ═════════════════════════════════════════════════════════════════════════════

const MARITIME_FORM: InsuranceFormConfig = {
  id: "maritime",
  title: "Assurance Maritime / Aérienne",
  subtitle: "Fiche de cotation Corps Maritime et Aérien",
  icon: "Ship",
  available: true,
  sections: [
    sectionEntreprise("A", "Identification du Propriétaire / Exploitant"),
    {
      id: "bien",
      letter: "B",
      title: "Le Bien à Assurer",
      fields: [
        {
          id: "type_bien",
          label: "Type de bien",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "navire_peche", label: "Navire de pêche" },
            { value: "pirogue", label: "Pirogue motorisée" },
            { value: "vedette", label: "Vedette / Bateau de transport de passagers" },
            { value: "barge", label: "Barge / Chaland" },
            { value: "remorqueur", label: "Remorqueur" },
            { value: "cargo", label: "Navire de charge" },
            { value: "yacht", label: "Yacht / Bateau de plaisance" },
            { value: "aeronef", label: "Aéronef" },
            { value: "helicoptere", label: "Hélicoptère" },
          ],
        },
        { id: "nom_bien", label: "Nom du navire / de l'appareil", type: "text", placeholder: "Nom d'exploitation", required: true },
        { id: "immatriculation", label: "Immatriculation", type: "text", placeholder: "Numéro officiel", required: false },
        { id: "pavillon", label: "Pavillon / Pays d'immatriculation", type: "text", placeholder: "Ex: Bénin", required: false },
        { id: "annee_construction", label: "Année de construction", type: "number", placeholder: "Ex: 2009", required: true, validation: { min: 1940, max: new Date().getFullYear() } },
        { id: "chantier_constructeur", label: "Chantier / Constructeur", type: "text", placeholder: "Nom du constructeur", required: false },
        {
          id: "materiau_coque",
          label: "Matériau de la coque / du fuselage",
          type: "select",
          required: false,
          options: [
            { value: "acier", label: "Acier" },
            { value: "aluminium", label: "Aluminium" },
            { value: "polyester", label: "Polyester / Fibre de verre" },
            { value: "bois", label: "Bois" },
            { value: "composite", label: "Composite" },
          ],
        },
      ],
    },
    {
      id: "caracteristiques",
      letter: "C",
      title: "Caractéristiques Techniques",
      fields: [
        { id: "longueur", label: "Longueur hors tout", type: "number", placeholder: "En mètres", required: false, suffix: "m", validation: { min: 1 } },
        { id: "jauge", label: "Jauge brute / Masse maximale au décollage", type: "number", placeholder: "En tonneaux ou kg", required: false },
        { id: "puissance_moteur", label: "Puissance motrice totale", type: "number", placeholder: "En chevaux", required: false, suffix: "ch", validation: { min: 0 } },
        { id: "nb_moteurs", label: "Nombre de moteurs", type: "number", placeholder: "Ex: 2", required: false, validation: { min: 1 } },
        { id: "capacite_passagers", label: "Capacité en passagers", type: "number", placeholder: "Nombre de places", required: false, validation: { min: 0 } },
        { id: "capacite_fret", label: "Capacité de fret", type: "number", placeholder: "En tonnes", required: false, suffix: "t", validation: { min: 0 } },
      ],
    },
    {
      id: "exploitation",
      letter: "D",
      title: "Conditions d'Exploitation",
      fields: [
        {
          id: "usage",
          label: "Usage",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "peche_artisanale", label: "Pêche artisanale" },
            { value: "peche_industrielle", label: "Pêche industrielle" },
            { value: "transport_passagers", label: "Transport de passagers" },
            { value: "transport_marchandises", label: "Transport de marchandises" },
            { value: "servitude_portuaire", label: "Servitude portuaire" },
            { value: "travaux", label: "Travaux maritimes / Dragage" },
            { value: "plaisance", label: "Plaisance" },
            { value: "aviation_affaires", label: "Aviation d'affaires" },
            { value: "aviation_commerciale", label: "Aviation commerciale" },
          ],
        },
        { id: "zone_navigation", label: "Zone de navigation / d'exploitation", type: "textarea", placeholder: "Ex: eaux territoriales béninoises, lagune de Cotonou, golfe de Guinée", required: true, fullWidth: true },
        { id: "port_attache", label: "Port d'attache / Base", type: "text", placeholder: "Ex: Port autonome de Cotonou", required: false },
        { id: "nb_equipage", label: "Effectif de l'équipage", type: "number", placeholder: "Nombre de personnes à bord", required: false, validation: { min: 0 } },
        {
          id: "periode_exploitation",
          label: "Période d'exploitation",
          type: "radio",
          required: false,
          options: [
            { value: "annuelle", label: "Toute l'année" },
            { value: "saisonniere", label: "Saisonnière" },
          ],
        },
        { id: "hivernage", label: "Lieu de stationnement hors exploitation", type: "text", placeholder: "Quai, hangar, mouillage", required: false, fullWidth: true },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Valeur et Garanties",
      fields: [
        { id: "valeur_agreee", label: "Valeur à assurer", type: "currency", placeholder: "Valeur vénale ou d'expertise", required: true, suffix: "FCFA" },
        {
          id: "garanties_corps",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "corps_tous_risques", label: "Corps tous risques" },
            { value: "perte_totale", label: "Perte totale uniquement" },
            { value: "rc_exploitant", label: "RC de l'exploitant envers les tiers" },
            { value: "rc_passagers", label: "RC passagers transportés" },
            { value: "equipage", label: "Individuelle accident de l'équipage" },
            { value: "pollution", label: "Pollution et frais de retirement d'épave" },
            { value: "assistance_sauvetage", label: "Frais d'assistance et de sauvetage" },
            { value: "machines", label: "Avaries de machines" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("F"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "titre_propriete_navire", name: "Titre de propriété", description: "Acte de francisation, certificat d'immatriculation ou acte de vente", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "certificat_navigabilite", name: "Certificat de navigabilité", description: "Titre de sécurité en cours de validité", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "rapport_expertise", name: "Rapport d'expertise", description: "Expertise de valeur ou visite technique récente", required: false, acceptedFormats: ["pdf"], maxSizeMB: 15 },
    { id: "liste_equipage", name: "Liste de l'équipage", description: "Rôle d'équipage avec qualifications", required: false, acceptedFormats: ["pdf", "xlsx"], maxSizeMB: 5 },
    { id: "photos_navire", name: "Photos du bien", description: "Vues extérieures et de la salle des machines", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 15 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  CYBER-RISQUES
// ═════════════════════════════════════════════════════════════════════════════

const CYBER_FORM: InsuranceFormConfig = {
  id: "cyber",
  title: "Assurance Cyber-risques",
  subtitle: "Fiche de cotation Cyber",
  icon: "ShieldAlert",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "exposition",
      letter: "B",
      title: "Exposition au Risque",
      fields: [
        {
          id: "secteur_cyber",
          label: "Secteur d'activité",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "finance", label: "Banque, microfinance, assurance" },
            { value: "fintech", label: "Fintech / Monnaie électronique" },
            { value: "sante", label: "Santé" },
            { value: "commerce", label: "Commerce et e-commerce" },
            { value: "telecom", label: "Télécommunications" },
            { value: "services_num", label: "Services numériques / SSII" },
            { value: "industrie", label: "Industrie" },
            { value: "public", label: "Secteur public / Parapublic" },
            { value: "autre", label: "Autre" },
          ],
        },
        { id: "ca_annuel", label: "Chiffre d'affaires annuel", type: "currency", placeholder: "Dernier exercice", required: true, suffix: "FCFA" },
        { id: "nb_postes", label: "Nombre de postes de travail", type: "number", placeholder: "Ordinateurs connectés", required: false, validation: { min: 1 } },
        { id: "nb_utilisateurs", label: "Nombre d'utilisateurs du système", type: "number", placeholder: "Comptes actifs", required: false, validation: { min: 1 } },
        {
          id: "donnees_personnelles",
          label: "Données personnelles traitées",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "non", label: "Aucune hors salariés" },
            { value: "clients", label: "Données de clients" },
            { value: "sensibles", label: "Données sensibles (santé, biométrie, bancaire)" },
          ],
        },
        { id: "volume_enregistrements", label: "Nombre d'enregistrements détenus", type: "number", placeholder: "Ordre de grandeur", required: false, helperText: "C'est le volume, plus que le chiffre d'affaires, qui chiffre une fuite de données." },
        {
          id: "paiements_en_ligne",
          label: "Encaissement de paiements en ligne",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "prestataire", label: "Oui, via un prestataire" },
            { value: "interne", label: "Oui, en interne" },
          ],
        },
      ],
    },
    {
      id: "si",
      letter: "C",
      title: "Système d'Information",
      fields: [
        {
          id: "hebergement",
          label: "Hébergement principal",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "interne", label: "Serveurs internes" },
            { value: "cloud", label: "Cloud (AWS, Azure, Google, OVH...)" },
            { value: "mixte", label: "Mixte" },
          ],
        },
        {
          id: "infogerance",
          label: "Infogérance",
          type: "radio",
          required: false,
          options: [
            { value: "interne", label: "Équipe interne" },
            { value: "prestataire", label: "Prestataire externe" },
            { value: "aucune", label: "Aucune" },
          ],
        },
        {
          id: "mesures_securite",
          label: "Mesures de sécurité en place",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "sauvegarde_quotidienne", label: "Sauvegardes quotidiennes" },
            { value: "sauvegarde_hors_ligne", label: "Sauvegardes hors ligne ou immuables" },
            { value: "restauration_testee", label: "Restauration testée dans les 12 derniers mois" },
            { value: "mfa", label: "Double authentification (MFA)" },
            { value: "antivirus", label: "Antivirus / EDR déployé sur tous les postes" },
            { value: "pare_feu", label: "Pare-feu" },
            { value: "mises_a_jour", label: "Mises à jour appliquées régulièrement" },
            { value: "politique_mdp", label: "Politique de mots de passe" },
            { value: "droits_limites", label: "Droits administrateur restreints" },
            { value: "sensibilisation", label: "Sensibilisation du personnel au phishing" },
            { value: "plan_continuite", label: "Plan de continuité ou de reprise d'activité" },
            { value: "chiffrement", label: "Chiffrement des données sensibles" },
          ],
        },
        {
          id: "procedure_virement",
          label: "Procédure de validation des virements",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "double_signature", label: "Double validation systématique" },
            { value: "rappel_telephonique", label: "Rappel téléphonique du bénéficiaire" },
            { value: "aucune", label: "Aucune procédure formalisée" },
          ],
          helperText: "La fraude au faux ordre de virement est le sinistre cyber le plus fréquent dans la sous-région.",
        },
      ],
    },
    {
      id: "garanties",
      letter: "D",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_cyber",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "reconstitution_donnees", label: "Reconstitution des données et remise en état du système" },
            { value: "perte_exploitation", label: "Pertes d'exploitation consécutives" },
            { value: "cyber_rancon", label: "Cyber-rançon" },
            { value: "frais_notification", label: "Frais de notification et de gestion de crise" },
            { value: "rc_donnees", label: "RC liée aux données personnelles" },
            { value: "fraude_virement", label: "Fraude au virement et détournement de fonds" },
            { value: "assistance_experts", label: "Assistance d'experts en réponse à incident" },
            { value: "atteinte_reputation", label: "Frais de restauration d'image" },
          ],
        },
        {
          id: "montant_garantie",
          label: "Montant de garantie souhaité",
          type: "select",
          required: false,
          options: [
            { value: "25m", label: "25 000 000 FCFA" },
            { value: "50m", label: "50 000 000 FCFA" },
            { value: "100m", label: "100 000 000 FCFA" },
            { value: "250m", label: "250 000 000 FCFA" },
            { value: "a_conseiller", label: "À conseiller par LBASSUR" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    {
      id: "antecedents_cyber",
      letter: "E",
      title: "Antécédents",
      fields: [
        {
          id: "incident_3ans",
          label: "Incident de sécurité au cours des 3 dernières années",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "aucun", label: "Aucun" },
            { value: "tentative", label: "Tentatives sans conséquence" },
            { value: "incident", label: "Incident avéré avec impact" },
          ],
        },
        { id: "detail_incident", label: "Nature de l'incident et conséquences", type: "textarea", placeholder: "Rançongiciel, fuite de données, fraude, intrusion...", required: false, fullWidth: true, showIf: (d) => d.incident_3ans === "incident" },
        { id: "cout_incident", label: "Coût de l'incident", type: "currency", placeholder: "Pertes directes et indirectes", required: false, suffix: "FCFA", showIf: (d) => d.incident_3ans === "incident" },
        {
          id: "deja_assure_cyber",
          label: "Déjà couvert par une police cyber",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
      ],
    },
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "politique_ssi", name: "Politique de sécurité informatique", description: "Charte informatique ou politique SSI, si elle existe", required: false, acceptedFormats: ["pdf"], maxSizeMB: 10 },
    { id: "schema_si", name: "Schéma du système d'information", description: "Architecture réseau et serveurs", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "audit_securite", name: "Audit de sécurité", description: "Dernier rapport d'audit ou de test d'intrusion", required: false, acceptedFormats: ["pdf"], maxSizeMB: 15 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  RISQUES AGRICOLES
// ═════════════════════════════════════════════════════════════════════════════

const AGRICOLE_FORM: InsuranceFormConfig = {
  id: "agricole",
  title: "Assurance Agricole",
  subtitle: "Fiche de cotation Risques Agricoles",
  icon: "Wheat",
  available: true,
  sections: [
    {
      id: "exploitant",
      letter: "A",
      title: "Identification de l'Exploitant",
      fields: [
        {
          id: "statut_exploitant",
          label: "Statut",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "individuel", label: "Producteur individuel" },
            { value: "cooperative", label: "Coopérative / Groupement" },
            { value: "societe", label: "Société agricole" },
          ],
        },
        { id: "nom", label: "Nom et prénoms / Dénomination", type: "text", placeholder: "Ex: Coopérative Agricole du Zou", required: true, fullWidth: true },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: false },
        { id: "nb_membres", label: "Nombre de membres", type: "number", placeholder: "Producteurs regroupés", required: false, validation: { min: 1 }, showIf: (d) => d.statut_exploitant === "cooperative" },
        { id: "annees_experience", label: "Ancienneté dans l'activité", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 0 } },
      ],
    },
    {
      id: "exploitation",
      letter: "B",
      title: "L'Exploitation",
      fields: [
        { id: "commune", label: "Commune", type: "text", placeholder: "Ex: Glazoué", required: true },
        { id: "departement", label: "Département", type: "select", required: false, options: [
          { value: "alibori", label: "Alibori" },
          { value: "atacora", label: "Atacora" },
          { value: "atlantique", label: "Atlantique" },
          { value: "borgou", label: "Borgou" },
          { value: "collines", label: "Collines" },
          { value: "couffo", label: "Couffo" },
          { value: "donga", label: "Donga" },
          { value: "littoral", label: "Littoral" },
          { value: "mono", label: "Mono" },
          { value: "oueme", label: "Ouémé" },
          { value: "plateau", label: "Plateau" },
          { value: "zou", label: "Zou" },
        ] },
        {
          id: "type_exploitation",
          label: "Type d'exploitation",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "cultures", label: "Cultures" },
            { value: "elevage", label: "Élevage" },
            { value: "mixte", label: "Cultures et élevage" },
            { value: "aquaculture", label: "Aquaculture / Pisciculture" },
          ],
        },
        { id: "superficie_totale", label: "Superficie exploitée", type: "number", placeholder: "En hectares", required: false, suffix: "ha", validation: { min: 0 } },
        {
          id: "irrigation",
          label: "Mode d'irrigation",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "pluviale", label: "Culture pluviale uniquement" },
            { value: "irrigation_manuelle", label: "Irrigation manuelle" },
            { value: "irrigation_motorisee", label: "Irrigation motorisée / Goutte-à-goutte" },
          ],
        },
        {
          id: "titre_foncier",
          label: "Statut foncier",
          type: "radio",
          required: false,
          options: [
            { value: "titre", label: "Titre foncier" },
            { value: "attestation", label: "Attestation de détention coutumière" },
            { value: "bail", label: "Bail / Location" },
            { value: "autre", label: "Autre" },
          ],
        },
      ],
    },
    {
      id: "productions",
      letter: "C",
      title: "Productions Assurées",
      description: "Les blocs ci-dessous s'adaptent au type d'exploitation déclaré plus haut.",
      fields: [
        {
          id: "cultures_pratiquees",
          label: "Cultures pratiquées",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "coton", label: "Coton" },
            { value: "mais", label: "Maïs" },
            { value: "riz", label: "Riz" },
            { value: "soja", label: "Soja" },
            { value: "anacarde", label: "Anacarde" },
            { value: "ananas", label: "Ananas" },
            { value: "manioc", label: "Manioc" },
            { value: "igname", label: "Igname" },
            { value: "palmier", label: "Palmier à huile" },
            { value: "maraichage", label: "Maraîchage" },
            { value: "autre", label: "Autre" },
          ],
          showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte",
        },
        { id: "superficie_assuree", label: "Superficie à assurer", type: "number", placeholder: "En hectares", required: false, suffix: "ha", validation: { min: 0 }, showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte" },
        { id: "rendement_moyen", label: "Rendement moyen constaté", type: "number", placeholder: "En tonnes par hectare", required: false, suffix: "t/ha", showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte" },
        { id: "valeur_recolte", label: "Valeur attendue de la récolte", type: "currency", placeholder: "Chiffre d'affaires de la campagne", required: false, suffix: "FCFA", showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte" },
        { id: "date_semis", label: "Date de semis prévue", type: "date", required: false, showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte" },
        { id: "date_recolte", label: "Date de récolte prévue", type: "date", required: false, showIf: (d) => d.type_exploitation === "cultures" || d.type_exploitation === "mixte" },
        {
          id: "especes",
          label: "Espèces élevées",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "bovins", label: "Bovins" },
            { value: "ovins_caprins", label: "Ovins / Caprins" },
            { value: "porcins", label: "Porcins" },
            { value: "volailles", label: "Volailles" },
            { value: "poissons", label: "Poissons" },
            { value: "autre", label: "Autre" },
          ],
          showIf: (d) => d.type_exploitation === "elevage" || d.type_exploitation === "mixte" || d.type_exploitation === "aquaculture",
        },
        { id: "effectif_cheptel", label: "Effectif du cheptel", type: "number", placeholder: "Nombre total de têtes", required: false, validation: { min: 0 }, showIf: (d) => d.type_exploitation === "elevage" || d.type_exploitation === "mixte" || d.type_exploitation === "aquaculture" },
        { id: "valeur_cheptel", label: "Valeur du cheptel", type: "currency", placeholder: "Valeur de remplacement", required: false, suffix: "FCFA", showIf: (d) => d.type_exploitation === "elevage" || d.type_exploitation === "mixte" || d.type_exploitation === "aquaculture" },
        {
          id: "mode_elevage",
          label: "Mode d'élevage",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "intensif", label: "Intensif / Hors-sol" },
            { value: "semi_intensif", label: "Semi-intensif" },
            { value: "extensif", label: "Extensif / Transhumance" },
          ],
          showIf: (d) => d.type_exploitation === "elevage" || d.type_exploitation === "mixte",
        },
        {
          id: "suivi_veterinaire",
          label: "Suivi vétérinaire et vaccination",
          type: "radio",
          required: false,
          options: [
            { value: "regulier", label: "Régulier, carnet à jour" },
            { value: "occasionnel", label: "Occasionnel" },
            { value: "aucun", label: "Aucun" },
          ],
          showIf: (d) => d.type_exploitation === "elevage" || d.type_exploitation === "mixte",
        },
      ],
    },
    {
      id: "biens",
      letter: "D",
      title: "Matériel et Bâtiments",
      fields: [
        { id: "valeur_materiel", label: "Valeur du matériel agricole", type: "currency", placeholder: "Tracteurs, motopompes, outillage", required: false, suffix: "FCFA" },
        { id: "valeur_batiments", label: "Valeur des bâtiments agricoles", type: "currency", placeholder: "Magasins, étables, poulaillers", required: false, suffix: "FCFA" },
        { id: "valeur_stocks", label: "Valeur des stocks", type: "currency", placeholder: "Récoltes stockées, intrants", required: false, suffix: "FCFA" },
        { id: "nb_employes", label: "Nombre d'employés agricoles", type: "number", placeholder: "Permanents et saisonniers", required: false, validation: { min: 0 } },
      ],
    },
    {
      id: "garanties",
      letter: "E",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_agricoles",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "secheresse", label: "Sécheresse / Déficit pluviométrique" },
            { value: "inondation", label: "Inondation" },
            { value: "vents_violents", label: "Vents violents et tempête" },
            { value: "incendie_champ", label: "Incendie des cultures et des stocks" },
            { value: "mortalite_betail", label: "Mortalité du bétail" },
            { value: "maladie_epizootie", label: "Maladies et épizooties" },
            { value: "vol_recolte", label: "Vol de récoltes ou d'animaux" },
            { value: "materiel_agricole", label: "Bris de matériel agricole" },
            { value: "rc_exploitant", label: "RC de l'exploitant" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    {
      id: "antecedents_agricoles",
      letter: "F",
      title: "Antécédents",
      fields: [
        {
          id: "pertes_campagnes",
          label: "Pertes subies lors des 3 dernières campagnes",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "aucune", label: "Aucune perte significative" },
            { value: "une", label: "Une campagne touchée" },
            { value: "plusieurs", label: "Plusieurs campagnes touchées" },
          ],
        },
        { id: "nature_pertes", label: "Nature des pertes", type: "textarea", placeholder: "Cause, ampleur, part de la récolte perdue", required: false, fullWidth: true, showIf: (d) => d.pertes_campagnes && d.pertes_campagnes !== "aucune" },
        {
          id: "deja_assure_agricole",
          label: "Exploitation déjà assurée",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
      ],
    },
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité ou RCCM", description: "CIP du producteur, ou RCCM pour une coopérative", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "titre_foncier_doc", name: "Justificatif foncier", description: "Titre foncier, attestation de détention coutumière ou bail", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "carte_producteur", name: "Carte de producteur", description: "Carte professionnelle agricole ou attestation d'appartenance à un groupement", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "factures_materiel", name: "Factures du matériel", description: "Justificatifs de valeur des équipements à assurer", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "photos_exploitation", name: "Photos de l'exploitation", description: "Parcelles, bâtiments, cheptel", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 15 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  MULTIRISQUE PROFESSIONNELLE
// ═════════════════════════════════════════════════════════════════════════════

const MULTIRISQUE_PRO_FORM: InsuranceFormConfig = {
  id: "multirisque_pro",
  title: "Multirisque Professionnelle",
  subtitle: "Fiche de cotation Multirisque Professionnelle",
  icon: "Building2",
  available: true,
  sections: [
    sectionEntreprise("A"),
    {
      id: "activite",
      letter: "B",
      title: "Activité Professionnelle",
      fields: [
        {
          id: "nature_activite",
          label: "Nature de l'activité",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            { value: "bureau", label: "Bureau / Profession libérale" },
            { value: "commerce_detail", label: "Commerce de détail" },
            { value: "commerce_gros", label: "Commerce de gros / Dépôt" },
            { value: "restaurant", label: "Restaurant / Maquis / Bar" },
            { value: "hotel", label: "Hôtel / Résidence" },
            { value: "pharmacie", label: "Pharmacie / Dépôt pharmaceutique" },
            { value: "clinique", label: "Clinique / Cabinet médical" },
            { value: "ecole", label: "École / Centre de formation" },
            { value: "atelier", label: "Atelier / Artisanat" },
            { value: "station", label: "Station-service" },
            { value: "boulangerie", label: "Boulangerie / Pâtisserie" },
            { value: "salon", label: "Salon de coiffure / Institut de beauté" },
            { value: "autre", label: "Autre" },
          ],
        },
        { id: "description_activite", label: "Précisions sur l'activité", type: "textarea", placeholder: "Ce qui est vendu, produit ou servi", required: false, fullWidth: true },
        { id: "date_creation", label: "Date de début d'activité", type: "date", required: false },
        { id: "effectif", label: "Nombre de salariés", type: "number", placeholder: "Ex: 8", required: false, validation: { min: 0 } },
        { id: "ca_annuel", label: "Chiffre d'affaires annuel", type: "currency", placeholder: "Ex: 45 000 000", required: false, suffix: "FCFA" },
        { id: "horaires", label: "Jours et heures d'ouverture", type: "text", placeholder: "Ex: lundi-samedi, 8h-20h", required: false, fullWidth: true },
      ],
    },
    {
      id: "locaux",
      letter: "C",
      title: "Les Locaux",
      fields: [
        { id: "adresse_locaux", label: "Adresse des locaux", type: "text", placeholder: "Localisation précise", required: true, fullWidth: true },
        { id: "ville_locaux", label: "Ville / Quartier", type: "text", placeholder: "Ex: Cotonou, Ganhi", required: true },
        {
          id: "statut_occupation",
          label: "Statut d'occupation",
          type: "radio",
          required: true,
          options: [
            { value: "proprietaire", label: "Propriétaire" },
            { value: "locataire", label: "Locataire" },
          ],
        },
        { id: "surface", label: "Surface des locaux", type: "number", placeholder: "En m²", required: true, suffix: "m²", validation: { min: 1 } },
        { id: "nb_locaux", label: "Nombre de locaux ou d'établissements", type: "number", placeholder: "Ex: 2", required: false, validation: { min: 1 } },
        {
          id: "type_construction",
          label: "Type de construction",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "dur", label: "Dur (béton, parpaing)" },
            { value: "semi_dur", label: "Semi-dur" },
            { value: "conteneur", label: "Conteneur aménagé" },
            { value: "leger", label: "Matériaux légers" },
          ],
        },
        { id: "etage", label: "Niveau occupé", type: "text", placeholder: "Ex: rez-de-chaussée, 2e étage", required: false },
      ],
    },
    {
      id: "valeurs",
      letter: "D",
      title: "Valeurs à Assurer",
      fields: [
        { id: "valeur_batiment", label: "Valeur du bâtiment", type: "currency", placeholder: "Si vous en êtes propriétaire", required: false, suffix: "FCFA", showIf: (d) => d.statut_occupation === "proprietaire" },
        { id: "valeur_amenagements", label: "Valeur des aménagements", type: "currency", placeholder: "Cloisons, faux plafonds, climatisation", required: false, suffix: "FCFA" },
        { id: "valeur_materiel", label: "Valeur du matériel et mobilier", type: "currency", placeholder: "Équipements professionnels", required: true, suffix: "FCFA" },
        { id: "valeur_informatique", label: "Valeur du matériel informatique", type: "currency", placeholder: "Ordinateurs, serveurs, caisses", required: false, suffix: "FCFA" },
        { id: "valeur_marchandises", label: "Valeur des marchandises", type: "currency", placeholder: "Stock moyen", required: false, suffix: "FCFA" },
        { id: "especes_caisse", label: "Espèces détenues en caisse", type: "currency", placeholder: "Montant maximal en journée", required: false, suffix: "FCFA" },
      ],
    },
    {
      id: "protections",
      letter: "E",
      title: "Sécurité des Locaux",
      fields: [
        {
          id: "mesures_securite",
          label: "Moyens de protection",
          type: "checkbox-group",
          required: false,
          fullWidth: true,
          options: [
            { value: "gardien", label: "Gardien / Vigile" },
            { value: "alarme", label: "Système d'alarme" },
            { value: "camera", label: "Vidéosurveillance" },
            { value: "rideau_metallique", label: "Rideau métallique" },
            { value: "porte_blindee", label: "Porte blindée" },
            { value: "barreaux", label: "Barreaux aux ouvertures" },
            { value: "coffre", label: "Coffre-fort scellé" },
            { value: "extincteur", label: "Extincteurs" },
            { value: "detecteur_fumee", label: "Détecteurs de fumée" },
          ],
        },
      ],
    },
    {
      id: "garanties",
      letter: "F",
      title: "Garanties Souhaitées",
      fields: [
        {
          id: "garanties_pro",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "incendie", label: "Incendie, explosion, foudre" },
            { value: "degat_eaux", label: "Dégâts des eaux" },
            { value: "vol", label: "Vol avec effraction et vandalisme" },
            { value: "bris_glace", label: "Bris de glace et d'enseigne" },
            { value: "rc_exploitation", label: "RC Exploitation" },
            { value: "rc_professionnelle", label: "RC Professionnelle" },
            { value: "materiel_informatique", label: "Matériel informatique (tous risques)" },
            { value: "perte_exploitation", label: "Perte d'exploitation" },
            { value: "evenements_naturels", label: "Événements naturels (tempête, inondation)" },
            { value: "emeutes", label: "Émeutes et mouvements populaires" },
            { value: "marchandises_froid", label: "Denrées en chambre froide" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    sectionAntecedents("G"),
  ],
  requiredDocuments: [
    ...COMMON_ENTERPRISE_DOCUMENTS.filter((d) => d.id === "rccm" || d.id === "ifu"),
    { id: "bail_titre", name: "Bail ou titre de propriété", description: "Contrat de bail ou titre foncier des locaux", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "photos_locaux", name: "Photos des locaux", description: "Vues de la devanture et de l'intérieur", required: false, acceptedFormats: ["jpg", "png"], maxSizeMB: 15 },
    { id: "inventaire_materiel", name: "Inventaire du matériel", description: "Liste valorisée des équipements et du stock", required: false, acceptedFormats: ["xlsx", "pdf"], maxSizeMB: 10 },
    DOC_SINISTRALITE,
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  DÉCÈS / PRÉVOYANCE
// ═════════════════════════════════════════════════════════════════════════════

const DECES_PREVOYANCE_FORM: InsuranceFormConfig = {
  id: "deces_prevoyance",
  title: "Assurance Décès / Prévoyance",
  subtitle: "Fiche de souscription Prévoyance",
  icon: "HeartPulse",
  available: true,
  sections: [
    {
      id: "adherent",
      letter: "A",
      title: "Identification de l'Adhérent",
      fields: [
        {
          id: "type_contrat",
          label: "Type de contrat",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "individuel", label: "Individuel" },
            { value: "groupe", label: "Groupe (entreprise, association)" },
          ],
        },
        { id: "nom", label: "Nom et prénoms / Raison sociale", type: "text", placeholder: "Ex: HOUNKPATIN Chantal", required: true, fullWidth: true },
        { id: "date_naissance", label: "Date de naissance", type: "date", required: true, showIf: (d) => d.type_contrat === "individuel", helperText: "L'âge à l'adhésion détermine la prime pour toute la durée du contrat." },
        {
          id: "sexe",
          label: "Sexe",
          type: "radio",
          required: false,
          options: [
            { value: "m", label: "Masculin" },
            { value: "f", label: "Féminin" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        {
          id: "situation_familiale",
          label: "Situation familiale",
          type: "select",
          required: false,
          options: [
            { value: "celibataire", label: "Célibataire" },
            { value: "marie", label: "Marié(e)" },
            { value: "divorce", label: "Divorcé(e)" },
            { value: "veuf", label: "Veuf / Veuve" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        { id: "nb_enfants", label: "Nombre d'enfants à charge", type: "number", placeholder: "Ex: 3", required: false, validation: { min: 0 }, showIf: (d) => d.type_contrat === "individuel" },
        { id: "profession", label: "Profession", type: "text", placeholder: "Intitulé précis", required: true, fullWidth: true },
        { id: "nb_adherents", label: "Nombre d'adhérents", type: "number", placeholder: "Effectif à couvrir", required: false, validation: { min: 1 }, showIf: (d) => d.type_contrat === "groupe" },
        { id: "age_moyen", label: "Âge moyen du groupe", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 18, max: 70 }, showIf: (d) => d.type_contrat === "groupe" },
        { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+229 XX XX XX XX", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "contact@exemple.com", required: true },
        { id: "adresse", label: "Adresse", type: "text", placeholder: "Quartier, ville", required: false, fullWidth: true },
      ],
    },
    {
      id: "garanties",
      letter: "B",
      title: "Garanties et Capitaux",
      fields: [
        {
          id: "garanties_prevoyance",
          label: "Garanties souhaitées",
          type: "checkbox-group",
          required: true,
          fullWidth: true,
          options: [
            { value: "deces_toutes_causes", label: "Décès toutes causes" },
            { value: "deces_accidentel", label: "Capital doublé en cas de décès accidentel" },
            { value: "ptia", label: "Perte Totale et Irréversible d'Autonomie" },
            { value: "invalidite", label: "Invalidité permanente" },
            { value: "rente_education", label: "Rente éducation pour les enfants" },
            { value: "rente_conjoint", label: "Rente de conjoint survivant" },
            { value: "frais_obseques", label: "Frais funéraires" },
            { value: "exoneration_primes", label: "Exonération des primes en cas d'incapacité" },
          ],
        },
        { id: "capital_deces", label: "Capital décès souhaité", type: "currency", placeholder: "Ex: 20 000 000", required: true, suffix: "FCFA" },
        { id: "capital_obseques", label: "Capital frais funéraires", type: "currency", placeholder: "Ex: 1 500 000", required: false, suffix: "FCFA" },
        { id: "duree_contrat", label: "Durée du contrat", type: "number", placeholder: "En années", required: false, suffix: "ans", validation: { min: 1, max: 40 } },
        {
          id: "periodicite_prime",
          label: "Périodicité de paiement",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "mensuelle", label: "Mensuelle" },
            { value: "trimestrielle", label: "Trimestrielle" },
            { value: "semestrielle", label: "Semestrielle" },
            { value: "annuelle", label: "Annuelle" },
          ],
        },
        { id: "date_effet", label: "Date d'effet souhaitée", type: "date", required: false },
      ],
    },
    {
      id: "beneficiaires",
      letter: "C",
      title: "Bénéficiaires",
      description: "À défaut de désignation, le capital revient aux héritiers selon la dévolution successorale — ce qui est rarement ce que souhaite l'assuré.",
      fields: [
        {
          id: "clause_beneficiaire",
          label: "Clause bénéficiaire",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "standard", label: "Clause type : le conjoint, à défaut les enfants, à défaut les héritiers" },
            { value: "nominative", label: "Désignation nominative" },
          ],
        },
        { id: "beneficiaires_nommes", label: "Bénéficiaires désignés", type: "textarea", placeholder: "Nom, prénoms, date de naissance, lien de parenté et part attribuée à chacun", required: false, fullWidth: true, showIf: (d) => d.clause_beneficiaire === "nominative" },
      ],
    },
    {
      id: "sante",
      letter: "D",
      title: "État de Santé et Mode de Vie",
      description: "Ces déclarations engagent l'assuré. Une inexactitude intentionnelle entraîne la nullité du contrat et la perte des primes versées (art. 18 du Code CIMA).",
      fields: [
        { id: "taille", label: "Taille", type: "number", placeholder: "En centimètres", required: false, suffix: "cm", validation: { min: 100, max: 250 }, showIf: (d) => d.type_contrat === "individuel" },
        { id: "poids", label: "Poids", type: "number", placeholder: "En kilogrammes", required: false, suffix: "kg", validation: { min: 30, max: 300 }, showIf: (d) => d.type_contrat === "individuel" },
        {
          id: "fumeur",
          label: "Consommation de tabac",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non-fumeur" },
            { value: "oui", label: "Fumeur" },
            { value: "ancien", label: "Ancien fumeur (arrêt depuis plus de 2 ans)" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        {
          id: "affection_en_cours",
          label: "Affection ou traitement médical en cours",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        { id: "detail_affection", label: "Nature de l'affection et du traitement", type: "textarea", placeholder: "Ces informations restent confidentielles et ne sont transmises qu'au médecin-conseil de l'assureur", required: false, fullWidth: true, showIf: (d) => d.affection_en_cours === "oui" },
        {
          id: "hospitalisation_5ans",
          label: "Hospitalisation ou intervention chirurgicale dans les 5 dernières années",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        { id: "detail_hospitalisation", label: "Motif et date", type: "textarea", placeholder: "Précisez", required: false, fullWidth: true, showIf: (d) => d.hospitalisation_5ans === "oui" },
        {
          id: "arret_travail",
          label: "Arrêt de travail de plus de 30 jours dans les 3 dernières années",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
          showIf: (d) => d.type_contrat === "individuel",
        },
        {
          id: "activite_risque",
          label: "Profession ou loisir à risque particulier",
          type: "radio",
          required: false,
          fullWidth: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui (travail en hauteur, manipulation d'explosifs, plongée, aviation...)" },
          ],
        },
        { id: "detail_activite_risque", label: "Précisez", type: "text", placeholder: "Nature de l'activité", required: false, fullWidth: true, showIf: (d) => d.activite_risque === "oui" },
        { id: "deplacements_etranger", label: "Séjours prolongés à l'étranger prévus", type: "text", placeholder: "Pays et durée, le cas échéant", required: false, fullWidth: true },
      ],
    },
    {
      id: "antecedents_assurance",
      letter: "E",
      title: "Antécédents d'Assurance",
      fields: [
        {
          id: "refus_surprime",
          label: "Un assureur a-t-il déjà refusé, ajourné ou majoré une couverture vous concernant ?",
          type: "radio",
          required: true,
          fullWidth: true,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "detail_refus", label: "Motif invoqué", type: "textarea", placeholder: "Compagnie, année et motif", required: false, fullWidth: true, showIf: (d) => d.refus_surprime === "oui" },
        {
          id: "autres_contrats",
          label: "Autres contrats de prévoyance en cours",
          type: "radio",
          required: false,
          options: [
            { value: "non", label: "Non" },
            { value: "oui", label: "Oui" },
          ],
        },
        { id: "capitaux_cumules", label: "Capitaux déjà garantis ailleurs", type: "currency", placeholder: "Total des capitaux décès souscrits", required: false, suffix: "FCFA", showIf: (d) => d.autres_contrats === "oui" },
      ],
    },
  ],
  requiredDocuments: [
    { id: "piece_identite", name: "Pièce d'identité", description: "CIP, passeport ou carte d'identité nationale en cours de validité", required: true, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
    { id: "liste_adherents", name: "Liste des adhérents", description: "Nom, date de naissance, fonction et salaire de chaque personne (contrat groupe)", required: false, acceptedFormats: ["xlsx", "pdf"], maxSizeMB: 10 },
    { id: "bilan_sante", name: "Bilan de santé récent", description: "Dernier bilan médical, s'il en existe un", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 10 },
    { id: "acte_naissance", name: "Acte de naissance", description: "Acte de naissance de l'assuré et des bénéficiaires désignés", required: false, acceptedFormats: ["pdf", "jpg", "png"], maxSizeMB: 5 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  REGISTRE
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Ordre d'affichage : les branches les plus demandées d'abord. C'est cette
 * liste qui alimente la grille de choix du parcours de souscription.
 */
export const PROFESSIONAL_FORMS: InsuranceFormConfig[] = [
  RC_FORM,
  MULTIRISQUE_PRO_FORM,
  FLOTTE_FORM,
  TRANSPORT_FORM,
  INCENDIE_FORM,
  CAUTION_FORM,
  TRC_FORM,
  INDIVIDUELLE_ACCIDENTS_FORM,
  DECES_PREVOYANCE_FORM,
  AGRICOLE_FORM,
  MARITIME_FORM,
  CYBER_FORM,
];
