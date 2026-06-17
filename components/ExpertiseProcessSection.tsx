"use client";

import { motion } from "framer-motion";
import { CheckCircle, Search, FileSearch, PenTool, HeadphonesIcon } from "lucide-react";

const expertisePoints = [
    { title: "Indépendance Totale", desc: "Nous défendons vos intérêts, pas ceux des compagnies." },
    { title: "Conseil Stratégique", desc: "Un accompagnement sur le long terme." },
];

const processSteps = [
    {
        icon: Search,
        title: "Audit & Analyse",
        desc: "Étude approfondie de vos risques et de vos contrats en cours."
    },
    {
        icon: FileSearch,
        title: "Comparatif",
        desc: "Mise en concurrence des meilleures compagnies."
    },
    {
        icon: PenTool,
        title: "Souscription",
        desc: "Mise en place rapide et sécurisée de vos contrats."
    },
    {
        icon: HeadphonesIcon,
        title: "Accompagnement",
        desc: "Gestion de vos sinistres et suivi continu."
    }
];

export default function ExpertiseProcessSection() {
    return (
        <section className="relative py-32 bg-gray-50 border-b border-black/5 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-20">
                    
                    {/* Left: Expertise Concept */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                    >
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Notre Méthode</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8">
                            L'Exigence à chaque étape.
                        </h2>
                        
                        <p className="text-gray-600 text-base leading-relaxed font-light mb-12">
                            En tant que courtier indépendant, notre rôle ne se limite pas à vous vendre un contrat. Nous établissons une stratégie de protection globale, depuis l'audit initial jusqu'à la défense de vos intérêts en cas de sinistre.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                            {expertisePoints.map((point, i) => (
                                <div key={i} className="flex gap-4">
                                    <CheckCircle className="text-black shrink-0" size={20} />
                                    <div>
                                        <h4 className="text-black font-semibold text-sm mb-1">{point.title}</h4>
                                        <p className="text-gray-500 text-xs">{point.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="h-64 sm:h-80 w-full rounded-md overflow-hidden relative">
                            <img 
                                src="/images/04.png" 
                                alt="Notre Expertise" 
                                className="w-full h-full object-cover brightness-110"
                            />
                        </div>
                    </motion.div>

                    {/* Right: 4-step Process */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-px bg-black/10 hidden sm:block" />

                        <div className="space-y-12">
                            {processSteps.map((step, i) => (
                                <div key={i} className="flex gap-8 relative">
                                    {/* Number / Icon */}
                                    <div className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-sm relative z-10">
                                        <step.icon className="text-black" size={18} />
                                    </div>
                                    
                                    <div className="pt-2">
                                        <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Étape {i + 1}</div>
                                        <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                                        <p className="text-gray-600 font-light text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
