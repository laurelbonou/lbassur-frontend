"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Heart, Briefcase, FileText, Anchor, Truck, Home, Car, TrendingDown, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import BookingSection from "@/components/BookingSection";

const categories = [
    { id: "sante", label: "Santé", icon: Activity },
    { id: "dommages", label: "Dommages", icon: Shield },
    { id: "vie", label: "Vie", icon: Heart },
    { id: "credit", label: "Crédit Caution", icon: Briefcase },
];

const servicesData = {
    sante: [
        {
            title: "Assurance Santé Particulier",
            description: "Couvre les frais médicaux, hospitaliers et soins de santé pour les individus : étudiants, salariés, commerçants, artisans...",
            icon: Users,
            bgClass: "bg-blue-500/10",
            textClass: "text-blue-400"
        },
        {
            title: "Assurance Santé Groupe",
            description: "Souscrite par les entreprises pour couvrir les frais liés à la santé de leurs employés : consultations, hospitalisations...",
            icon: Users,
            bgClass: "bg-blue-500/10",
            textClass: "text-blue-400"
        },
        {
            title: "Santé : Autofinancement",
            description: "Permet aux entreprises de gérer un budget prévisionnel santé ajusté aux dépenses réelles de leur personnel.",
            icon: TrendingDown,
            bgClass: "bg-blue-500/10",
            textClass: "text-blue-400"
        }
    ],
    dommages: [
        { title: "Automobile", description: "Couverture des véhicules terrestres à moteur, remorques et semi-remorques.", icon: Car, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Multirisque Habitation / Pro", description: "Bâtiments et contenu contre incendie, vol, bris de glace, dégâts des eaux...", icon: Home, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Bris de Machine", description: "Couverture des machines à forte puissance contre erreurs de manutention, court-circuits...", icon: AlertTriangle, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Perte d'Exploitation", description: "Perte de marge durant la cessation d'activité suite à un sinistre garanti.", icon: TrendingDown, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "RC Décennale", description: "Dommages d'effondrement sur 10 ans après réception définitive de l'ouvrage.", icon: Shield, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "RC Chef d'entreprise", description: "Dommages causés aux tiers en environnement professionnel.", icon: Briefcase, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "RC Chef de Famille", description: "Dommages causés aux tiers en environnement privé.", icon: Users, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Assurance Transports", description: "Biens contre risques liés aux transports maritime, aérien, terrestre et fluvial.", icon: Anchor, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Individuelle Accidents", description: "Frais médicaux, invalidité et décès découlant d'un accident.", icon: Activity, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Violence Politique", description: "Dommages matériels et corporels en cas de soulèvement d'ordre politique.", icon: AlertTriangle, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Tous Risques Montage", description: "Dommages matériels pendant la période de montage des matériaux.", icon: Shield, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
        { title: "Assurance Voyage", description: "Frais de soins liés à maladie ou accident survenus hors du territoire national.", icon: Truck, bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
    ],
    vie: [
        { title: "Retraite Complémentaire", description: "Épargne destinée à compléter la pension octroyée par la CNSS ou la FNRB à la retraite.", icon: Heart, bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
        { title: "Prévoyance Décès", description: "Capital versé aux ayants droit désignés en cas de décès de l'assuré.", icon: Shield, bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
        { title: "Indemnité de Fin de Carrière", description: "Transfert et gestion des fonds de droits acquis pour optimiser la retraite.", icon: Briefcase, bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
        { title: "Assurance Frais Funéraires", description: "Capital versé en 72h pour la prise en charge des frais funéraires.", icon: Heart, bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
    ],
    credit: [
        { title: "Cautions sur marchés", description: "Caution de soumission, avance de démarrage, bonne fin d'exécution, retenue de garantie...", icon: FileText, bgClass: "bg-slate-500/10", textClass: "text-slate-400" },
        { title: "Cautions commerciales", description: "Cautions fournisseur, douanières, fiscales, d'exploitation, locatives...", icon: FileText, bgClass: "bg-slate-500/10", textClass: "text-slate-400" },
        { title: "Garanties indirectes", description: "Garantie financement de marché et bons de commande via les établissements bancaires.", icon: Briefcase, bgClass: "bg-slate-500/10", textClass: "text-slate-400" },
    ]
};

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("sante");

    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] -z-0"></div>
                <div className="container mx-auto max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <span className="glass inline-block py-2 px-6 rounded-full text-[10px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-8">
                            Ce que nous faisons
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter font-oswald text-white mb-8">
                            Nos Services
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            Des solutions d'assurance complètes pour particuliers, entreprises et institutions.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="py-10 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-full text-[13px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
                                        isActive 
                                            ? "bg-white text-black scale-105" 
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {servicesData[activeTab as keyof typeof servicesData].map((service, idx) => (
                                    <div 
                                        key={idx} 
                                        className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.05] transition-all duration-500 group"
                                    >
                                        <div className={`w-14 h-14 rounded-xl ${service.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <service.icon className={service.textClass} size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold uppercase font-oswald text-white mb-4 tracking-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-400 font-light leading-relaxed text-sm">
                                            {service.description}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <BookingSection />
            <Footer />
        </main>
    );
}
