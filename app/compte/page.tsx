"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, FileText, ShieldAlert, Plus, Download, Eye, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CLAIM_STATUS = {
  PENDING: { label: "Reçu", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  PROCESSING: { label: "En traitement", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  RESOLVED: { label: "Clôturé", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  REJECTED: { label: "Rejeté", className: "bg-red-500/10 text-red-400 border-red-500/20" },
} as const;

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"quotes" | "claims" | "profile">("quotes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    const userData = localStorage.getItem("client_user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    // Ouvre directement l'onglet demandé (ex. retour du formulaire de sinistre).
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "claims" || requestedTab === "profile") {
      setActiveTab(requestedTab);
    }

    setUser(JSON.parse(userData));
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
      
      const [quotesRes, claimsRes, reqsRes] = await Promise.all([
        fetch(`${apiUrl}/clients/me/quotes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/clients/me/claims`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/clients/me/change-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (quotesRes.ok) {
        const data = await quotesRes.json();
        setQuotes(data);
      }
      if (claimsRes.ok) {
        const data = await claimsRes.json();
        setClaims(data);
      }
      if (reqsRes.ok) {
        const data = await reqsRes.json();
        setChangeRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold uppercase tracking-tighter"
            >
              Bienvenue, <span className="text-gray-500">{user.fullName || user.phone}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-gray-500 uppercase tracking-widest mt-2"
            >
              Gérez vos contrats et sinistres
            </motion.p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors border border-white/10 hover:border-white/40 px-4 py-2"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("quotes")}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 transition-colors ${
              activeTab === "quotes" 
                ? "bg-white text-black" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileText size={16} /> Mes Dossiers ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 transition-colors whitespace-nowrap ${
              activeTab === "claims"
                ? "bg-white text-black"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldAlert size={16} /> Mes Sinistres ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 transition-colors ${
              activeTab === "profile" 
                ? "bg-white text-black" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldAlert size={16} /> Mon Profil
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "quotes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quotes.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white/5 border border-white/10">
                  <FileText className="mx-auto text-gray-600 mb-4" size={32} />
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6">
                    Vous n'avez aucun dossier d'assurance.
                  </p>
                  <button 
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={14} /> Nouvelle Souscription
                  </button>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div key={quote.id} className="bg-[#050505] border border-white/10 p-6 flex flex-col hover:border-white/30 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white block">
                          {quote.insuranceType?.replace("-", " ")}
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
                          {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest border ${
                        quote.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        quote.status === "DRAFT" ? "bg-gray-500/10 text-gray-400 border-gray-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {quote.status}
                      </span>
                    </div>

                    <div className="mb-6 flex-grow">
                      {quote.policyNumber && (
                        <p className="text-xs text-gray-400 mb-2">
                          <span className="text-gray-600 mr-2">Police:</span> 
                          <span className="text-white font-mono">{quote.policyNumber}</span>
                        </p>
                      )}
                      {quote.budget > 0 && (
                        <p className="text-xs text-gray-400">
                          <span className="text-gray-600 mr-2">Prime:</span> 
                          <span className="text-white">{quote.budget.toLocaleString("fr-FR")} FCFA</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-auto">
                      <button className="text-[9px] text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                        <Eye size={12} /> Détails
                      </button>
                      {quote.status === "COMPLETED" && (
                        <button className="text-[9px] text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                          <Download size={12} /> Attestation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "claims" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Vos Sinistres</h2>
                <button
                  onClick={() => router.push("/compte/sinistres/nouveau")}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  <Plus size={14} /> Déclarer un sinistre
                </button>
              </div>

              {claims.length === 0 ? (
                <div className="py-12 text-center bg-white/5 border border-white/10">
                  <ShieldAlert className="mx-auto text-gray-600 mb-4" size={32} />
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    Vous n'avez déclaré aucun sinistre.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => {
                    const status = CLAIM_STATUS[claim.status as keyof typeof CLAIM_STATUS];
                    return (
                      <div key={claim.id} className="bg-[#050505] border border-white/10 p-6 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                            Sinistre du {new Date(claim.incidentDate).toLocaleDateString("fr-FR")}
                          </h3>
                          <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${status?.className ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                            {status?.label ?? claim.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 max-w-2xl whitespace-pre-line mb-4">
                          {claim.description}
                        </p>

                        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-widest text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> Déclaré le {new Date(claim.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                          {claim.quoteRequest && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              {claim.quoteRequest.insuranceType?.replace("-", " ")}
                              {claim.quoteRequest.policyNumber
                                ? ` — Police ${claim.quoteRequest.policyNumber}`
                                : ` — Réf. ${claim.quoteRequest.id.substring(0, 8)}`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Vos Informations</h2>
                <button 
                  onClick={() => router.push("/compte/profil")}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  <Plus size={14} /> Demander une modification
                </button>
              </div>

              {/* User info display */}
              <div className="bg-[#050505] border border-white/10 p-6 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Nom Complet</span>
                  <span className="text-sm font-bold text-white">{user.fullName || "Non renseigné"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Téléphone</span>
                  <span className="text-sm font-bold text-white">{user.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Email</span>
                  <span className="text-sm font-bold text-white">{user.email || "Non renseigné"}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold uppercase tracking-widest text-white mt-12 mb-6">Historique des demandes</h2>
              {changeRequests.length === 0 ? (
                <div className="py-12 text-center bg-white/5 border border-white/10">
                  <ShieldAlert className="mx-auto text-gray-600 mb-4" size={32} />
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    Vous n'avez soumis aucune demande de modification.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {changeRequests.map((req) => (
                    <div key={req.id} className="bg-[#050505] border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                            Demande du {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                          </h3>
                          <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${
                            req.status === "APPROVED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            req.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-2xl">
                          Changements demandés : {Object.keys(req.requestedData).join(', ')}
                        </p>
                        {req.adminNote && (
                          <p className="text-xs text-red-400 mt-2">Motif : {req.adminNote}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
