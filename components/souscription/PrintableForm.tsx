"use client";

import { motion } from "framer-motion";
import { Printer, Download, ArrowLeft } from "lucide-react";
import type { InsuranceFormConfig } from "@/lib/insurance-forms";

interface PrintableFormProps {
  config: InsuranceFormConfig;
  formData: Record<string, unknown>;
  onContinue: () => void;
  onBack: () => void;
}

export default function PrintableForm({ config, formData, onContinue, onBack }: PrintableFormProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Action bar (hidden on print) */}
      <div className="print:hidden mb-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-white">
              Fiche de Cotation Imprimable
            </h2>
            <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              Imprimez cette fiche et renseignez-la manuellement si nécessaire
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border border-white/20 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
            >
              <Printer size={14} /> Imprimer
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="bg-white text-black p-8 md:p-12 print:p-8 print:shadow-none shadow-2xl" id="printable-form">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/images/logo.jpg"
                alt="LBASSUR"
                className="h-10 w-auto rounded-sm print:h-8"
              />
              <span className="text-xl font-bold tracking-tight">LBASSUR</span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
              Cabinet de Courtage d&apos;Assurances
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-black uppercase tracking-widest mb-1">
              Fiche de Demande de Cotation
            </h2>
            <p className="text-lg font-bold uppercase tracking-tight text-gray-700">
              {config.title}
            </p>
          </div>
        </div>

        {/* Sections */}
        {config.sections.map((section) => (
          <div key={section.id} className="mb-8 break-inside-avoid">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
              <span className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center text-[10px] font-black">
                {section.letter}
              </span>
              <h3 className="text-sm font-black uppercase tracking-widest">
                {section.title}
              </h3>
            </div>

            <div className="space-y-4 pl-8">
              {section.fields.map((field) => {
                const value = formData[field.id];

                // Radio & checkbox-group → checkboxes style
                if (field.type === "radio" || field.type === "checkbox-group") {
                  return (
                    <div key={field.id} className="mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2">
                        {field.label}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {field.options?.map((opt) => {
                          const isChecked =
                            field.type === "radio"
                              ? value === opt.value
                              : ((value as string[]) || []).includes(opt.value);
                          return (
                            <div key={opt.value} className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 border-2 border-gray-400 flex items-center justify-center ${
                                  field.type === "radio" ? "rounded-full" : ""
                                }`}
                              >
                                {isChecked && (
                                  <div
                                    className={`bg-black ${
                                      field.type === "radio" ? "w-2 h-2 rounded-full" : "w-2.5 h-2.5"
                                    }`}
                                  />
                                )}
                              </div>
                              <span className="text-xs">{opt.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Text-type fields → dotted line
                return (
                  <div key={field.id} className="mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      {field.label}
                    </p>
                    <div className="border-b border-dotted border-gray-400 pb-1 min-h-[24px] text-sm">
                      {value ? String(value) : ""}
                      {field.suffix && value ? ` ${field.suffix}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Pièces à joindre */}
        <div className="mb-8 break-inside-avoid">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <span className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center text-[10px] font-black">
              {String.fromCharCode(65 + config.sections.length)}
            </span>
            <h3 className="text-sm font-black uppercase tracking-widest">
              Pièces à Joindre
            </h3>
          </div>
          <div className="space-y-2 pl-8">
            {config.requiredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400" />
                <span className="text-xs">
                  {doc.name} {doc.required ? "" : "(optionnel)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Déclaration */}
        <div className="border-t-2 border-black pt-6 mt-8 break-inside-avoid">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4">
            Déclaration du Souscripteur
          </h3>
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            Je certifie exactes les informations fournies dans la présente fiche de demande de cotation.
            Je reconnais avoir été informé(e) que toute fausse déclaration peut entraîner la nullité du contrat
            conformément au Code CIMA.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Nom</p>
              <div className="border-b border-dotted border-gray-400 pb-1 min-h-[24px] text-sm">
                {(formData["nom"] as string) || ""}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Date</p>
              <div className="border-b border-dotted border-gray-400 pb-1 min-h-[24px] text-sm">
                {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Signature</p>
              <div className="border-b border-dotted border-gray-400 pb-1 min-h-[24px]" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-gray-200 text-center text-[8px] text-gray-400 uppercase tracking-widest">
          LBASSUR — Cabinet de Courtage d&apos;Assurances · Cotonou, Bénin · www.lbassur.com
        </div>
      </div>

      {/* Navigation (hidden on print) */}
      <div className="print:hidden flex justify-between items-center border-t border-white/10 pt-6 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors active:scale-95"
        >
          Continuer vers le Récapitulatif →
        </button>
      </div>
    </div>
  );
}
