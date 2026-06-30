"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
              className={`text-[9px] md:text-[10px] uppercase tracking-wide font-bold text-center leading-tight transition-colors duration-500 ${
                idx <= currentSectionIdx ? "text-white" : "text-gray-500 hidden md:block"
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
              <div className="w-9 h-9 bg-white !text-black rounded-sm flex items-center justify-center text-[12px] font-black">
                {section.letter}
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">
                {section.title}
              </h3>
            </div>
            {section.description && (
              <p className="text-xs text-gray-400 mt-3 pl-12">{section.description}</p>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields
              .filter((field) => !field.showIf || field.showIf(formData))
              .map((field) => {
                const dynamicOptions = field.dependsOn && field.getOptions ? field.getOptions(formData[field.dependsOn]) : undefined;
                return (
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
                      dynamicOptions={dynamicOptions}
                    />
                  </div>
                );
              })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-10">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded transition-colors"
        >
          <ChevronLeft size={16} /> {isFirstSection ? "Retour" : "Section Précédente"}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-3 bg-white !text-black p-6 text-[15px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors active:scale-95 min-w-[200px]"
        >
          {isLastSection ? "Valider la Fiche" : "Suivant"} <ChevronRight size={18} />
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
  dynamicOptions?: { value: string; label: string }[];
}

function FieldRenderer({ field, value, onChange, onToggleCheckbox, error, dynamicOptions }: FieldRendererProps) {
  const baseInputClass =
    "w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-white/40 focus:bg-white/10 transition-colors text-sm placeholder:text-gray-500";

  return (
    <div className="space-y-3">
      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
      </label>

      {/* TEXT / EMAIL / NUMBER / DATE / CURRENCY */}
      {(field.type === "text" || field.type === "email" || field.type === "number" || field.type === "date" || field.type === "currency") && (
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
              } else if (field.id === "immatriculation") {
                // Format plaque Bénin: 2 lettres, 4 chiffres, 2 lettres (ex: AB 1234 RB)
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                let res = "";
                if (val.length > 0) res += val.substring(0, 2);
                if (val.length > 2) res += " " + val.substring(2, 6);
                if (val.length > 6) res += " " + val.substring(6, 8);
                onChange(res);
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
            <span className="absolute right-4 bottom-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {field.suffix}
            </span>
          )}
        </div>
      )}

      {/* TELEPHONE */}
      {field.type === "tel" && (
        <div className="relative">
          <PhoneInput
            international
            defaultCountry="BJ"
            limitMaxLength={true}
            placeholder={field.placeholder || "Téléphone"}
            value={(value as string) || ""}
            onChange={(val) => onChange(val)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition-colors focus-within:border-white/40 focus-within:bg-white/10"
            numberInputProps={{
              className: "bg-transparent outline-none w-full text-sm text-white placeholder:text-gray-500 ml-3"
            }}
          />
        </div>
      )}

      {/* TEXTAREA */}
      {field.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInputClass} resize-none`}
        />
      )}

      {/* SELECT */}
      {field.type === "select" && (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black border border-white/20 text-white py-3 px-4 text-sm outline-none focus:border-white transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Sélectionnez...
          </option>
          {(dynamicOptions || field.options)?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* RADIO */}
      {field.type === "radio" && (
        <div className="flex flex-wrap gap-4 mt-2">
          {field.options?.map((opt) => {
            const checked = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`h-[54px] px-6 border text-[14px] font-bold uppercase tracking-wide transition-all duration-300 flex-1 min-w-[200px] flex items-center justify-center gap-3 ${
                  checked
                    ? "bg-white !text-black border-white shadow-lg"
                    : "bg-white/5 text-gray-300 border-white/20 hover:border-white/50 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                    checked ? "border-black bg-black" : "border-white/40 bg-black"
                  }`}
                >
                  {checked && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* CHECKBOX GROUP */}
      {field.type === "checkbox-group" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {field.options?.map((opt) => {
            const checked = ((value as string[]) || []).includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggleCheckbox(opt.value)}
                className={`flex items-center justify-center gap-4 px-6 min-h-[54px] border text-center transition-all duration-300 group ${
                  checked
                    ? "bg-white/10 border-white/40 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-all ${
                    checked ? "bg-white border-white" : "border-white/20"
                  }`}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] font-bold uppercase tracking-widest">{opt.label}</span>
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
          className={`flex items-center justify-center gap-4 px-6 min-h-[54px] border text-center transition-all duration-300 ${
            value
              ? "bg-white/10 border-white/40 text-white"
              : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
          }`}
        >
          <div
            className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-all ${
              value ? "bg-white border-white" : "border-white/20"
            }`}
          >
            {Boolean(value) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-[13px] font-bold uppercase tracking-widest">{field.label}</span>
        </button>
      )}

      {/* Helper Text */}
      {field.helperText && (
        <p className="text-[10px] text-gray-500 mt-1">{field.helperText}</p>
      )}

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-red-400 font-bold uppercase tracking-wider mt-1"
        >
          ⚠ {error}
        </motion.p>
      )}
    </div>
  );
}
