"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Home, Car, Plane } from "lucide-react";
import Link from "next/link";

const offres = [
    { title: "Santé & Prévoyance", icon: HeartPulse, desc: "Protégez votre famille face aux imprévus de la vie." },
    { title: "Habitation", icon: Home, desc: "Sécurisez votre patrimoine immobilier." },
    { title: "Automobile", icon: Car, desc: "Roulez l'esprit tranquille avec nos formules Tous Risques." },
    { title: "Voyage", icon: Plane, desc: "Assistance et couverture mondiale pour vos déplacements." },
];

export default function OffresParticuliersSection() {
    return (
        <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Pour Vous et Vos Proches</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                            Offres Particuliers
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed font-light mb-10">
                            Votre quotidien mérite une protection sans faille. Nous sélectionnons les contrats les plus adaptés à votre style de vie.
                        </p>

                        <div className="space-y-4 mb-10">
                            {offres.map((offre, i) => (
                                <div key={i} className="group p-6 border border-white/10 rounded-md bg-white/[0.02] hover:bg-white hover:border-white transition-all duration-300 cursor-pointer flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 border border-white/10 rounded-md flex items-center justify-center group-hover:border-black/10 transition-colors duration-300">
                                            <offre.icon className="text-gray-400 group-hover:text-black transition-colors duration-300" size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-white group-hover:text-black font-semibold text-sm transition-colors duration-300">{offre.title}</h4>
                                            <p className="text-gray-500 group-hover:text-gray-600 text-xs transition-colors duration-300">{offre.desc}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-white/20 group-hover:text-black transition-colors duration-300" size={18} />
                                </div>
                            ))}
                        </div>

                        <Link href="/services#particuliers" className="text-white text-[13px] font-semibold hover:underline underline-offset-4 transition-all duration-200">
                            Voir toutes les garanties
                        </Link>
                    </motion.div>

                    {/* Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 h-[500px] sm:h-[700px] overflow-hidden rounded-md relative"
                    >
                        <img 
                            src="/images/03.png" 
                            alt="Offres Particuliers" 
                            className="w-full h-full object-cover brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
