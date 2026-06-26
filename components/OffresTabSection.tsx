"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HeartPulse, Car, Home, Building2, Users2, BriefcaseBusiness, Anchor, GraduationCap, CheckCircle2 } from "lucide-react";

const offresParticuliers = [
    {
        id: "auto-voyage",
        title: "Auto & Voyage",
        icon: Car,
        image: "/images/auto et voyage.png",
        items: [
            "Assurance automobile",
            "Assurance moto",
            "Assurance voyage"
        ]
    },
    {
        id: "habitation-quotidien",
        title: "Habitation & Quotidien",
        icon: Home,
        image: "/images/habitation et quotidien.png",
        items: [
            "Multirisque habitation",
            "Responsabilité civile chef de famille",
            "Individuelle accident"
        ]
    },
    {
        id: "vie-avenir",
        title: "Vie & Avenir",
        icon: GraduationCap,
        image: "/images/vie et avenir.png",
        items: [
            "Épargne retraite",
            "Assurance études",
            "Prévoyance décès",
            "Assurances funérailles"
        ]
    }
];

const offresEntreprises = [
    {
        id: "dommages-flottes",
        title: "Dommages & Flottes",
        icon: Building2,
        image: "/images/entreprises_dommages.png",
        items: [
            "Multirisque entreprise / professionnelle",
            "Flottes automobile",
            "Bris de machine & Perte d'exploitation",
            "Tous risques montage"
        ]
    },
    {
        id: "responsabilites-specifiques",
        title: "Responsabilités & Risques Spéciaux",
        icon: BriefcaseBusiness,
        image: "/images/entreprises_responsabilites.png",
        items: [
            "Responsabilité civile (Entreprise, Décennale, RCMS/D&O)",
            "Cyber sécurité",
            "Pack médical et paramédical",
            "Violence politique"
        ]
    },
    {
        id: "transports-cautions",
        title: "Transports & Cautions",
        icon: Anchor,
        image: "/images/entreprises_transports.png",
        items: [
            "Assurance transports (Marchandises, Aviation, Corps de navire)",
            "Crédit caution (Marchés, Commerciales, Garanties bancaires)"
        ]
    }
];

export default function OffresTabSection() {
    const [activeTab, setActiveTab] = useState<"particuliers" | "entreprises">("particuliers");
    const [expandedId, setExpandedId] = useState<string>("sante-famille");

    const currentOffres = activeTab === "particuliers" ? offresParticuliers : offresEntreprises;

    const handleTabChange = (tab: "particuliers" | "entreprises") => {
        setActiveTab(tab);
        setExpandedId(tab === "particuliers" ? offresParticuliers[0].id : offresEntreprises[0].id);
    };

    return (
        <section id="offres" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
                
                {/* Header & Toggle */}
                <div className="flex flex-col items-center mb-16">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4 text-center">Couvertures Sur-Mesure</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-10 text-center">
                        Nos Offres
                    </h2>

                    {/* Toggle Switch */}
                    <div className="flex items-center bg-gray-100 p-1.5 rounded-full relative">
                        <motion.div
                            layout
                            className="absolute bg-white rounded-full shadow-sm"
                            initial={false}
                            animate={{
                                width: activeTab === "particuliers" ? "140px" : "150px",
                                x: activeTab === "particuliers" ? 0 : "140px",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ height: "calc(100% - 12px)", top: "6px", left: "6px" }}
                        />
                        
                        <button 
                            onClick={() => handleTabChange("particuliers")}
                            className={`relative z-10 w-[140px] py-2.5 text-[13px] font-semibold transition-colors duration-300 ${activeTab === "particuliers" ? "text-black" : "text-gray-500"}`}
                        >
                            Particuliers
                        </button>
                        <button 
                            onClick={() => handleTabChange("entreprises")}
                            className={`relative z-10 w-[150px] py-2.5 text-[13px] font-semibold transition-colors duration-300 ${activeTab === "entreprises" ? "text-black" : "text-gray-500"}`}
                        >
                            Entreprises
                        </button>
                    </div>
                </div>

                {/* Accordion Container */}
                <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] w-full gap-4">
                    <AnimatePresence mode="wait">
                        {currentOffres.map((offre) => {
                            const isExpanded = expandedId === offre.id;
                            const Icon = offre.icon;

                            return (
                                <motion.div
                                    key={offre.id}
                                    layout
                                    onClick={() => setExpandedId(offre.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                                    className={`relative rounded-3xl overflow-hidden cursor-pointer group flex flex-col transition-all duration-500 ease-in-out border border-black/5 bg-gray-50
                                        ${isExpanded ? "lg:flex-[3] flex-[auto] h-[500px] lg:h-full" : "lg:flex-[1] h-[80px] lg:h-full hover:bg-gray-100"}
                                    `}
                                >
                                    {/* Expanded Content Background */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="absolute inset-0 z-0 bg-black"
                                            >
                                                {/* Image with grayscale effect */}
                                                <img 
                                                    src={offre.image} 
                                                    alt={offre.title} 
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-90 transition-all duration-[2s] ease-out group-hover:scale-105"
                                                />
                                                {/* Elegant Dark Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Content Wrapper */}
                                    <div className={`relative z-10 w-full h-full flex ${isExpanded ? 'flex-col justify-end p-8 md:p-10' : 'flex-row lg:flex-col items-center justify-center p-4 lg:p-6'}`}>
                                        
                                        {/* Icon & Title Container */}
                                        <div className={`flex items-center gap-4 ${isExpanded ? 'mb-6 flex-row' : 'flex-row lg:flex-col lg:gap-4'}`}>
                                            <div className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${
                                                isExpanded 
                                                    ? 'w-14 h-14 bg-white text-black' 
                                                    : 'w-12 h-12 bg-white text-zinc-900 border border-black/5 shadow-sm group-hover:shadow-md group-hover:scale-105'
                                            }`}>
                                                <Icon size={isExpanded ? 24 : 20} />
                                            </div>
                                            
                                            <h3 className={`font-bold transition-colors duration-300 ${
                                                isExpanded 
                                                    ? 'text-2xl md:text-3xl text-white' 
                                                    : 'text-sm lg:text-lg lg:[writing-mode:vertical-rl] lg:rotate-180 text-zinc-900 tracking-wide whitespace-nowrap'
                                            }`}>
                                                {offre.title}
                                            </h3>
                                        </div>

                                        {/* Expanded Details - The List of Offers */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                    className="flex flex-col gap-3"
                                                >
                                                    {offre.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 text-gray-200">
                                                            <CheckCircle2 size={18} className="text-white mt-0.5 shrink-0" />
                                                            <span className="text-sm md:text-base font-medium">{item}</span>
                                                        </div>
                                                    ))}
                                                    
                                                    <div className="mt-8">
                                                        <a href="/simulation" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
                                                            Simuler mon tarif
                                                            <ArrowRight size={16} />
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
