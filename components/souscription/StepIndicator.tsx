"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  shortTitle?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto relative mb-12 mt-8">
      {/* Background line */}
      <div className="absolute left-0 top-[16px] w-full h-[1px] bg-white/10 -z-10" />
      {/* Progress line */}
      <motion.div
        className="absolute left-0 top-[16px] h-[1px] bg-white -z-10"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isFuture = idx > currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center gap-3 relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 ${
                isCompleted
                  ? "bg-white !text-black"
                  : isCurrent
                  ? "bg-black text-white border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-black text-gray-600 border border-white/10"
              }`}
            >
              {isCompleted ? <Check size={14} /> : idx + 1}
            </motion.div>
            <span
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap transition-colors duration-500 ${
                isCompleted || isCurrent ? "text-white" : "text-gray-600 hidden sm:block"
              }`}
            >
              {step.shortTitle || step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
