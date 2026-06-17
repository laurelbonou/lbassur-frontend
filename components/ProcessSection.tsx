"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Search, FileSignature, ShieldCheck } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Audit & Analyse",
        desc: "Analyse approfondie de l'existant pour identifier les risques réels et les failles de couverture."
    },
    {
        icon: FileSignature,
        title: "Comparatif",
        desc: "Négociation ferme auprès de toutes les compagnies partenaires pour obtenir le meilleur tarif."
    },
    {
        icon: ShieldCheck,
        title: "Souscription",
        desc: "Mise en place immédiate des garanties avec une procédure entièrement simplifiée."
    },
    {
        icon: CheckCircle2,
        title: "Accompagnement",
        desc: "Gestion dédiée de votre contrat et défense active de vos intérêts en cas de sinistre."
    }
];

export default function ProcessSection() {
    return (
        <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Notre Méthode</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                        Comment ça marche
                    </h2>
                </motion.div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="bg-black p-10 group hover:bg-white/[0.03] transition-colors duration-500 relative"
                        >
                            {/* Step number */}
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[10px] font-semibold text-gray-600 tracking-widest">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="w-9 h-9 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors duration-500">
                                    <step.icon size={16} className="text-gray-500 group-hover:text-white transition-colors duration-500" />
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-light">
                                {step.desc}
                            </p>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white/30 group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
