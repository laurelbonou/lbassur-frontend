const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0 
  ? process.env.NEXT_PUBLIC_API_URL 
  : "https://lbassur-backend.onrender.com/api/v1";
export const api = {
  getOffers: async (params?: Record<string, string | number | undefined>) => {
    const url = new URL(`${API_BASE_URL}/offers`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch offers");
    return res.json();
  },

  getOffer: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Failed to fetch offer");
    const data = await res.json();
    
    // Workaround: if the deployed backend incorrectly returns an array of TariffRules
    // instead of the base offer object, we fetch it from the offers list.
    if (Array.isArray(data)) {
      const allRes = await api.getOffers();
      const list = Array.isArray(allRes) ? allRes : (allRes.data || []);
      const baseOffer = list.find((o: any) => o.id === id);
      if (baseOffer) return baseOffer;
      throw new Error("Offer not found");
    }
    
    return data;
  },

  getInsurerBySlug: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/insurers/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch insurer");
    return res.json();
  },

  simulateAuto: async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/simulations/auto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to simulate auto");
    return res.json();
  },

  createQuoteRequest: async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create quote request");
    return res.json();
  },

  createDraft: async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/quote-requests/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create draft");
    return res.json();
  },

  updateQuoteRequest: async (id: string, payload: any) => {
    const res = await fetch(`${API_BASE_URL}/quote-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update quote request");
    return res.json();
  },

  uploadDocuments: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/uploads?folder=documents`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload documents");
    return res.json();
  },

  /** Photos et notes vocales de sinistre — rangées dans leur propre dossier. */
  uploadClaimFiles: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/uploads?folder=sinistres`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload claim files");
    return res.json();
  },

  initializePayment: async (quoteRequestId: string, method: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteRequestId, method }),
    });
    if (!res.ok) throw new Error("Failed to initialize payment");
    return res.json();
  },

  // Les routes d'administration ne sont PAS exposees ici. Elles exigent
  // ADMIN_API_KEY, et toute variable NEXT_PUBLIC_ est integree au
  // JavaScript envoye a chaque visiteur : publier cette cle donnerait a
  // n'importe qui l'acces complet a l'API d'administration. L'espace admin
  // les appelle par son propre relais, ou la cle reste cote serveur.

  // --- Broker API ---
  lookupBroker: async (code: string) => {
    const res = await fetch(`${API_BASE_URL}/brokers/lookup/${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error("Broker not found");
    return res.json();
  },
  // --- Recrutement ---

  /** Lit le corps d'erreur du backend pour afficher son message, pas un texte generique. */
  getJobOffers: async () => {
    const res = await fetch(`${API_BASE_URL}/recruitment/offers`);
    if (!res.ok) throw new Error("Impossible de charger les offres d'emploi");
    return res.json();
  },

  getJobOffer: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/recruitment/offers/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Offre introuvable");
    return res.json();
  },

  /**
   * Televerse les fichiers d'une candidature.
   *
   * Passe par la route d'upload existante : la limite de taille et le controle
   * des nombres magiques restent au meme endroit pour tout le site.
   */
  uploadApplicationFiles: async (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch(`${API_BASE_URL}/uploads?folder=candidatures`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(await messageErreur(res, "Echec du televersement"));
    return res.json() as Promise<{ files: UploadedFile[] }>;
  },

  /**
   * Ce que le module de recrutement sait faire selon sa configuration.
   *
   * Interroge avant de promettre quoi que ce soit au candidat : si la
   * preselection assistee n'est pas en service, le formulaire ne doit pas
   * annoncer un pre-remplissage qui n'aura pas lieu.
   */
  getRecruitmentCapabilities: async (): Promise<{ screening: boolean }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/recruitment/capabilities`);
      if (!res.ok) return { screening: false };
      return await res.json();
    } catch {
      return { screening: false };
    }
  },

  /** Propose un profil structure a partir du CV deja televerse. */
  prefillFromCv: async (asset: {
    publicId: string;
    resourceType: string;
    format?: string;
    mimeType: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/recruitment/prefill-from-cv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset),
    });
    if (!res.ok) throw new Error(await messageErreur(res, "Lecture du CV impossible"));
    return res.json();
  },

  applyToJob: async (slug: string, payload: unknown) => {
    const res = await fetch(
      `${API_BASE_URL}/recruitment/offers/${encodeURIComponent(slug)}/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) throw new Error(await messageErreur(res, "Envoi de la candidature impossible"));
    return res.json();
  },

  trackApplication: async (reference: string, email: string) => {
    const res = await fetch(`${API_BASE_URL}/recruitment/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, email }),
    });
    if (!res.ok) throw new Error(await messageErreur(res, "Suivi introuvable"));
    return res.json();
  },
};

export type UploadedFile = {
  originalname: string;
  publicId: string;
  resourceType: string;
  format: string;
  mimeType: string;
  size: number;
  url: string;
};

/**
 * Remonte le message d'erreur du backend plutot qu'un texte generique.
 *
 * Le serveur sait pourquoi il refuse (« vous avez deja postule a cette offre »,
 * « champs obligatoires manquants ») ; le masquer derriere « une erreur est
 * survenue » oblige le candidat a deviner ce qu'il doit corriger.
 */
async function messageErreur(res: Response, defaut: string): Promise<string> {
  try {
    const corps = await res.json();
    const m = corps?.message;
    if (Array.isArray(m)) return m.join(" ");
    if (typeof m === "string") return m;
  } catch {
    /* corps non JSON : on garde le message par defaut */
  }
  return defaut;
}
