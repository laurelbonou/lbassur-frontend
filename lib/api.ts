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
};
