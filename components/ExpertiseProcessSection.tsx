"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sliders, BarChart3, Activity, FileCheck, Globe } from "lucide-react";

const expertises = [
    {
        icon: ShieldCheck,
        title: "Analyse de risques",
        desc: "Identification et évaluation précise des vulnérabilités de votre entreprise."
    },
    {
        icon: Sliders,
        title: "Garanties sur mesure",
        desc: "Création de programmes d'assurance adaptés à vos besoins spécifiques."
    },
    {
        icon: BarChart3,
        title: "Pilotage et reporting",
        desc: "Suivi rigoureux et tableaux de bord pour optimiser votre budget assurance."
    },
    {
        icon: Activity,
        title: "Sinistres",
        desc: "Gestion proactive et défense de vos intérêts auprès des compagnies."
    },
    {
        icon: FileCheck,
        title: "Compliance",
        desc: "Mise en conformité de vos contrats avec les réglementations en vigueur."
    },
    {
        icon: Globe,
        title: "Réassurance",
        desc: "Solutions de transfert de risques complexes à l'échelle internationale."
    }
];

export default function ExpertiseProcessSection() {
    return (
        <section className="relative py-32 bg-gray-50 border-b border-black/5 overflow-hidden" id="methode">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4"
                    >
                        Notre Expertise
                    </motion.p>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-black tracking-tight"
                    >
                        Une maîtrise totale de vos risques.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {expertises.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-xl border border-black/5 hover:border-black/20 hover:shadow-lg transition-all group"
                        >
                            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                                <item.icon size={24} className="text-black group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-light">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
