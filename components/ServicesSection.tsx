"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, FileSearch } from "lucide-react";
import Link from "next/link";

export default function ServicesSection() {
    return (
        <section className="py-32 bg-white border-b border-black/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Nos Outils</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-8">
                        L'Assurance Digitale
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed font-light">
                        LBASSUR met à votre disposition des outils performants pour comparer, choisir et gérer vos contrats d'assurance en toute simplicité.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Comparateur */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="p-12 border border-black/10 rounded-md bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-500 flex flex-col group"
                    >
                        <div className="w-14 h-14 border border-black/10 rounded-md flex items-center justify-center mb-8 bg-white shadow-sm">
                            <FileSearch className="text-black" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4">Comparateur d'Assurance</h3>
                        <p className="text-gray-600 font-light leading-relaxed mb-10 flex-1">
                            Le premier comparateur d'assurance national au Bénin. Entrez vos critères, nous interrogeons en temps réel toutes les compagnies partenaires pour vous fournir le meilleur devis en moins de 3 minutes.
                        </p>
                        <Link 
                            href="/simulation"
                            className="inline-flex items-center gap-3 text-black text-[13px] font-semibold group-hover:gap-5 transition-all duration-300"
                        >
                            Lancer une simulation <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    {/* Itoju */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="p-12 border border-black/10 rounded-md bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-500 flex flex-col group"
                    >
                        <div className="w-14 h-14 border border-black/10 rounded-md flex items-center justify-center mb-8 bg-white shadow-sm">
                            <Activity className="text-black" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4">Itoju : Santé Connectée</h3>
                        <p className="text-gray-600 font-light leading-relaxed mb-10 flex-1">
                            L'application révolutionnaire pour la gestion de votre assurance santé. Suivi des remboursements en temps réel, géolocalisation des partenaires santé et prise en charge digitale immédiate.
                        </p>
                        <a 
                            href="https://lb-assurmaladie-staticwebsite.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-black text-[13px] font-semibold group-hover:gap-5 transition-all duration-300"
                        >
                            Découvrir Itoju <ArrowRight size={16} />
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
