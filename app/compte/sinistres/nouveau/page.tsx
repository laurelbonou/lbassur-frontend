"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Send, ChevronLeft, Calendar, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NouveauSinistre() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchQuotes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const res = await fetch(`${apiUrl}/clients/me/quotes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter out drafts if we only want active contracts
          setQuotes(data.filter((q: any) => q.status !== "DRAFT"));
        }
      } catch (err) {
        console.error("Failed to fetch quotes", err);
      }
    };

    fetchQuotes();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("client_token");
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/clients/me/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quoteRequestId: selectedQuote || undefined,
          incidentDate,
          description
        })
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la déclaration du sinistre");
      }

      router.push("/compte");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-2xl relative z-10">
        <Link 
          href="/compte"
          className="inline-flex items-center gap-2 text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors mb-8"
        >
          <ChevronLeft size={14} /> Retour à mon espace
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
            Déclarer un Sinistre
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Remplissez le formulaire ci-dessous pour nous faire part de votre sinistre.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
              Contrat Concerné (Optionnel)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="text-gray-600" size={16} />
              </div>
              <select
                value={selectedQuote}
                onChange={(e) => setSelectedQuote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white py-3 pl-10 pr-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="" className="bg-black">Je ne sais pas / Autre</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id} className="bg-black">
                    {quote.insuranceType?.replace("-", " ").toUpperCase()} 
                    {quote.policyNumber ? ` - Police: ${quote.policyNumber}` : ` - Réf: ${quote.id.substring(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
              Date du Sinistre <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-600" size={16} />
              </div>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white py-3 pl-10 pr-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
              Description Détaillée <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none resize-none"
              placeholder="Veuillez décrire les circonstances de l'accident ou du sinistre de manière claire et détaillée..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
                Soumettre la déclaration
              </>
            )}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
