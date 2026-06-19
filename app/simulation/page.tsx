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
        <main className="bg-black text-white min-h-screen relative overflow-hidden">
            <Navbar />

            <div className="pt-40 pb-32 container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 rounded-full mb-6 border border-white/10 bg-white/5"
                        >
                            <span className="text-white font-bold uppercase tracking-[0.4em] text-[9px]">Calcul Temps Réel</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 text-white tracking-tight">
                            Simulation <span className="text-gray-500">Intelligente</span>
                        </h1>
                        <p className="text-gray-400 font-light text-lg max-w-xl mx-auto">
                            Précisez vos besoins pour obtenir une analyse instantanée et comparer les primes de plusieurs compagnies.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-3 mb-16 px-2">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex-1 flex flex-col gap-3">
                                <div
                                    className={`h-1 flex-1 transition-all duration-1000 ${idx <= currentStepIndex ? "bg-white" : "bg-white/10"}`}
                                />
                                <span className={`text-[8px] uppercase tracking-widest font-black text-center transition-colors duration-700 ${idx <= currentStepIndex ? "text-white" : "text-gray-600"}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[450px]">
                        <AnimatePresence mode="wait">
                            {/* ÉTAPE 1: Catégorie */}
                            {currentStep.id === "category" && (
                                <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }} className="space-y-6">
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Choisir un Domaine</h2>
                                    <div className="grid grid-cols-1 gap-5">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => updateForm("category", cat.id)}
                                                className="bg-white/5 p-10 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-8">
                                                    <div className={`w-16 h-16 bg-black rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-black`}>
                                                        <cat.icon size={28} className="text-white group-hover:text-black transition-colors" />
                                                    </div>
                                                    <span className="font-bold uppercase tracking-[0.3em] text-[12px] text-white transition-all duration-500 group-hover:translate-x-2">{cat.title}</span>
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
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Nature du Contrat</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {SUB_TYPES[formData.category]?.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => updateForm("type", type)}
                                                className="bg-white/5 py-8 px-6 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-center font-bold uppercase text-[10px] tracking-[0.3em] text-white"
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
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Usage du Véhicule</h2>
                                    <div className="grid grid-cols-1 gap-5">
                                        {[
                                            { val: "Promenade & Affaires", desc: "Privé & Professionnel standard", icon: Briefcase },
                                            { val: "Transport Propre Compte", desc: "Transport de vos propres biens", icon: Car },
                                        ].map(item => (
                                            <button key={item.val} onClick={() => updateForm("autoUsage", item.val)} className="bg-white/5 p-8 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left group">
                                                <div className="flex items-center gap-6 mb-3">
                                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-500 border border-white/10">
                                                        <item.icon size={18} className="text-white group-hover:text-black transition-colors" />
                                                    </div>
                                                    <span className="font-bold uppercase tracking-[0.2em] text-[11px] text-white">{item.val}</span>
                                                </div>
                                                <p className="text-gray-400 text-[10px] pl-16 font-light">{item.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <BackButton onClick={prevStep} />
                                </motion.div>
                            )}

                            {currentStep.id === "autoPower" && (
                                <motion.div key="autoPower" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Puissance Fiscale</h2>
                                    <div className="grid grid-cols-2 gap-5">
                                        {["7-10 CV", "11-14 CV"].map(val => (
                                            <button key={val} onClick={() => updateForm("autoPower", val)} className="bg-white/5 p-12 border border-white/10 hover:border-white hover:bg-white hover:text-black group transition-all duration-500 text-center flex flex-col items-center justify-center">
                                                <span className="font-black uppercase text-3xl tracking-widest text-white group-hover:text-black mb-4 transition-colors">{val}</span>
                                                <div className="h-[1px] w-8 bg-white/20 group-hover:bg-black/20 mb-4 transition-colors"></div>
                                                <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-600 uppercase tracking-widest leading-none transition-colors">{val === "7-10 CV" ? "Berline / Compacte" : "SUV / Premium"}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <BackButton onClick={prevStep} />
                                </motion.div>
                            )}

                            {currentStep.id === "autoEnergy" && (
                                <motion.div key="autoEnergy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Motorisation</h2>
                                    <div className="grid grid-cols-2 gap-5">
                                        {["Essence", "Diesel"].map(val => (
                                            <button key={val} onClick={() => updateForm("autoEnergy", val)} className="bg-white/5 p-12 border border-white/10 hover:border-white/40 hover:bg-white/10 group transition-all duration-500 text-center flex flex-col items-center gap-6">
                                                <div className={`w-16 h-16 bg-black border border-white/10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white`}>
                                                    <Zap size={24} className="text-white group-hover:text-black transition-colors" />
                                                </div>
                                                <span className="font-black uppercase text-xl tracking-[0.3em] text-white">{val}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <BackButton onClick={prevStep} />
                                </motion.div>
                            )}

                            {currentStep.id === "autoDuration" && (
                                <motion.div key="autoDuration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Durée de Couverture</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {["1 MOIS", "2 MOIS", "3 MOIS", "6 MOIS", "1 AN"].map(val => (
                                            <button key={val} onClick={() => updateForm("autoDuration", val)} className="bg-white/5 py-8 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-center flex flex-col items-center gap-4 group">
                                                <Clock size={16} className="text-white group-hover:text-black transition-all duration-500 group-hover:scale-110" />
                                                <span className="font-bold uppercase text-[10px] tracking-widest">{val}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <BackButton onClick={prevStep} />
                                </motion.div>
                            )}

                            {/* ÉTAPE PRIORITY */}
                            {currentStep.id === "priority" && (
                                <motion.div key="priority" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                    <h2 className="text-2xl font-bold mb-10 uppercase text-center text-gray-500 tracking-widest">Objectif Prioritaire</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {["Prix minimum", "Couverture maximale", "Rapport Qualité/Prix"].map(p => (
                                            <button key={p} onClick={() => updateForm("priority", p)} className="bg-white/5 py-8 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all duration-500 uppercase text-[11px] font-black tracking-[0.3em] text-white">
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <BackButton onClick={prevStep} />
                                </motion.div>
                            )}

                            {/* RÉSULTAT */}
                            {currentStep.id === "result" && (
                                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-center">
                                    {loading ? (
                                        <div className="py-20 flex flex-col items-center gap-8">
                                            <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                                            <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Analyse des tarifs en cours...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                                                className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-10 text-white shadow-lg"
                                            >
                                                <Check size={48} />
                                            </motion.div>

                                            {formData.type === "Assurance Auto" ? (
                                                <>
                                                    <h2 className="text-4xl font-bold uppercase mb-4 text-white tracking-tight">Analyse Terminée</h2>
                                                    <p className="text-gray-400 mb-12 font-light text-lg">
                                                        Comparatif RC Obligatoire — {formData.autoUsage} · {formData.autoPower} · {formData.autoEnergy} · {formData.autoDuration}
                                                    </p>

                                                    {/* Grille comparative multi-assureurs */}
                                                    <div className="grid grid-cols-1 gap-4 mb-12 text-left">
                                                        {results.length > 0 ? (
                                                            results.map((ins, i) => {
                                                                const isLowest = ins.price === Math.min(...results.map(r => r.price as number));
                                                                return (
                                                                    <motion.div
                                                                        key={`${ins.name}-${i}`}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.1 * i + 0.3 }}
                                                                        className={`bg-white/5 p-6 border relative overflow-hidden group ${isLowest ? "border-white bg-white/10" : "border-white/10 hover:border-white/30 transition-colors"}`}
                                                                    >
                                                                        {isLowest && (
                                                                            <div className="absolute top-0 left-0 w-full h-[4px] bg-white" />
                                                                        )}
                                                                        <div className="flex items-center justify-between gap-4">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-12 h-12 bg-black border border-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                                                                                    <Shield size={20} className="text-white" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <span className="font-bold uppercase text-[10px] tracking-widest text-white">{ins.name}</span>
                                                                                        {ins.tag && (
                                                                                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isLowest ? "bg-white text-black" : "bg-white/10 text-gray-300 border border-white/10"}`}>
                                                                                                {ins.tag}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <p className="text-[9px] text-gray-400 font-light">{ins.guarantees}</p>
                                                                                    {ins.rating && (
                                                                                        <div className="flex items-center gap-1 mt-1">
                                                                                            {Array.from({ length: 5 }).map((_, j) => (
                                                                                                <Star key={j} size={8} className={j < Math.round(ins.rating!) ? "text-white fill-white" : "text-gray-600"} />
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right flex-shrink-0">
                                                                                <div className={`text-2xl font-black tabular-nums ${isLowest ? "text-white" : "text-gray-400"}`}>
                                                                                    {ins.price!.toLocaleString()}
                                                                                </div>
                                                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">F.CFA</span>
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

                                                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-12 font-light">
                                                        * Primes de référence Zone Rouge, Bénin. Tarifs définitifs selon souscription.
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="text-4xl font-bold uppercase mb-6 text-white tracking-tight">Ciblage Effectué</h2>
                                                    <p className="text-gray-400 mb-12 font-light text-lg max-w-lg mx-auto leading-relaxed">
                                                        Nous avons identifié les protocoles optimaux pour votre protection <span className="text-white font-bold uppercase tracking-widest ml-1">{formData.type}</span>.
                                                    </p>
                                                </>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-5 max-w-2xl mx-auto">
                                                <button
                                                    onClick={resetForm}
                                                    className="flex-1 border border-white/10 bg-transparent text-gray-400 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all duration-500"
                                                >
                                                    Nouvelle Session
                                                </button>
                                                <a
                                                    href={`/compare?type=${encodeURIComponent(formData.type)}`}
                                                    className="flex-[1.5] bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-200 transition-all duration-500 hover:scale-105 active:scale-95 text-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
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
            <Footer />
        </main>
    );
}

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="mt-16 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 hover:text-white transition-colors duration-500 flex items-center justify-center w-full gap-3 group">
        <span className="transition-transform duration-500 group-hover:-translate-x-1">←</span> Configuration Précédente
    </button>
);
