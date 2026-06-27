export type InsuranceCategory = "IARDT" | "PERSONNES" | "VIE";

export interface Guarantee {
    id: string;
    name: string;
    included: boolean;
    description?: string;
}

export interface InsuranceOffer {
    id: string;
    category: InsuranceCategory;
    insuranceType: string;
    insuranceSubType?: string; // e.g. "Véhicules et Mobilité" | "Biens et Activité"
    insurer: string;
    insurerSlug: string;
    insurerLogoUrl?: string;
    premium: number; // Annuelle ou Mensuelle selon le cas
    rate?: number; // Pour l'assurance Vie par exemple
    coverageAmount: number;
    franchise: number;
    guarantees: string[];
    optionalGuarantees: string[];
    exclusions: string[];
    duration: string;
    waitingPeriod: string;
    terms: string;
    rating: number; // Scoring de 1 à 5
    isMandatory?: boolean; // Obligatoire légalement
    tag?: string; // "Populaire", "Top Choix", "Recommandé"
}

export interface Insurer {
    id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    categories: InsuranceCategory[];
    website: string;
}

export interface InsuranceTypeInfo {
    id: string;
    label: string;
    description: string;
    icon: string;
    subTypes?: string[];
}
