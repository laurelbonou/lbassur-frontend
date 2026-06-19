"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { IARDT_TYPES, PERSONNES_TYPES, VIE_TYPES } from "@/lib/data";
import { InsuranceCategory, InsuranceOffer } from "@/types/insurance";
import {
    Search, Filter, ArrowUpDown, ShieldCheck, ChevronRight, Coins,
    Star, Car, Bike, Truck, Home, Briefcase, Ship, Users, Heart,
    Plane, PiggyBank, GraduationCap, CreditCard, Flower2, AlertCircle,
    SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Types & Config ───────────────────────────────────────────────────────────

type SortKey = "premium" | "rating" | "coverage";

interface CategoryDef {
    id: InsuranceCategory;
    label: string;
    labelShort: string;
    description: string;
}

const CATEGORIES: CategoryDef[] = [
    {
        id: "IARDT",
        label: "Dommages & Responsabilité",
        labelShort: "IARDT",
        description: "Protège vos biens (véhicules, logement, entreprise) et votre responsabilité civile.",
    },
    {
        id: "PERSONNES",
        label: "Santé & Vie",
        labelShort: "Santé",
        description: "Couvre votre intégrité physique, vos frais de santé et vos projets de vie.",
    },
    {
        id: "VIE",
        label: "Épargne & Retraite",
        labelShort: "Épargne",
        description: "Constitution de capital, protection financière longue durée et prévoyance familiale.",
    },
];

const TYPE_ICONS: Record<string, any> = {
    "Assurance Automobile": Car,
    "Assurance Moto": Bike,
    "Assurance Flotte": Truck,
    "Multirisque Habitation": Home,
    "Multirisque Professionnelle": Briefcase,
    "Assurance Transport": Ship,
    "Responsabilité Civile": Users,
    "Assurance Santé": Heart,
    "Individuelle Accident": AlertCircle,
    "Assurance Voyage": Plane,
    "Épargne & Retraite": PiggyBank,
    "Assurance Éducation": GraduationCap,
    "Assurance Emprunteur": CreditCard,
    "Assurance Obsèques": Flower2,
};

const TYPE_LISTS: Record<InsuranceCategory, string[]> = {
    IARDT: IARDT_TYPES,
    PERSONNES: PERSONNES_TYPES,
    VIE: VIE_TYPES,
};

// ─── Standalone Engine ────────────────────────────────────────────────────────

const INSURERS = ["NSIA", "SUNU", "Allianz", "Axa", "Sanlam", "Atlantique"];

function generateMockOffers(category: InsuranceCategory, type: string, budget: number): InsuranceOffer[] {
    const offers: InsuranceOffer[] = [];
    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 offers
    
    // Determine possible types based on type filter
    const possibleTypes = type === "Tous" ? TYPE_LISTS[category] : [type];
    
    for (let i = 0; i < count; i++) {
        const insurer = INSURERS[Math.floor(Math.random() * INSURERS.length)];
        const insType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
        
        // Base premium varies
        let basePremium = 0;
        if (category === "IARDT") basePremium = 50000 + Math.random() * 300000;
        if (category === "PERSONNES") basePremium = 20000 + Math.random() * 150000;
        if (category === "VIE") basePremium = 10000 + Math.random() * 50000;
        
        // If it's over budget by a lot, occasionally skip to simulate filtering
        if (basePremium > budget && Math.random() > 0.3) continue;

        const rating = 3.5 + Math.random() * 1.5;
        const coverageAmount = basePremium * (10 + Math.random() * 40);
        
        offers.push({
            id: `mock-${Date.now()}-${i}`,
            category,
            insuranceType: insType,
            insuranceSubType: ["Formule Essentielle", "Formule Confort", "Formule Premium"][Math.floor(Math.random() * 3)],
            insurer,
            insurerSlug: insurer.toLowerCase(),
            premium: Math.round(basePremium / 1000) * 1000,
            coverageAmount: Math.round(coverageAmount / 100000) * 100000,
            franchise: Math.random() > 0.5 ? Math.round((basePremium * 0.1) / 5000) * 5000 : 0,
            guarantees: ["Responsabilité Civile", "Défense et Recours", "Assistance 24/7"].slice(0, 2 + Math.floor(Math.random() * 2)),
            optionalGuarantees: [],
            exclusions: [],
            duration: "1 an",
            waitingPeriod: ["Aucun", "15 jours", "1 mois"][Math.floor(Math.random() * 3)],
            terms: "",
            rating: Number(rating.toFixed(1)),
            isMandatory: i === 0 && rating > 4.5, // Make the first high rating one "Recommended"
            tag: i === 0 ? "Recommandé" : (i === 1 ? "Meilleur Prix" : undefined)
        });
    }
    
    return offers;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OfferCard({ offer, index }: { offer: InsuranceOffer; index: number }) {
    const IconComp = TYPE_ICONS[offer.insuranceType] || ShieldCheck;

    return (
        <motion.div
            key={offer.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.6 } }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-[#050505] border ${offer.isMandatory ? 'border-white/40' : 'border-white/10'} hover:border-white/30 transition-all duration-700 group relative shadow-2xl flex flex-col lg:flex-row items-stretch`}
        >
            {/* Left Insurer Panel */}
            <div className="p-6 lg:w-64 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 relative z-10 bg-white/[0.01]">
                <div className={`w-16 h-16 bg-black border border-white/10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-white/30 transition-all duration-700`}>
                    <IconComp size={24} className="text-white" />
                </div>
                <div className="text-center mt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-white block mb-1">
                        {offer.insurer}
                    </span>
                    <div className="flex gap-0.5 justify-center text-white">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < Math.floor(offer.rating) ? "currentColor" : "none"} className={i < Math.floor(offer.rating) ? "" : "text-gray-800"} />
                        ))}
                    </div>
                </div>
                {offer.isMandatory && (
                    <span className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-white text-black border border-white/20 rounded-full">
                        Notre Recommandation
                    </span>
                )}
            </div>

            {/* Center Main Info */}
            <div className="p-6 lg:p-8 flex-1 relative z-10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {offer.tag && !offer.isMandatory && (
                                <span className={`bg-white/10 text-white border border-white/20 text-[9px] font-black uppercase px-3 py-1 tracking-widest`}>
                                    {offer.tag}
                                </span>
                            )}
                            {offer.insuranceSubType && (
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                                    {offer.insuranceSubType}
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold uppercase font-oswald text-white leading-none tracking-tight">
                            {offer.insuranceType}
                        </h3>
                    </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-4 border-y border-white/5 mb-4">
                    <div>
                        <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Garanties Max</span>
                        <span className="text-sm font-black text-white">{(offer.coverageAmount / 1000000).toFixed(1)}M <small className="text-gray-500 font-bold">FCFA</small></span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Franchise</span>
                        <span className="text-sm font-black text-white">{offer.franchise > 0 ? `${offer.franchise.toLocaleString()} F` : "0 F"}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Délai Carence</span>
                        <span className="text-sm font-black text-white">{offer.waitingPeriod}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Validité</span>
                        <span className="text-sm font-black text-white">{offer.duration}</span>
                    </div>
                </div>

                {/* Guarantees */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {offer.guarantees.map(g => (
                        <div key={g} className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-sm group-hover:border-white/20 transition-colors duration-700">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                            <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider font-inter">{g}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Price & CTA Panel */}
            <div className="p-6 lg:w-72 bg-white/[0.02] flex flex-col justify-center items-center gap-4 lg:border-l border-white/5 relative z-10">
                <div className="text-center w-full mb-2">
                    <span className="block text-[9px] uppercase font-bold text-gray-600 tracking-widest mb-2">
                        {offer.category === "VIE" && offer.insuranceType === "Épargne & Retraite" ? "Versement Mensuel" : "Prime Annuelle"}
                    </span>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-black text-white tabular-nums">
                            {offer.premium.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mt-1 block">F.CFA</span>
                </div>
                
                <div className="w-full space-y-2">
                    <Link href={`/assureur/${offer.insurerSlug}`} className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-700 flex items-center justify-center gap-2">
                        Voir l'offre <ChevronRight size={14} />
                    </Link>
                    <Link href="/souscription" className="w-full border border-white/10 bg-black flex items-center justify-center text-center text-gray-400 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white hover:border-white/30 transition-all duration-700">
                        Souscrire
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

function CustomSelect({ 
    options, 
    value, 
    onChange, 
}: { 
    options: { value: string; label: string }[]; 
    value: string; 
    onChange: (val: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div ref={ref} className="relative w-full">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center cursor-pointer py-1"
            >
                <span className="text-[10px] font-black uppercase tracking-widest text-white truncate mr-2">{selectedLabel}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#050505] border border-white/10 shadow-2xl z-50 overflow-hidden"
                    >
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors ${value === opt.value ? 'bg-white/10 text-white' : "text-gray-500 hover:bg-white/5 hover:text-white"}`}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComparisonTool() {
    const [activeCategory, setActiveCategory] = useState<InsuranceCategory>("IARDT");
    const [searchQuery, setSearchQuery] = useState("");
    const [budget, setBudget] = useState<number>(500000);
    const [selectedType, setSelectedType] = useState<string>("Tous");
    const [sortBy, setSortBy] = useState<SortKey>("premium");
    const [offers, setOffers] = useState<InsuranceOffer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulate network request with standalone engine
        setLoading(true);
        const timer = setTimeout(() => {
            let mockData = generateMockOffers(activeCategory, selectedType, budget);
            
            // Client-side search
            if (searchQuery) {
                mockData = mockData.filter(o => 
                    o.insurer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.insuranceType.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            // Client-side sort
            mockData.sort((a, b) => {
                if (sortBy === "premium") return a.premium - b.premium;
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "coverage") return b.coverageAmount - a.coverageAmount;
                return 0;
            });
            
            setOffers(mockData);
            setLoading(false);
        }, 800); // Artificial delay to show loading state

        return () => clearTimeout(timer);
    }, [activeCategory, selectedType, budget, searchQuery, sortBy]);

    const handleCategoryChange = (cat: InsuranceCategory) => {
        setActiveCategory(cat);
        setSelectedType("Tous");
    };

    return (
        <div className="min-h-screen bg-black text-white">
            
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="pt-32 pb-16 px-6 lg:px-12 border-b border-white/5 bg-[#020202] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 block">
                        Comparateur Indépendant
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold font-oswald text-white mb-6 uppercase tracking-tighter">
                        Analysez <span className="text-gray-600">Le Marché</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                        Trouvez les offres les plus compétitives du marché béninois. Notre algorithme analyse en temps réel les primes, garanties et franchises pour vous proposer l'excellence.
                    </p>
                </div>
            </div>

            {/* ── Main Content ───────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                
                {/* Category Tabs */}
                <div className="flex gap-2 justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 border whitespace-nowrap ${isActive
                                    ? "bg-white text-black border-white"
                                    : "bg-[#050505] text-gray-500 border-white/10 hover:text-white hover:border-white/30"
                                }`}
                            >
                                {cat.labelShort}
                            </button>
                        );
                    })}
                </div>

                {/* Filters Bar */}
                <div className="bg-[#050505] border border-white/10 p-4 mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sticky top-24 z-40 shadow-2xl">
                    {/* Search */}
                    <div className="px-6 py-3 border-b md:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Search size={12} className="text-gray-500" />
                            <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Recherche</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Nom de l'assureur..."
                            className="w-full text-[11px] font-black uppercase tracking-widest bg-transparent outline-none text-white placeholder:text-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="px-6 py-3 border-b md:border-b-0 lg:border-r border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Filter size={12} className="text-gray-500" />
                            <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Type</span>
                        </div>
                        <CustomSelect
                            value={selectedType}
                            onChange={(val) => setSelectedType(val)}
                            options={[{value: "Tous", label: "Tous les types"}, ...TYPE_LISTS[activeCategory].map(t => ({ value: t, label: t }))]}
                        />
                    </div>

                    {/* Sort */}
                    <div className="px-6 py-3 border-b md:border-b-0 lg:border-r border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowUpDown size={12} className="text-gray-500" />
                            <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Trier par</span>
                        </div>
                        <CustomSelect
                            value={sortBy}
                            onChange={(val) => setSortBy(val as SortKey)}
                            options={[
                                { value: "premium", label: "Prix Croissant" },
                                { value: "rating", label: "Indice Confiance" },
                                { value: "coverage", label: "Protection Max" },
                            ]}
                        />
                    </div>

                    {/* Budget */}
                    <div className="px-6 py-3 flex flex-col justify-center">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Coins size={12} className="text-gray-500" />
                                <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Budget Max</span>
                            </div>
                            <span className="text-[11px] font-black text-white tabular-nums">{budget.toLocaleString()} F</span>
                        </div>
                        <input
                            type="range" min="10000" max="1000000" step="10000"
                            value={budget} onChange={(e) => setBudget(parseInt(e.target.value))}
                            className="w-full h-[2px] bg-white/10 appearance-none cursor-pointer accent-white"
                        />
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
                        <span className="text-white font-black text-base">{offers.length}</span> Solutions Identifiées
                    </p>
                    <div className="flex items-center gap-2 text-gray-600">
                        <SlidersHorizontal size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Vue Détaillée</span>
                    </div>
                </div>

                {/* Results List */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-32 flex flex-col items-center gap-6"
                        >
                            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse">
                                Analyse du marché en cours...
                            </p>
                        </motion.div>
                    ) : offers.length > 0 ? (
                        <div className="space-y-6">
                            {offers.map((offer, index) => (
                                <OfferCard key={offer.id} offer={offer} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#050505] p-24 text-center border border-white/5"
                        >
                            <AlertCircle size={32} className="text-gray-700 mx-auto mb-8" />
                            <h3 className="text-2xl font-bold uppercase font-oswald text-white mb-4 tracking-widest">
                                Aucun Résultat
                            </h3>
                            <p className="text-gray-500 text-sm font-light max-w-md mx-auto uppercase tracking-widest leading-loose">
                                Vos critères sont trop stricts. Essayez d'augmenter votre budget ou d'élargir le type de couverture.
                            </p>
                            <button
                                onClick={() => { setBudget(1000000); setSearchQuery(""); setSelectedType("Tous"); }}
                                className="mt-8 text-[10px] font-black uppercase border-b border-white/30 pb-2 text-white/50 hover:text-white hover:border-white transition-all duration-700 tracking-[0.3em]"
                            >
                                Réinitialiser les filtres
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
