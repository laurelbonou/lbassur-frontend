"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Car, Heart, ChevronRight, Check, Briefcase, Zap, Clock, Coins, Star } from "lucide-react";

// ─── Tarifs L'Africaine des Assurances (Zone Rouge, RC+DR+IA) ─────────────────

type TarifMap = Record<string, Record<string, Record<string, Record<string, number>>>>;

const AFRICAINE_TARIFFS: TarifMap = {
    "Promenade & Affaires": {
        "7-10 CV": {
            "Essence": { "1 MOIS": 21537, "2 MOIS": 26474, "3 MOIS": 31413, "6 MOIS": 38201, "1 AN": 54632 },
            "Diesel": { "1 MOIS": 24765, "2 MOIS": 30625, "3 MOIS": 36486, "6 MOIS": 44545, "1 AN": 63858 }
        },
        "11-14 CV": {
            "Essence": { "1 MOIS": 24765, "2 MOIS": 30625, "3 MOIS": 36486, "6 MOIS": 44545, "1 AN": 63858 },
            "Diesel": { "1 MOIS": 29610, "2 MOIS": 36855, "3 MOIS": 44097, "6 MOIS": 54059, "1 AN": 77697 }
        }
    },
    "Transport Propre Compte": {
        "7-10 CV": {
            "Essence": { "1 MOIS": 29556, "2 MOIS": 36784, "3 MOIS": 44013, "6 MOIS": 53953, "1 AN": 78142 },
            "Diesel": { "1 MOIS": 38171, "2 MOIS": 47861, "3 MOIS": 57552, "6 MOIS": 70876, "1 AN": 102758 }
        },
        "11-14 CV": {
            "Essence": { "1 MOIS": 38171, "2 MOIS": 47861, "3 MOIS": 57552, "6 MOIS": 70876, "1 AN": 102758 },
            "Diesel": { "1 MOIS": 46390, "2 MOIS": 58429, "3 MOIS": 70467, "6 MOIS": 87021, "1 AN": 126241 }
        }
    }
};

// ─── Tarifs NOBILA Assurances TALD 2025 (Zone Rouge, S1/C1, RC+DR+IA+CEDEAO) ─

const NOBILA_PA_TARIFFS: Record<string, Record<string, number>> = {
    "7-10 CV": { "1 MOIS": 19966, "2 MOIS": 24927, "3 MOIS": 29886, "6 MOIS": 36707, "1 AN": 64609 },
    "11-14 CV": { "1 MOIS": 21449, "2 MOIS": 26834, "3 MOIS": 32217, "6 MOIS": 39621, "1 AN": 69907 },
};

const NOBILA_TPC_TARIFFS: Record<string, Record<string, number>> = {
    "7-10 CV": { "1 MOIS": 33126, "2 MOIS": 41272, "3 MOIS": 49303, "6 MOIS": 60155, "1 AN": 102274 },
    "11-14 CV": { "1 MOIS": 42625, "2 MOIS": 53484, "3 MOIS": 64229, "6 MOIS": 78813, "1 AN": 136198 },
};

// ─── Tarif CIMA (plancher légal, Zone Rouge, RC+DR+IA+CB) ────────────────────

const CIMA_PA_TARIFFS: Record<string, Record<string, number>> = {
    "7-10 CV": { "1 MOIS": 20740, "3 MOIS": 30797, "6 MOIS": 37708, "1 AN": 54633 },
    "11-14 CV": { "1 MOIS": 23975, "3 MOIS": 35872, "6 MOIS": 44051, "1 AN": 63859 },
};

// ─── Types & Données ──────────────────────────────────────────────────────────

type FormData = {
    category: string;
    type: string;
    autoUsage: string;
    autoPower: string;
    autoEnergy: string;
    autoDuration: string;
    priority: string;
};

const CATEGORIES = [
    { id: "iardt", title: "IARDT (Dommages & RC)", icon: Shield },
    { id: "personnes", title: "PERSONNES (Santé & Vie)", icon: Heart },
    { id: "vie", title: "VIE (Épargne & Retraite)", icon: Coins },
];

const SUB_TYPES: Record<string, string[]> = {
    iardt: ["Assurance Auto", "Assurance Moto", "Assurance Habitation", "Multirisque Pro", "Responsabilité Civile"],
    personnes: ["Assurance Santé", "Individuelle Accident", "Assurance Voyage"],
    vie: ["Épargne & Retraite", "Assurance Éducation", "Assurance Obsèques"],
};

// ─── Composant Principal ──────────────────────────────────────────────────────

export default function SimulationPage() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        category: "",
        type: "",
        autoUsage: "",
        autoPower: "",
        autoEnergy: "",
        autoDuration: "",
        priority: "",
    });
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const getFlowSteps = () => {
        const flow = [
            { id: "category", title: "Famille" },
            { id: "type", title: "Contrat" },
        ];

        if (formData.type === "Assurance Auto") {
            flow.push(
                { id: "autoUsage", title: "Usage" },
                { id: "autoPower", title: "Puissance" },
                { id: "autoEnergy", title: "Énergie" },
                { id: "autoDuration", title: "Durée" }
            );
        } else if (formData.type) {
            flow.push({ id: "priority", title: "Priorité" });
        }

        flow.push({ id: "result", title: "Analyse" });
        return flow;
    };

    const steps = getFlowSteps();
    const currentStep = steps[currentStepIndex];

    const computeResults = (data: FormData) => {
        setLoading(true);
        setTimeout(() => {
            const { autoUsage, autoPower, autoEnergy, autoDuration } = data;
            const newResults = [];

            // Africaine
            const africainePrice = AFRICAINE_TARIFFS[autoUsage]?.[autoPower]?.[autoEnergy]?.[autoDuration];
            if (africainePrice) {
                newResults.push({
                    name: "L'Africaine des Assurances",
                    price: africainePrice,
                    guarantees: "RC Obligatoire + Défense & Recours + Individuelle Accident",
                    tag: "Recommandé",
                    rating: 4.8,
                    logo: null
                });
            }

            // Nobila
            const nobilaTable = autoUsage === "Promenade & Affaires" ? NOBILA_PA_TARIFFS : NOBILA_TPC_TARIFFS;
            const nobilaPrice = nobilaTable[autoPower]?.[autoDuration];
            if (nobilaPrice) {
                newResults.push({
                    name: "NOBILA Assurances",
                    price: nobilaPrice,
                    guarantees: "RC Obligatoire + Défense & Recours + Individuelle Accident + Carte CEDEAO",
                    tag: "Couverture Étendue",
                    rating: 4.5,
                    logo: null
                });
            }

            // CIMA
            if (autoUsage === "Promenade & Affaires") {
                const cimaPrice = CIMA_PA_TARIFFS[autoPower]?.[autoDuration];
                if (cimaPrice) {
                    newResults.push({
                        name: "Tarif Légal CIMA",
                        price: cimaPrice,
                        guarantees: "RC Obligatoire + Défense & Recours + Individuelle Accident + Carte Brune",
                        tag: "Plancher Minimum",
                        rating: 4.0,
                        logo: null
                    });
                }
            }

            newResults.sort((a, b) => a.price - b.price);
            setResults(newResults);
            setLoading(false);
        }, 1500);
    };

    const nextStep = () => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        
        if (steps[nextIdx]?.id === "result" && formData.type === "Assurance Auto") {
            computeResults(formData);
        }
    };

    const prevStep = () => setCurrentStepIndex(p => p - 1);

    const updateForm = (key: keyof FormData, value: string) => {
        const newData = { ...formData, [key]: value };
        setFormData(newData);
        
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);

        if (steps[nextIdx]?.id === "result" && formData.type === "Assurance Auto") {
            computeResults(newData);
        }
    };

    const resetForm = () => {
        setCurrentStepIndex(0);
        setFormData({ category: "", type: "", autoUsage: "", autoPower: "", autoEnergy: "", autoDuration: "", priority: "" });
        setResults([]);
    };

    return (
        <main className="bg-black text-white min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row pt-[80px]">
                {/* PARTIE GAUCHE : IMAGE (Visible uniquement sur Desktop) */}
                <div className="hidden lg:block lg:w-1/2 relative bg-black border-r border-white/10">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop" 
                            alt="Luxury Car Dark" 
                            className="w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-end p-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 rounded-full mb-6 border border-white/10 bg-white/5 w-max"
                        >
                            <span className="text-white font-bold uppercase tracking-[0.4em] text-[9px]">Calcul Temps Réel</span>
                        </motion.div>
                        <h1 className="text-5xl xl:text-7xl font-bold uppercase mb-6 text-white tracking-tight leading-none">
                            Simulation <br/><span className="text-gray-500">Intelligente</span>
                        </h1>
                        <p className="text-gray-400 font-light text-lg max-w-md">
                            L'excellence de la protection, modélisée selon vos exigences. Précisez vos besoins pour obtenir une analyse instantanée.
                        </p>
                    </div>
                </div>

                {/* PARTIE DROITE : FORMULAIRE */}
                <div className="w-full lg:w-1/2 flex flex-col relative bg-black">
                    <div className="flex-1 overflow-y-auto p-6 lg:p-16 xl:p-24 flex flex-col justify-center min-h-[calc(100vh-80px)]">
                        
                        {/* Mobile Header (Only visible on small screens) */}
                        <div className="lg:hidden mb-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-4 py-1 rounded-full mb-6 border border-white/10 bg-white/5"
                            >
                                <span className="text-white font-bold uppercase tracking-[0.4em] text-[9px]">Calcul Temps Réel</span>
                            </motion.div>
                            <h1 className="text-4xl font-bold uppercase mb-4 text-white tracking-tight">
                                Simulation <span className="text-gray-500">Intelligente</span>
                            </h1>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-2 lg:gap-3 mb-16 px-2">
                            {steps.map((s, idx) => (
                                <div key={s.id} className="flex-1 flex flex-col gap-3">
                                    <div
                                        className={`h-1 flex-1 transition-all duration-1000 ${idx <= currentStepIndex ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/10"}`}
                                    />
                                    <span className={`text-[7px] lg:text-[8px] uppercase tracking-widest font-black text-center transition-colors duration-700 ${idx <= currentStepIndex ? "text-white" : "text-gray-600 hidden sm:block"}`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {/* ÉTAPE 1: Catégorie */}
                                {currentStep.id === "category" && (
                                    <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }} className="space-y-6">
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Choisir un Domaine</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => updateForm("category", cat.id)}
                                                    className="bg-white/5 p-6 lg:p-8 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-black rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-black`}>
                                                            <cat.icon size={24} className="text-white group-hover:text-black transition-colors" />
                                                        </div>
                                                        <span className="font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[10px] lg:text-[12px] text-white transition-all duration-500 group-hover:translate-x-2 text-left">{cat.title}</span>
                                                    </div>
                                                    <ChevronRight className="text-gray-500 group-hover:text-white transition-all duration-500 group-hover:translate-x-2" size={20} />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* ÉTAPE 2: Type */}
                                {currentStep.id === "type" && (
                                    <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Nature du Contrat</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {SUB_TYPES[formData.category]?.map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => updateForm("type", type)}
                                                    className="bg-white/5 py-8 px-6 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-center font-bold uppercase text-[9px] lg:text-[10px] tracking-[0.2em] lg:tracking-[0.3em] text-white"
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {/* ÉTAPES AUTO */}
                                {currentStep.id === "autoUsage" && (
                                    <motion.div key="autoUsage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Usage du Véhicule</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { val: "Promenade & Affaires", desc: "Privé & Professionnel standard", icon: Briefcase },
                                                { val: "Transport Propre Compte", desc: "Transport de vos propres biens", icon: Car },
                                            ].map(item => (
                                                <button key={item.val} onClick={() => updateForm("autoUsage", item.val)} className="bg-white/5 p-6 lg:p-8 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left group">
                                                    <div className="flex items-center gap-4 lg:gap-6 mb-3">
                                                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-500 border border-white/10">
                                                            <item.icon size={16} className="text-white group-hover:text-black transition-colors" />
                                                        </div>
                                                        <span className="font-bold uppercase tracking-[0.2em] text-[10px] lg:text-[11px] text-white">{item.val}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-[9px] lg:text-[10px] pl-12 lg:pl-16 font-light">{item.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {currentStep.id === "autoPower" && (
                                    <motion.div key="autoPower" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Puissance Fiscale</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["7-10 CV", "11-14 CV"].map(val => (
                                                <button key={val} onClick={() => updateForm("autoPower", val)} className="bg-white/5 p-8 lg:p-12 border border-white/10 hover:border-white hover:bg-white hover:text-black group transition-all duration-500 text-center flex flex-col items-center justify-center">
                                                    <span className="font-black uppercase text-2xl lg:text-3xl tracking-widest text-white group-hover:text-black mb-4 transition-colors">{val}</span>
                                                    <div className="h-[1px] w-8 bg-white/20 group-hover:bg-black/20 mb-4 transition-colors"></div>
                                                    <span className="text-[8px] lg:text-[9px] font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-widest leading-none transition-colors">{val === "7-10 CV" ? "Berline / Compacte" : "SUV / Premium"}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {currentStep.id === "autoEnergy" && (
                                    <motion.div key="autoEnergy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Motorisation</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["Essence", "Diesel"].map(val => (
                                                <button key={val} onClick={() => updateForm("autoEnergy", val)} className="bg-white/5 p-8 lg:p-12 border border-white/10 hover:border-white/40 hover:bg-white/10 group transition-all duration-500 text-center flex flex-col items-center gap-6">
                                                    <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-black border border-white/10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white`}>
                                                        <Zap size={20} className="text-white group-hover:text-black transition-colors" />
                                                    </div>
                                                    <span className="font-black uppercase text-lg lg:text-xl tracking-[0.2em] lg:tracking-[0.3em] text-white">{val}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {currentStep.id === "autoDuration" && (
                                    <motion.div key="autoDuration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Durée de Couverture</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {["1 MOIS", "2 MOIS", "3 MOIS", "6 MOIS", "1 AN"].map(val => (
                                                <button key={val} onClick={() => updateForm("autoDuration", val)} className="bg-white/5 py-6 lg:py-8 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-center flex flex-col items-center gap-4 group">
                                                    <Clock size={16} className="text-white group-hover:text-black transition-all duration-500 group-hover:scale-110" />
                                                    <span className="font-bold uppercase text-[9px] lg:text-[10px] tracking-widest">{val}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {/* ÉTAPE PRIORITY */}
                                {currentStep.id === "priority" && (
                                    <motion.div key="priority" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <h2 className="text-xl lg:text-2xl font-bold mb-10 uppercase text-gray-500 tracking-widest">Objectif Prioritaire</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {["Prix minimum", "Couverture maximale", "Rapport Qualité/Prix"].map(p => (
                                                <button key={p} onClick={() => updateForm("priority", p)} className="bg-white/5 py-6 lg:py-8 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] lg:text-[11px] font-black tracking-[0.2em] lg:tracking-[0.3em] text-white">
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <BackButton onClick={prevStep} />
                                    </motion.div>
                                )}

                                {/* RÉSULTAT */}
                                {currentStep.id === "result" && (
                                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-left">
                                        {loading ? (
                                            <div className="py-20 flex flex-col items-center gap-8">
                                                <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                                                <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Analyse des tarifs en cours...</p>
                                            </div>
                                        ) : (
                                            <>
                                                {formData.type === "Assurance Auto" ? (
                                                    <>
                                                        <h2 className="text-3xl lg:text-4xl font-bold uppercase mb-4 text-white tracking-tight">Analyse Terminée</h2>
                                                        <p className="text-gray-400 mb-10 font-light text-sm lg:text-base">
                                                            Comparatif RC Obligatoire — {formData.autoUsage} · {formData.autoPower} · {formData.autoEnergy} · {formData.autoDuration}
                                                        </p>

                                                        {/* Grille comparative multi-assureurs */}
                                                        <div className="grid grid-cols-1 gap-4 mb-10 text-left">
                                                            {results.length > 0 ? (
                                                                results.map((ins, i) => {
                                                                    const isLowest = ins.price === Math.min(...results.map(r => r.price as number));
                                                                    return (
                                                                        <motion.div
                                                                            key={`${ins.name}-${i}`}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: 0.1 * i + 0.3 }}
                                                                            className={`bg-white/5 p-5 lg:p-6 border relative overflow-hidden group ${isLowest ? "border-white bg-white/10" : "border-white/10 hover:border-white/30 transition-colors"}`}
                                                                        >
                                                                            {isLowest && (
                                                                                <div className="absolute top-0 left-0 w-1 h-full bg-white" />
                                                                            )}
                                                                            <div className="flex items-center justify-between gap-4">
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black border border-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                                                                                        <Shield size={18} className="text-white" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                            <span className="font-bold uppercase text-[9px] lg:text-[10px] tracking-widest text-white">{ins.name}</span>
                                                                                            {ins.tag && (
                                                                                                <span className={`text-[7px] lg:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isLowest ? "bg-white text-black" : "bg-white/10 text-gray-300 border border-white/10"}`}>
                                                                                                    {ins.tag}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        <p className="text-[8px] lg:text-[9px] text-gray-400 font-light max-w-[150px] lg:max-w-[200px] truncate">{ins.guarantees}</p>
                                                                                        {ins.rating && (
                                                                                            <div className="flex items-center gap-1 mt-1">
                                                                                                {Array.from({ length: 5 }).map((_, j) => (
                                                                                                    <Star key={j} size={8} className={j < Math.round(ins.rating!) ? "text-white fill-white" : "text-gray-600"} />
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                                                                                    <div>
                                                                                        <div className={`text-xl lg:text-2xl font-black tabular-nums ${isLowest ? "text-white" : "text-gray-400"}`}>
                                                                                            {ins.price!.toLocaleString()}
                                                                                        </div>
                                                                                        <span className="text-[8px] lg:text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">F.CFA</span>
                                                                                    </div>
                                                                                    <a href="/souscription" className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-colors ${isLowest ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                                                                        Souscrire
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="bg-white/5 p-12 text-center border border-white/10">
                                                                    <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Aucun tarif trouvé pour cette configuration</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-[8px] lg:text-[9px] text-gray-500 uppercase tracking-widest mb-10 font-light">
                                                            * Primes de référence Zone Rouge, Bénin. Tarifs définitifs selon souscription.
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", damping: 10, delay: 0.2 }}
                                                            className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 text-white shadow-lg"
                                                        >
                                                            <Check size={40} />
                                                        </motion.div>
                                                        <h2 className="text-3xl lg:text-4xl font-bold uppercase mb-6 text-white tracking-tight">Ciblage Effectué</h2>
                                                        <p className="text-gray-400 mb-12 font-light text-base lg:text-lg max-w-lg leading-relaxed">
                                                            Nous avons identifié les protocoles optimaux pour votre protection <span className="text-white font-bold uppercase tracking-widest ml-1">{formData.type}</span>.
                                                        </p>
                                                    </>
                                                )}

                                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                                    <button
                                                        onClick={resetForm}
                                                        className="flex-1 border border-white/10 bg-transparent text-gray-400 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all duration-500"
                                                    >
                                                        Nouvelle Session
                                                    </button>
                                                    <a
                                                        href={`/compare?type=${encodeURIComponent(formData.type)}`}
                                                        className="flex-[1.5] bg-white text-black py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] hover:bg-gray-200 transition-all duration-500 hover:scale-105 active:scale-95 text-center shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center"
                                                    >
                                                        Voir les Offres
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* The Footer is now pushed down below the full screen split if scrolled, but let's hide it completely on this page to keep the immersion of a pure app-like simulator, or just let it flow naturally at the bottom. The original design had Footer. We'll leave it flowing naturally. */}
            <Footer />
        </main>
    );
}

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="mt-10 lg:mt-16 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em] lg:tracking-[0.4em] text-gray-500 hover:text-white transition-colors duration-500 flex items-center justify-start lg:justify-center w-full gap-3 group">
        <span className="transition-transform duration-500 group-hover:-translate-x-1">←</span> Configuration Précédente
    </button>
);
