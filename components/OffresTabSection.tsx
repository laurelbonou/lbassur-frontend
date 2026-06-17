"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HeartPulse, Home, Car, Plane, ShieldCheck, Truck, Building2, Users2 } from "lucide-react";
import Link from "next/link";

const offresParticuliers = [
    { title: "Santé & Prévoyance", icon: HeartPulse, desc: "Protégez votre famille face aux imprévus de la vie." },
    { title: "Habitation", icon: Home, desc: "Sécurisez votre patrimoine immobilier." },
    { title: "Automobile", icon: Car, desc: "Roulez l'esprit tranquille avec nos formules Tous Risques." },
    { title: "Voyage", icon: Plane, desc: "Assistance et couverture mondiale pour vos déplacements." },
];

const offresEntreprises = [
    { title: "Flotte Automobile", icon: Truck, desc: "Assurance sur-mesure pour vos véhicules d'entreprise." },
    { title: "Multirisque Professionnelle", icon: Building2, desc: "Couverture globale de vos locaux et de votre matériel." },
    { title: "Responsabilité Civile", icon: ShieldCheck, desc: "Protection juridique et financière de votre activité." },
    { title: "Santé & Prévoyance", icon: Users2, desc: "Des garanties compétitives pour vos collaborateurs." },
];

export default function OffresTabSection() {
    const [activeTab, setActiveTab] = useState<"particuliers" | "entreprises">("particuliers");

    const activeOffres = activeTab === "particuliers" ? offresParticuliers : offresEntreprises;
    const activeImage = activeTab === "particuliers" ? "/images/03.png" : "/images/corporate/hero_corporate_glass_1777915646132.png";
    const activeLink = activeTab === "particuliers" ? "/services#particuliers" : "/services#entreprises";

    return (
        <section className="py-32 bg-white border-b border-black/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Header & Toggle */}
                <div className="flex flex-col items-center mb-20">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4 text-center">Couvertures Sur-Mesure</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-12 text-center">
                        Nos Offres
                    </h2>

                    {/* Toggle Switch */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-full relative">
                        {/* Animated background pill */}
                        <motion.div
                            layout
                            className="absolute bg-white rounded-full shadow-sm"
                            initial={false}
                            animate={{
                                width: activeTab === "particuliers" ? "140px" : "150px",
                                x: activeTab === "particuliers" ? 0 : "140px",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ height: "calc(100% - 8px)", top: "4px", left: "4px" }}
                        />
                        
                        <button 
                            onClick={() => setActiveTab("particuliers")}
                            className={`relative z-10 w-[140px] py-2.5 text-[13px] font-semibold transition-colors duration-300 ${activeTab === "particuliers" ? "text-black" : "text-gray-500"}`}
                        >
                            Particuliers
                        </button>
                        <button 
                            onClick={() => setActiveTab("entreprises")}
                            className={`relative z-10 w-[150px] py-2.5 text-[13px] font-semibold transition-colors duration-300 ${activeTab === "entreprises" ? "text-black" : "text-gray-500"}`}
                        >
                            Entreprises
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Offers List */}
                    <div className="w-full lg:w-1/2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-gray-600 text-base leading-relaxed font-light mb-10">
                                    {activeTab === "particuliers" 
                                        ? "Votre quotidien mérite une protection sans faille. Nous sélectionnons les contrats les plus adaptés à votre style de vie." 
                                        : "Sécurisez la pérennité de votre entreprise avec des solutions d'assurance adaptées à votre secteur d'activité."}
                                </p>

                                <div className="space-y-4 mb-10">
                                    {activeOffres.map((offre, i) => (
                                        <div key={i} className="group p-6 border border-black/5 rounded-md bg-white hover:bg-gray-50 hover:border-black/10 transition-all duration-300 cursor-pointer flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 border border-black/5 rounded-md flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors duration-300">
                                                    <offre.icon className="text-gray-500 group-hover:text-black transition-colors duration-300" size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-black font-semibold text-sm mb-0.5">{offre.title}</h4>
                                                    <p className="text-gray-500 text-xs">{offre.desc}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="text-black/20 group-hover:text-black transition-colors duration-300" size={18} />
                                        </div>
                                    ))}
                                </div>

                                <Link href={activeLink} className="text-black text-[13px] font-semibold hover:underline underline-offset-4 transition-all duration-200">
                                    {activeTab === "particuliers" ? "Voir toutes nos garanties" : "Demander un Audit"}
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dynamic Image */}
                    <div className="w-full lg:w-1/2 h-[500px] sm:h-[600px] overflow-hidden rounded-md relative bg-gray-100">
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={activeImage}
                                src={activeImage}
                                alt="Offres"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`absolute inset-0 w-full h-full object-cover ${activeTab === "particuliers" ? "brightness-110" : "grayscale"}`}
                            />
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
