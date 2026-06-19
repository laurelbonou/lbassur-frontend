"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { IARDT_TYPES, PERSONNES_TYPES, VIE_TYPES } from "@/lib/data";
import { InsuranceCategory, InsuranceOffer } from "@/types/insurance";
import {
    Search, Filter, ArrowUpDown, ShieldCheck, ChevronRight, Coins, Zap,
    Star, Car, Bike, Truck, Home, Briefcase, Ship, Users, Heart,
    Plane, PiggyBank, GraduationCap, CreditCard, Flower2, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

const CATEGORY_IMAGES = {
    IARDT: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop", // Dark car
    PERSONNES: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop", // Dark medical/abstract
    VIE: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" // Dark building
};

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
            className={`bg-[#050505] border ${offer.isMandatory ? 'border-white/40' : 'border-white/10'} hover:border-white/30 transition-all duration-700 group relative shadow-2xl flex flex-col md:flex-row`}
        >
            {/* Insurer Panel */}
            <div className="p-6 md:w-48 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative z-10 bg-white/[0.01]">
                <div className={`w-16 h-16 bg-black border border-white/10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-white/30 transition-all duration-700`}>
                    <IconComp size={24} className="text-white" />
                </div>
                <div className="text-center mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white block mb-1">
                        {offer.insurer}
                    </span>
                    <div className="flex gap-0.5 justify-center text-white">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={8} fill={i < Math.floor(offer.rating) ? "currentColor" : "none"} className={i < Math.floor(offer.rating) ? "" : "text-gray-800"} />
                        ))}
                    </div>
                </div>
                {offer.isMandatory && (
                    <span className="mt-4 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white text-black border border-white/20 rounded-full">
                        Recommandé
                    </span>
                )}
            </div>

            {/* Main Info */}
            <div className="p-6 md:p-8 flex-1 relative z-10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {offer.tag && (
                                <span className={`bg-white text-black text-[8px] font-black uppercase px-2 py-0.5 tracking-widest`}>
                                    {offer.tag}
                                </span>
                            )}
                            {offer.insuranceSubType && (
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                                    {offer.insuranceSubType}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold uppercase font-oswald text-white leading-none tracking-tight">
                            {offer.insuranceType}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                            <span className="text-3xl font-black text-white tabular-nums">
                                {offer.premium.toLocaleString()}
                            </span>
                            <small className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">F.CFA</small>
                        </div>
                        <span className="block text-[8px] uppercase font-bold text-gray-600 tracking-widest mt-1">
                            {offer.category === "VIE" && offer.insuranceType === "Épargne & Retraite" ? "Versement Mensuel" : "Prime Totale"}
                        </span>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/5 mb-4">
                    <div>
                        <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Garanties</span>
                        <span className="text-xs font-black text-white">{(offer.coverageAmount / 1000000).toFixed(1)}M <small className="text-gray-500">FCFA</small></span>
                    </div>
                    <div>
                        <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Franchise</span>
                        <span className="text-xs font-black text-white">{offer.franchise > 0 ? `${offer.franchise.toLocaleString()} F` : "0 F"}</span>
                    </div>
                    <div>
                        <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Délai</span>
                        <span className="text-xs font-black text-white">{offer.waitingPeriod}</span>
                    </div>
                    <div>
                        <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Validité</span>
                        <span className="text-xs font-black text-white">{offer.duration}</span>
                    </div>
                </div>

                {/* Guarantees */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {offer.guarantees.map(g => (
                        <div key={g} className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-sm group-hover:border-white/20 transition-colors duration-700">
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <span className="text-[8px] font-bold uppercase text-gray-400 tracking-wider font-inter">{g}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Panel */}
            <div className="p-6 md:w-48 bg-white/[0.02] flex flex-col justify-center gap-2 md:border-l border-white/5 relative z-10">
                <Link href={`/assureur/${offer.insurerSlug}`} className="w-full bg-white text-black py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-700 flex items-center justify-center gap-2">
                    Détails <ChevronRight size={12} />
                </Link>
                <Link href="/simulation" className="w-full border border-white/10 bg-black flex items-center justify-center text-center text-gray-400 py-3 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white hover:border-white/30 transition-all duration-700">
                    Souscrire
                </Link>
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
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
                const params = new URLSearchParams({
                    category: activeCategory,
                    type: selectedType,
                    sortBy: sortBy,
                    maxPremium: budget.toString(),
                });

                if (searchQuery) params.append("q", searchQuery);

                const finalUrl = `${apiUrl}/offers?${params.toString()}`;
                const response = await fetch(finalUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    const mappedOffers = data.map((o: any) => ({
                        id: o.id,
                        category: o.category,
                        insuranceType: o.insuranceTypeLabel,
                        insuranceSubType: o.insuranceSubType,
                        insurer: o.insurer.name,
                        insurerSlug: o.insurer.slug,
                        premium: Number(o.premium),
                        coverageAmount: Number(o.coverageAmount),
                        franchise: Number(o.franchise),
                        guarantees: o.guarantees,
                        optionalGuarantees: o.optionalGuarantees,
                        exclusions: o.exclusions,
                        duration: o.duration,
                        waitingPeriod: o.waitingPeriod,
                        terms: o.terms,
                        rating: Number(o.rating),
                        isMandatory: o.isMandatory,
                        tag: o.tag,
                    }));
                    setOffers(mappedOffers);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [activeCategory, selectedType, budget, searchQuery, sortBy]);

    const handleCategoryChange = (cat: InsuranceCategory) => {
        setActiveCategory(cat);
        setSelectedType("Tous");
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black">
            {/* ── Left Side: Fixed Image ────────────────────────────────────────── */}
            <div className="lg:w-[40%] xl:w-[45%] relative hidden lg:block border-r border-white/5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={CATEGORY_IMAGES[activeCategory]}
                            alt={activeCategory}
                            fill
                            className="object-cover grayscale brightness-50 contrast-125"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-12 left-12 right-12 z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-4 block">
                        Système de Comparaison
                    </span>
                    <h1 className="text-5xl font-bold font-oswald text-white mb-4 uppercase tracking-tighter leading-none">
                        Trouvez <br />L&apos;Excellence
                    </h1>
                    <p className="text-gray-400 text-sm font-light max-w-sm">
                        Analysez et comparez les meilleures offres du marché pour faire un choix éclairé et performant.
                    </p>
                </div>
            </div>

            {/* ── Right Side: Scrollable Content ───────────────────────────────── */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020202]">
                <div className="pt-32 lg:pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full">
                    
                    {/* Header mobile only */}
                    <div className="lg:hidden mb-12">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-3 block">
                            Système de Comparaison
                        </span>
                        <h1 className="text-4xl font-bold font-oswald text-white mb-4 uppercase tracking-tighter">
                            Trouvez L&apos;Excellence
                        </h1>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                        {CATEGORIES.map(cat => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 border whitespace-nowrap ${isActive
                                        ? "bg-white text-black border-white"
                                        : "bg-black text-gray-500 border-white/10 hover:text-white hover:border-white/30"
                                    }`}
                                >
                                    {cat.labelShort}
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-[#050505] border border-white/10 p-4 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="px-4 py-2 border-b md:border-b-0 xl:border-r border-white/5 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <Search size={10} className="text-gray-500" />
                                <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Recherche</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Nom de l'assureur..."
                                className="w-full text-[10px] font-black uppercase tracking-widest bg-transparent outline-none text-white placeholder:text-gray-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Selector */}
                        <div className="px-4 py-2 border-b md:border-b-0 xl:border-r border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <Filter size={10} className="text-gray-500" />
                                <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Couverture</span>
                            </div>
                            <CustomSelect
                                value={selectedType}
                                onChange={(val) => setSelectedType(val)}
                                options={TYPE_LISTS[activeCategory].map(t => ({ value: t, label: t }))}
                            />
                        </div>

                        {/* Sort */}
                        <div className="px-4 py-2 border-b md:border-b-0 xl:border-r border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <ArrowUpDown size={10} className="text-gray-500" />
                                <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Classement</span>
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
                        <div className="px-4 py-2 flex flex-col justify-center">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                    <Coins size={10} className="text-gray-500" />
                                    <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Budget</span>
                                </div>
                                <span className="text-[9px] font-black text-white tabular-nums">{budget.toLocaleString()} F</span>
                            </div>
                            <input
                                type="range" min="10000" max="1000000" step="10000"
                                value={budget} onChange={(e) => setBudget(parseInt(e.target.value))}
                                className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-white"
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-500">
                            <span className="text-white font-black text-sm">{offers.length}</span> Solutions
                        </p>
                    </div>

                    {/* Results List */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-20 flex flex-col items-center gap-4"
                            >
                                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin"></div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">
                                    Analyse en cours...
                                </p>
                            </motion.div>
                        ) : offers.length > 0 ? (
                            <div className="space-y-4">
                                {offers.map((offer, index) => (
                                    <OfferCard key={offer.id} offer={offer} index={index} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#050505] p-16 text-center border border-white/5"
                            >
                                <AlertCircle size={24} className="text-gray-700 mx-auto mb-6" />
                                <h3 className="text-lg font-bold uppercase font-oswald text-white mb-2 tracking-widest">
                                    Aucun Résultat
                                </h3>
                                <p className="text-gray-500 text-xs font-light max-w-sm mx-auto uppercase tracking-widest leading-loose">
                                    Aucune offre ne correspond à vos critères.
                                </p>
                                <button
                                    onClick={() => { setBudget(1000000); setSearchQuery(""); setSelectedType("Tous"); }}
                                    className="mt-6 text-[9px] font-black uppercase border-b border-white/30 pb-1 text-white/50 hover:text-white hover:border-white transition-all duration-700 tracking-[0.3em]"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
