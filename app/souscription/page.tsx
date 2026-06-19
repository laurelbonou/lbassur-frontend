"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, UploadCloud, CreditCard, ChevronRight, ChevronLeft, Download, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 1, title: "Informations" },
    { id: 2, title: "Documents" },
    { id: 3, title: "Paiement" },
    { id: 4, title: "Confirmation" }
];

export default function SouscriptionPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const nextStep = () => {
        if (currentStep === 3) {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setCurrentStep(4);
            }, 3000); // Simulate payment processing
        } else if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    return (
        <main className="bg-black min-h-screen text-white relative">
            <Navbar />
            
            <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 block">
                        Finalisation du Contrat
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-oswald text-white mb-8 uppercase tracking-tighter">
                        Souscription <span className="text-gray-600">Sécurisée</span>
                    </h1>

                    {/* Progress Bar */}
                    <div className="flex justify-between items-center max-w-2xl mx-auto relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 -z-10"></div>
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-white transition-all duration-700 -z-10"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        ></div>
                        
                        {STEPS.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                                    currentStep > step.id ? "bg-white text-black" : 
                                    currentStep === step.id ? "bg-black text-white border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : 
                                    "bg-black text-gray-600 border border-white/10"
                                }`}>
                                    {currentStep > step.id ? <CheckCircle size={14} /> : step.id}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest hidden md:block ${
                                    currentStep >= step.id ? "text-white" : "text-gray-600"
                                }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-[#050505] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {/* ── STEP 1: INFORMATIONS ── */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                                    <User className="text-gray-400" size={20} />
                                    <h2 className="text-lg font-black uppercase tracking-widest">Informations du Souscripteur</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nom</label>
                                        <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm" placeholder="Ex: DOE" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Prénoms</label>
                                        <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm" placeholder="Ex: John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Téléphone</label>
                                        <input type="tel" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm" placeholder="+229 XX XX XX XX" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Email</label>
                                        <input type="email" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm" placeholder="contact@exemple.com" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2 mt-4">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Immatriculation / Info Bien (Optionnel)</label>
                                        <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-white transition-colors text-sm" placeholder="Ex: AB 1234 RB" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 2: DOCUMENTS ── */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                                    <UploadCloud className="text-gray-400" size={20} />
                                    <h2 className="text-lg font-black uppercase tracking-widest">Pièces Justificatives</h2>
                                </div>

                                <p className="text-xs text-gray-400 mb-6">Afin de valider votre contrat, merci de fournir une copie de votre pièce d'identité et de la carte grise (si assurance auto).</p>

                                <div className="border-2 border-dashed border-white/20 bg-white/[0.02] p-12 flex flex-col items-center justify-center text-center hover:border-white/40 transition-colors cursor-pointer group">
                                    <UploadCloud size={32} className="text-gray-600 group-hover:text-white transition-colors mb-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Glissez vos fichiers ici</span>
                                    <span className="text-xs text-gray-500">ou cliquez pour parcourir (PDF, JPG, PNG)</span>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/10">
                                    <CheckCircle size={16} className="text-gray-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Passeport_John_Doe.pdf (Simulé)</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 3: PAIEMENT ── */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 relative"
                            >
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white animate-pulse">Traitement Sécurisé en cours...</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                                    <CreditCard className="text-gray-400" size={20} />
                                    <h2 className="text-lg font-black uppercase tracking-widest">Règlement</h2>
                                </div>

                                <div className="bg-white/5 border border-white/10 p-6 mb-8 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Montant à Payer</span>
                                    <span className="text-2xl font-black text-white tabular-nums">150 000 <small className="text-xs text-gray-500">F.CFA</small></span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="border border-white/20 hover:border-white bg-white/[0.02] p-6 flex flex-col items-center gap-4 transition-all duration-300 group">
                                        <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center text-black font-black text-xs">MTN</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Mobile Money</span>
                                    </button>
                                    <button className="border border-white/20 hover:border-white bg-white/[0.02] p-6 flex flex-col items-center gap-4 transition-all duration-300 group">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs"><CreditCard size={20} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Carte Visa / Mastercard</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 4: SUCCESS ── */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                                    <ShieldCheck size={48} className="text-black" />
                                </div>
                                <h2 className="text-3xl font-bold font-oswald uppercase tracking-tight text-white mb-4">Paiement Confirmé</h2>
                                <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                                    Votre souscription a bien été enregistrée. Un conseiller prendra contact avec vous dans les prochaines 24h pour la remise de la carte physique.
                                </p>

                                <button className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                    <Download size={14} />
                                    Télécharger l'Attestation Provisoire
                                </button>
                                
                                <div className="mt-8">
                                    <Link href="/" className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons (Hidden on Step 4) */}
                    {currentStep < 4 && (
                        <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-6">
                            {currentStep > 1 ? (
                                <button 
                                    onClick={prevStep}
                                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={14} /> Précédent
                                </button>
                            ) : <div></div>}

                            <button 
                                onClick={nextStep}
                                disabled={isProcessing}
                                className="flex items-center gap-2 bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {currentStep === 3 ? "Payer & Valider" : "Continuer"} <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
