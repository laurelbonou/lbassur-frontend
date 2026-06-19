"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

export default function ComparatorBanner() {
    return (
        <section className="bg-black py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Calculator className="text-white/80" size={24} />
                            <span className="text-xs text-white/80 uppercase tracking-widest font-semibold">Comparateur en ligne</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                            Trouvez la meilleure offre en quelques clics.
                        </h2>
                        <p className="text-white/70 text-base leading-relaxed font-light">
                            Gagnez du temps et de l'argent. Comparez instantanément les tarifs et garanties de nos partenaires pour trouver le contrat parfaitement adapté à vos besoins.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="shrink-0"
                    >
                        <Link 
                            href="/comparateur" 
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105"
                        >
                            <span className="relative z-10">Comparer maintenant</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gray-100 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
