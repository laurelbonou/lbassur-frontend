const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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

  uploadDocuments: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/uploads`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload documents");
    return res.json();
  },

  simulatePayment: async (quoteRequestId: string, method: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteRequestId, method }),
    });
    if (!res.ok) throw new Error("Failed to simulate payment");
    return res.json();
  }
};
