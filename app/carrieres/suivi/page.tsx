"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Loader2, AlertCircle, Check, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

type Etape = {
  status: string;
  label: string;
  detail?: string | null;
  createdAt: string;
};

type Suivi = {
  reference: string;
  status: string;
  firstName: string;
  createdAt: string;
  jobOffer: { title: string; slug: string; location: string; contractType: string };
  events: Etape[];
};

/**
 * Ordre d'avancement d'une candidature, pour dessiner la frise.
 *
 * `REJECTED` et `WITHDRAWN` n'y figurent pas : ce sont des fins de parcours,
 * pas des étapes vers l'embauche, et les placer sur la frise laisserait croire
 * qu'il reste quelque chose à attendre.
 */
const PARCOURS = [
  { cle: "RECEIVED", label: "Reçue" },
  { cle: "OPENED", label: "Ouverte" },
  { cle: "UNDER_REVIEW", label: "À l'étude" },
  { cle: "SHORTLISTED", label: "Présélectionnée" },
  { cle: "INTERVIEW", label: "Entretien" },
  { cle: "DECISION", label: "Décision" },
];

export default function SuiviPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [suivi, setSuivi] = useState<Suivi | null>(null);

  async function rechercher(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    setSuivi(null);
    try {
      setSuivi(await api.trackApplication(reference.trim(), email.trim()));
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Recherche impossible.");
    } finally {
      setChargement(false);
    }
  }

  const termine = suivi && ["ACCEPTED", "REJECTED", "WITHDRAWN"].includes(suivi.status);
  const indiceActuel = suivi ? PARCOURS.findIndex((p) => p.cle === suivi.status) : -1;

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/carrieres"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Nos offres
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold uppercase font-oswald mb-5">
            Suivre ma candidature
          </h1>
          <p className="text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
            Saisissez le code de suivi reçu par e-mail, ainsi que l&apos;adresse
            utilisée lors de votre candidature.
          </p>

          <form onSubmit={rechercher} className="border border-white/15 p-6 md:p-8 mb-10">
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                  Code de suivi
                </label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="CAND-2026-00042"
                  required
                  className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {chargement ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {chargement ? "Recherche…" : "Consulter"}
            </button>
          </form>

          {erreur && (
            <div className="flex gap-3 border border-red-500/30 bg-red-500/5 p-5 text-sm text-red-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{erreur}</span>
            </div>
          )}

          {suivi && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-white/15 p-6 md:p-10"
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                {suivi.reference}
              </p>
              <h2 className="text-2xl font-bold mb-1">{suivi.jobOffer.title}</h2>
              <p className="text-sm text-gray-500 mb-10">
                {suivi.jobOffer.location} · Candidature déposée le{" "}
                {new Date(suivi.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Frise */}
              {!termine && (
                <ol className="flex flex-wrap gap-2 mb-12">
                  {PARCOURS.map((p, i) => (
                    <li
                      key={p.cle}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border ${
                        i < indiceActuel
                          ? "border-white/20 text-gray-500"
                          : i === indiceActuel
                            ? "border-white text-white"
                            : "border-white/10 text-gray-700"
                      }`}
                    >
                      {i < indiceActuel ? "✓ " : ""}
                      {p.label}
                    </li>
                  ))}
                </ol>
              )}

              {termine && (
                <div
                  className={`border p-5 mb-12 ${
                    suivi.status === "ACCEPTED"
                      ? "border-white/30 bg-white/5"
                      : "border-white/10"
                  }`}
                >
                  <p className="font-bold mb-1">
                    {suivi.status === "ACCEPTED"
                      ? "Votre candidature a été retenue."
                      : suivi.status === "REJECTED"
                        ? "Votre candidature n'a pas été retenue."
                        : "Candidature retirée."}
                  </p>
                  {suivi.status === "REJECTED" && (
                    <p className="text-sm text-gray-400 font-light">
                      Nous vous remercions de l&apos;intérêt porté à LBASSUR et vous
                      invitons à consulter{" "}
                      <Link href="/carrieres" className="text-white underline">
                        nos autres offres
                      </Link>
                      .
                    </p>
                  )}
                </div>
              )}

              {/* Historique */}
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">
                Historique
              </h3>
              <ol className="space-y-6">
                {suivi.events.map((ev, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full border border-white/25 flex items-center justify-center">
                        <Check size={11} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className="font-medium text-sm">{ev.label}</p>
                      {ev.detail && (
                        <p className="text-sm text-gray-400 font-light mt-1 leading-relaxed whitespace-pre-line">
                          {ev.detail}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1.5">
                        {new Date(ev.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-xs text-gray-600 font-light mt-10 pt-6 border-t border-white/10 leading-relaxed">
                Si un entretien vous est proposé, vous serez prévenu par téléphone et
                par e-mail. Pour toute question : contact@lbassur.bj
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
