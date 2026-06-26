"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Check, FileText, CreditCard, Edit3, ChevronRight } from "lucide-react";
import type { InsuranceFormConfig } from "@/lib/insurance-forms";
import SignaturePad from "./SignaturePad";

interface SubscriptionSummaryProps {
  config: InsuranceFormConfig;
  formData: Record<string, unknown>;
  uploadedFilesCount: number;
  selectedOffer: {
    insurer: string;
    price: number;
    guarantees: string;
    type: string;
  } | null;
  onProceedToPayment: (signature: string | null) => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
}

export default function SubscriptionSummary({
  config,
  formData,
  uploadedFilesCount,
  selectedOffer,
  onProceedToPayment,
  onBack,
  onEditStep,
}: SubscriptionSummaryProps) {
  const getFieldLabel = (fieldId: string): string => {
    for (const section of config.sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  const getFieldDisplayValue = (fieldId: string, value: unknown): string => {
    for (const section of config.sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) {
        if (field.type === "radio" && field.options) {
          const opt = field.options.find((o) => o.value === value);
          return opt?.label || String(value);
        }
        if (field.type === "checkbox-group" && Array.isArray(value) && field.options) {
          return (value as string[])
            .map((v) => field.options?.find((o) => o.value === v)?.label || v)
            .join(", ");
        }
        if (field.suffix && value) {
          return `${value} ${field.suffix}`;
        }
      }
    }
    return String(value || "—");
  };

  // Only show key fields from first 3 sections to keep summary concise
  const keyFields = config.sections.slice(0, 3).flatMap((section) =>
    section.fields
      .filter((field) => {
        const val = formData[field.id];
        if (!val) return false;
        if (Array.isArray(val) && val.length === 0) return false;
        return true;
      })
      .map((field) => ({
        label: field.label,
        value: getFieldDisplayValue(field.id, formData[field.id]),
      }))
  );

  // Signature State
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState(false);

  const handleProceed = () => {
    if (!signature) {
      setSignatureError(true);
      return;
    }
    onProceedToPayment(signature);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <FileText className="text-gray-400" size={20} />
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white">
            Récapitulatif
          </h2>
          <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
            Vérifiez vos informations et signez avant de procéder au paiement
          </p>
        </div>
      </div>

      {/* Offer Card */}
      {selectedOffer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/20 p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-white" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white text-black rounded-sm flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">
                  {selectedOffer.insurer}
                </p>
                <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">
                  {selectedOffer.type}
                </p>
                <p className="text-[8px] text-gray-500 mt-0.5 max-w-sm truncate">
                  {selectedOffer.guarantees}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white tabular-nums">
                {selectedOffer.price.toLocaleString("fr-FR")}
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                F.CFA
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Informations personnelles */}
        <SummaryCard
          title="Fiche de cotation"
          subtitle={config.title}
          icon={<FileText size={16} />}
          onEdit={() => onEditStep(1)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyFields.slice(0, 8).map((field, i) => (
              <div key={i}>
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block">
                  {field.label}
                </span>
                <span className="text-xs text-white">{field.value}</span>
              </div>
            ))}
          </div>
          {keyFields.length > 8 && (
            <p className="text-[8px] text-gray-500 mt-3 uppercase tracking-wider">
              + {keyFields.length - 8} autres informations renseignées
            </p>
          )}
        </SummaryCard>

        {/* Documents */}
        <SummaryCard
          title="Pièces justificatives"
          subtitle={`${uploadedFilesCount} document${uploadedFilesCount > 1 ? "s" : ""} fourni${uploadedFilesCount > 1 ? "s" : ""}`}
          icon={<FileText size={16} />}
          onEdit={() => onEditStep(2)}
        >
          <div className="flex items-center gap-2">
            <Check size={14} className="text-white" />
            <span className="text-xs text-gray-300">
              {uploadedFilesCount} document{uploadedFilesCount > 1 ? "s" : ""} téléchargé{uploadedFilesCount > 1 ? "s" : ""}
              {" "}sur {config.requiredDocuments.length} requis
            </span>
          </div>
        </SummaryCard>
      </div>

      {/* Signature Section */}
      <div className="bg-white/[0.02] border border-white/10 p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white block">
              Signature Électronique
            </span>
            <span className="text-[8px] text-gray-500">Obligatoire pour valider le contrat d'assurance</span>
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${signatureError ? "ring-2 ring-red-500 rounded-xl" : ""}`}>
          <SignaturePad 
            onSignatureChange={(sig) => {
              setSignature(sig);
              if (sig) setSignatureError(false);
            }} 
          />
        </div>
        {signatureError && (
          <p className="text-red-500 text-xs mt-2 font-medium">Veuillez signer ci-dessus avant de procéder au paiement.</p>
        )}
      </div>

      {/* Legal Notice */}
      <div className="bg-white/[0.02] border border-white/10 p-5">
        <p className="text-[8px] text-gray-500 leading-relaxed uppercase tracking-wider">
          En poursuivant, vous acceptez les conditions générales de LBASSUR et certifiez l&apos;exactitude des informations
          fournies. Conformément au Code CIMA, toute fausse déclaration pourrait entraîner la nullité du contrat.
          Vos données personnelles sont traitées conformément à la réglementation en vigueur.
        </p>
      </div>

      {/* Paiement CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
            <CreditCard size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white">
              Prêt pour le paiement
            </p>
            <p className="text-[8px] text-gray-400 mt-0.5">
              Mobile Money · Carte Visa/Mastercard
            </p>
          </div>
        </div>
        {selectedOffer && (
          <div className="text-right">
            <span className="text-3xl font-black text-white tabular-nums">
              {selectedOffer.price.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-bold text-gray-500 ml-1">FCFA</span>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          Procéder au Paiement <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Summary Card Sub-Component ──────────────────────────────────────────────

function SummaryCard({
  title,
  subtitle,
  icon,
  onEdit,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-gray-400">
            {icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white block">
              {title}
            </span>
            <span className="text-[8px] text-gray-500">{subtitle}</span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          <Edit3 size={10} /> Modifier
        </button>
      </div>
      {children}
    </div>
  );
}
