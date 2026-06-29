"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { InsuranceFormConfig, FormField, FormSection } from "@/lib/insurance-forms";

interface DynamicFormProps {
  config: InsuranceFormConfig;
  onComplete: (data: Record<string, unknown>) => void;
  onBack: () => void;
  onSectionComplete?: (sectionIndex: number, data: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>;
}

export default function DynamicForm({ config, onComplete, onBack, onSectionComplete, initialData }: DynamicFormProps) {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const section = config.sections[currentSectionIdx];
  const isLastSection = currentSectionIdx === config.sections.length - 1;
  const isFirstSection = currentSectionIdx === 0;

  const updateField = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const toggleCheckboxGroup = (fieldId: string, optionValue: string) => {
    const current = (formData[fieldId] as string[]) || [];
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    updateField(fieldId, updated);
  };

  const validateSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of section.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (field.type === "checkbox-group") {
          if (!value || (value as string[]).length === 0) {
            newErrors[field.id] = "Veuillez sélectionner au moins une option";
          }
        } else if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.id] = "Ce champ est requis";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSection()) return;

    if (onSectionComplete) {
      onSectionComplete(currentSectionIdx, formData);
    }

    if (isLastSection) {
      onComplete(formData);
    } else {
      setCurrentSectionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isFirstSection) {
      onBack();
    } else {
      setCurrentSectionIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Progress */}
      <div className="flex gap-2 mb-8">
        {config.sections.map((s, idx) => (
          <div key={s.id} className="flex-1 flex flex-col gap-2">
            <div
              className={`h-0.5 transition-all duration-700 ${
                idx <= currentSectionIdx
                  ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  : "bg-white/10"
              }`}
            />
            <span
              className={`text-[7px] uppercase tracking-widest font-black text-center transition-colors duration-500 ${
                idx <= currentSectionIdx ? "text-white" : "text-gray-600 hidden md:block"
              }`}
            >
              {s.letter}. {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Section Header */}
          <div className="border-b border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white !text-black rounded-sm flex items-center justify-center text-[11px] font-black">
                {section.letter}
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white">
                {section.title}
              </h3>
            </div>
            {section.description && (
              <p className="text-xs text-gray-400 mt-3 pl-11">{section.description}</p>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className={field.fullWidth || field.type === "checkbox-group" || field.type === "radio" || field.type === "textarea"
                  ? "md:col-span-2"
                  : ""}
              >
                <FieldRenderer
                  field={field}
                  value={formData[field.id]}
                  onChange={(val) => updateField(field.id, val)}
                  onToggleCheckbox={(val) => toggleCheckboxGroup(field.id, val)}
                  error={errors[field.id]}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-10">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={14} /> {isFirstSection ? "Retour" : "Section Précédente"}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-white !text-black px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors active:scale-95"
        >
          {isLastSection ? "Valider la Fiche" : "Suivant"} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Rendu des Champs ────────────────────────────────────────────────────────

interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  onToggleCheckbox: (value: string) => void;
  error?: string;
}

function FieldRenderer({ field, value, onChange, onToggleCheckbox, error }: FieldRendererProps) {
  const baseInputClass =
    "w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm placeholder:text-gray-600";

  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
      </label>

      {/* TEXT / EMAIL / TEL / NUMBER / DATE / CURRENCY */}
      {(field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "number" || field.type === "date" || field.type === "currency") && (
        <div className="relative">
          <input
            type={field.type === "currency" ? "text" : field.type}
            value={(value as string) || ""}
            onChange={(e) => {
              if (field.type === "currency") {
                // Only allow numbers and spaces
                const raw = e.target.value.replace(/[^\d]/g, "");
                const formatted = raw ? Number(raw).toLocaleString("fr-FR") : "";
                onChange(formatted);
              } else {
                onChange(e.target.value);
              }
            }}
            placeholder={field.placeholder}
            className={baseInputClass}
            min={field.validation?.min}
            max={field.validation?.max}
          />
          {field.suffix && (
            <span className="absolute right-0 bottom-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              {field.suffix}
            </span>
          )}
        </div>
      )}

      {/* TEXTAREA */}
      {field.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInputClass} border border-white/10 rounded-sm p-3 resize-none`}
        />
      )}

      {/* SELECT */}
      {field.type === "select" && (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black border border-white/20 text-white py-2 px-3 text-sm outline-none focus:border-white transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Sélectionnez...
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* RADIO */}
      {field.type === "radio" && (
        <div className="flex flex-wrap gap-3 mt-1">
          {field.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-5 py-3 border text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                value === opt.value
                  ? "bg-white !text-black border-white"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* CHECKBOX GROUP */}
      {field.type === "checkbox-group" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {field.options?.map((opt) => {
            const checked = ((value as string[]) || []).includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggleCheckbox(opt.value)}
                className={`flex items-center gap-3 px-4 py-3 border text-left transition-all duration-300 group ${
                  checked
                    ? "bg-white/10 border-white/40 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${
                    checked ? "bg-white border-white" : "border-white/20"
                  }`}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* CHECKBOX (single) */}
      {field.type === "checkbox" && (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 ${
            value
              ? "bg-white/10 border-white/40 text-white"
              : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
          }`}
        >
          <div
            className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${
              value ? "bg-white border-white" : "border-white/20"
            }`}
          >
            {Boolean(value) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">{field.label}</span>
        </button>
      )}

      {/* Helper Text */}
      {field.helperText && (
        <p className="text-[8px] text-gray-500 mt-1">{field.helperText}</p>
      )}

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[9px] text-red-400 font-bold uppercase tracking-wider mt-1"
        >
          ⚠ {error}
        </motion.p>
      )}
    </div>
  );
}
