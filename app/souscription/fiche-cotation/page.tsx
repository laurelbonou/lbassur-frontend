"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintableForm from "@/components/souscription/PrintableForm";
import { getFormConfigById, getAvailableForms } from "@/lib/insurance-forms";
import type { InsuranceFormConfig } from "@/lib/insurance-forms";
import { ChevronRight, Printer, FileText } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FicheCotationPage() {
  return (
    <Suspense fallback={
      <main className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    }>
      <FicheCotationContent />
    </Suspense>
  );
}

function FicheCotationContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialConfig = typeParam ? getFormConfigById(typeParam) : null;

  const [selectedConfig, setSelectedConfig] = useState<InsuranceFormConfig | null>(
    initialConfig && initialConfig.available ? initialConfig : null
  );

  if (!selectedConfig) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full mb-6 border border-white/10 bg-white/5"
            >
              <span className="text-white font-bold uppercase tracking-[0.4em] text-[9px]">
                Fiches Normalisées
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tighter">
              Fiches de <span className="text-gray-600">Cotation</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-lg mx-auto mb-12">
              Sélectionnez un type d&apos;assurance pour afficher et imprimer la fiche de demande de cotation
              aux normes LBASSUR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {getAvailableForms().map((config) => (
              <button
                key={config.id}
                onClick={() => setSelectedConfig(config)}
                className="bg-[#050505] border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all duration-500 p-6 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white block mb-1">
                      {config.title}
                    </span>
                    <span className="text-[8px] text-gray-500">{config.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 group-hover:text-white transition-colors">
                    <Printer size={14} />
                    <ChevronRight size={14} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl print:pt-0 print:pb-0 print:px-0 print:max-w-none">
        {/* Back nav (hidden on print) */}
        <div className="print:hidden mb-6">
          <button
            onClick={() => setSelectedConfig(null)}
            className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Choisir un autre type
          </button>
        </div>

        <div className="bg-[#050505] border border-white/10 p-6 md:p-10 print:bg-white print:border-0 print:p-0 print:shadow-none">
          <PrintableForm
            config={selectedConfig}
            formData={{}}
            onContinue={() => {}}
            onBack={() => setSelectedConfig(null)}
          />
        </div>

        {/* CTA to online subscription (hidden on print) */}
        <div className="print:hidden mt-8 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Vous préférez remplir le formulaire en ligne ?
          </p>
          <Link
            href={`/souscription?type=${encodeURIComponent(selectedConfig.title)}`}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            <FileText size={14} /> Souscrire en Ligne
          </Link>
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}
