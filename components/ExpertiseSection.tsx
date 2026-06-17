"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const points = [
    { title: "Audit Complet", desc: "Analyse experte de vos risques." },
    { title: "Assurance Sur-Mesure", desc: "Les meilleures couvertures du marché." },
    { title: "Conseil Stratégique", desc: "Accompagnement continu de votre évolution." },
    { title: "Indemnisation Rapide", desc: "Défense de vos intérêts en cas de sinistre." },
];

export default function ExpertiseSection() {
    return (
        <section className="relative py-32 bg-black border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Image side */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative h-[500px] sm:h-[600px] overflow-hidden rounded-md"
                    >
                        <img 
                            src="/images/04.png" 
                            alt="Famille LBASSUR" 
                            className="w-full h-full object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>

                    {/* Content side */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Notre Expertise</p>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8">
                            Protéger ce qui compte vraiment.
                        </h2>
                        
                        <p className="text-gray-400 text-base leading-relaxed font-light mb-12">
                            En tant que courtier indépendant, nous ne sommes pas rattachés à une compagnie. Notre seul intérêt est le vôtre. Nous négocions pour vous les contrats les plus performants.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {points.map((point, i) => (
                                <div key={i} className="flex gap-4">
                                    <CheckCircle className="text-white shrink-0" size={20} />
                                    <div>
                                        <h4 className="text-white font-semibold text-sm mb-1">{point.title}</h4>
                                        <p className="text-gray-500 text-xs">{point.desc}</p>
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
