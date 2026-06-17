"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Qui Sommes-Nous</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
                        L'Humain au cœur du Courtage
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed font-light">
                        Fort de notre expérience au Bénin, notre cabinet s'engage à vous fournir des conseils transparents et des solutions sur mesure. Nous bâtissons des relations de confiance à long terme.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="h-[400px] overflow-hidden rounded-md relative group"
                    >
                        <img 
                            src="/images/lba/WhatsApp Image 2026-04-28 at 15.01.00 (1).jpeg" 
                            alt="Bureaux LBASSUR" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="h-[400px] overflow-hidden rounded-md relative group"
                    >
                        <img 
                            src="/images/corporate/black_business_team_1777914501514.png" 
                            alt="Équipe LBASSUR" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
